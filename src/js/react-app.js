const UI = ({instance}) =>{
  const [dealer, setDealer] = React.useState("");
  const [accounts, setAccounts] = React.useState([]);
  const [hand, setHand] = React.useState([]);
  const [address, setAddress] = React.useState("");
  const [players, setPlayers] = React.useState([]);
  const [player, setPlayer] = React.useState(null);
  const [id, setId] = React.useState(null);

  React.useEffect(() => {
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      setAccounts(accounts);
     // if (address === "")
      setAddress(web3.eth.accounts[0]);
      web3.eth.defaultAccount = web3.eth.accounts[0]
      //personal.unlockAccount(web3.eth.defaultAccount)
    });
  }, [])
  React.useEffect(() => {
    instance.dealer()
        .then(res => {
            instance.playerId(address)
                .then(res2 => {
                    setId(res2.c[0]);
                    if (res2.c[0] !== 0 || address == dealer)
                        instance.players(res2.c[0])
                            .then(player_ => setPlayer(player_))
                })
            setDealer(res)
        })

    instance.seeHand()
      .then(res => {
          console.log(res);
          setHand(res)
        })
      .catch(err => alert(JSON.stringify(err)))
  }, [address]);
  return (
    <div id = "container">
        {address ? <div>
            Playing As:
            <br />
            {address}
            <br />
            {hand && (id != 0 || address == dealer) ? (
                <div>
                
                    Your hand:
                    {hand.map((card, i) =>(
                        <div key = {i}> {card} </div>
                    ))}
                </div>
            ) :
            <button onClick = {() => instance.invite(address).then(() => window.location.reload())}> Join Game </button>
            }
            <br />
            {address == dealer ?
            (<div>
            You are the dealer. Invite an account:
            <input value = {address === dealer? "" : address} onChange = {e => setAddress(e.target.value)} />
            <button onClick = {() => instance.invite(address)}> Invite </button>
            </div>) : 
            <div>
            Dealer is {dealer}
            </div>}
      </div> : "Your account is not connected to this site. Manually connect an account to your wallet(In MetaMask, for example, you can click the extension, press 3 dots  in upper right > connected sites > manually connect to current site), and reload the page."}
    </div>
  );
}



