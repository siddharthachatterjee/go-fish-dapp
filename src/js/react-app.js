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
                    setId(res2.c[0])
                })
            setDealer(res)
        })

    instance.seeHand()
      .then(res => {
          console.log(res);
          setHand(res)
        })
      .catch(err => alert(JSON.stringify(err)))
  // alert(instance.dealer().toString())
   // console.log(instance.players)
    // instance.drawCard()
    //   .then(res => setHand(res.toString()));
    //instance.invite()
    
    // instance.players(0)
    //   .then(res => setHand(res.toString("")))
  }, [address]);
  return (
    <div>
      {address == dealer &&
      (<div>
      Invite an account:
      <select value = {address} onChange = {e => setAddress(e.target.value)}>
        {accounts.map((account, i) => (
          <option value = {account} key = {i}> 
            {account}
          </option>
        ))}
        
      </select>
      </div>)}
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
      <button onClick = {() => instance.invite(address)}> Join Game </button>
      }
    </div>
  );
}



