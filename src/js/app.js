// const UI = ({instance}) =>{
//   const [dealer, setDealer] = React.useState("");
//   const [accounts, setAccounts] = React.useState([]);
//   const [hand, setHand] = React.useState([]);
//   const [address, setAddress] = React.useState("");
//   React.useEffect(() => {
//     new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
//       setAccounts(accounts);
//       if (address === "")
//       setAddress(accounts[0]);
//       web3.eth.defaultAccount = web3.eth.accounts[0]
//       //personal.unlockAccount(web3.eth.defaultAccount)
//     });
//   }, [])
//   React.useEffect(() => {
//     instance.seeHand()
//       .then(res => setHand(res))

//     // instance.drawCard()
//     //   .then(res => setHand(res.toString()));
//     //instance.invite()
    
//     // instance.players(0)
//     //   .then(res => setHand(res.toString("")))
//   }, [address]);
//   return (
//     <div>
//       Choose an account:
//       <br />
//       <select value = {address} onChange = {e => setAddress(e.target.value)}>
//         {accounts.map((account, i) => (
//           <option value = {account} key = {i}> 
//             {account}
//           </option>
//         ))}
        
//       </select>
//       <br />
//       Your hand:
//       {hand.map((card, i) =>(
//         <div key = {i}> {card} </div>
//       ))}

//       <button onClick = {() => instance.invite(address).then(res => alert(res.receipt.status))}> Join Game </button>
//     </div>
//   );
// }

const App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:8545',
  dealer:null,
  accounts: null,
  currentAccount:null,
  init() {
    App.initWeb3();
  },
  initWeb3() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract() {
    fetch('GoFish.json')
     .then(res => res.json())
     .then(
     function(data) {
      //alert("hi")
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      console.log(data);
      var artifact = data;
      App.contracts.goFish = TruffleContract(artifact);
      let instance;
      App.contracts.goFish.setProvider(App.web3Provider);
      App.contracts.goFish.deployed()
        .then(inst => instance = inst)
        .then(() => {
          console.log(instance);
          ReactDOM.render(React.createElement(UI, {instance}, null), document.getElementById("root"))
          //ReactDOM.render(<UI instance={instance}/>, document.getElementById("root"))
        })
        .catch(err => alert(err))

    })
   
    }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});


