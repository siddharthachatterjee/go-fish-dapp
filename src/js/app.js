const App = {
  web3Provider: null,
  contracts: {},
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
     // console.log(data);
      var artifact = data;
      App.contracts.goFish = TruffleContract(artifact);
      let instance;
      App.contracts.goFish.setProvider(App.web3Provider);
      App.contracts.goFish.deployed()
        .then(inst => instance = inst)
        .then(() => {
         console.log(({...instance}));
          document.write({...instance});
          //ReactDOM.render(React.createElement(UI, {instance}, null), document.getElementById("root"))
          //ReactDOM.render(<UI instance={instance}/>, document.getElementById("root"))
        })
        .catch(err => console.err(err))

    })
   
    }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});


