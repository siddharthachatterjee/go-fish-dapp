pragma solidity >=0.7.0 <0.9.0;

contract GoFish {
    struct Player {
        uint8 id;
        address addr;
        string[] cards;
    }
    
    enum GamePhase{Unstarted,InProcess,Finished}

    event GoFish(address player, address fisher, string rank);
    event GameStarted();
    event Fish(address target, address fisher, string rank);
    event GameFinished();
    
    string[13] rankNames = [ 
        "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"
    ];
    string[13] remRanks = rankNames;
    
    int deckSize = 52;
   // uint8 int numRanks = 13;
    mapping (string => int) rem;
    mapping (address => uint) public playerId;
    mapping (uint => uint[]) owns;
    Player[] public players;
    address public dealer;
    uint public currentPlayer = 1;
    GamePhase phase;
    uint start = block.timestamp;
    uint callsToRand = 0;
    
    
    modifier beforeGameStarts {
        if (phase == GamePhase.Unstarted) {
            _;
        } else {
            revert("This operation can only be performed before the game has started");
        }
    }
    
    modifier onlyDealer {
        if (msg.sender != dealer) {
            revert("Only the dealer can perform this operation");
        }
        _;
    }
    constructor() public {
        dealer = msg.sender;
        for (uint i = 0; i < 13; ++i) {
            rem[rankNames[i]] = 4;
        }
        invite(dealer);
    }
    
    function rand() private returns (uint) {
        callsToRand += (123456789 * 5);
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, dealer, callsToRand)));
    }
    
    function drawCard() private returns (string memory) {
        if (deckSize == 0) {
            revert("Deck is empty!");
        }
        uint x = rand() % remRanks.length;
        string memory card_ = rankNames[x];
        rem[card_]--;
        deckSize--;
      //  owns[x].push(playerId[msg.sender]);
        if (rem[card_] == 0) {
            delete remRanks[x];
        }
        return card_;
    }
    
    function drawHand(uint id) private beforeGameStarts  {
        for (uint i = 0; i < 5; ++i) {
            players[id].cards[i] = drawCard();
        }
    }
    
    function getCards(uint id) private view returns (string[] memory) {
        return players[id].cards;
    }
    
    function seeHand() public view returns (string[] memory) {
        return players[playerId[msg.sender]].cards;
    }
    
    function has(uint id, string memory rank) private returns (bool) {
        for (uint j = 0; j < players[id].cards.length; ++j) {
            if (keccak256(bytes(players[id].cards[j])) == keccak256(bytes(rank))) {
                return true;
            }
        }
        return false;
    }
    function invite(address addr) public beforeGameStarts {
        require(playerId[addr] == 0 && (addr != dealer || players.length == 0));
        if (deckSize < 5) {
            revert("Not enough cards for new player");
        }
        playerId[addr] = players.length;
        players.push(Player({
            id: uint8(players.length),
            addr: addr,
            cards: new string[](5)
        }));
        drawHand(players.length - 1);
    }
    
    function remaining(string memory rank) public view returns (int) {
        return rem[rank];
    }
    
    function startGame() public onlyDealer {
        require(players.length > 1);
        emit GameStarted();
        phase = GamePhase.InProcess;
    }
    
    function fish(address target, string memory rank) public  {
        require(phase == GamePhase.InProcess &&
                currentPlayer == playerId[msg.sender] && has(playerId[msg.sender], rank));
        bool found = false;
        uint targetId = playerId[target];
        emit Fish(target, msg.sender, rank);
        for (uint j = 0; j < players[targetId].cards.length; ++j) {
            if (keccak256(bytes(players[targetId].cards[j])) == keccak256(bytes(rank))) {
                players[playerId[msg.sender]].cards.push(rank);
                found = true;
                delete players[targetId].cards[j];
            }
        }
        if (!found) {
            emit GoFish(target, msg.sender, rank);
            if (deckSize == 0) {
                emit GameFinished();
            }
            else {
                players[playerId[msg.sender]].cards.push(drawCard());
                currentPlayer = (currentPlayer + 1) % players.length;
            }
        }
    }
    
    function declareVictory(string memory rank) public {
        require(phase == GamePhase.InProcess);
        int cnt = 0;
        for (uint i = 0; i < players[playerId[msg.sender]].cards.length; ++i) {
            if (keccak256(bytes(players[playerId[msg.sender]].cards[i])) == keccak256(bytes(rank))) 
                cnt++;
        }
        if (cnt == 4) {
            phase == GamePhase.Finished;
            emit GameFinished();
        } else {
            revert("Incorrect call!");
        }
    }
}