import {useEffect, useState} from "react";

import logo from './logo.svg';
import './App.css';
import initWeb3 from "./initWeb3";
import GoFishContract from "./contracts/GoFish.json";

function App() {
  const [dealer, setDealer] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [hand, setHand] = useState([]);
  const [address, setAddress] = useState("");
  const [players, setPlayers] = useState([]);
  const [player, setPlayer] = useState(null);
  const [id, setId] = useState(null);
  const [joinedGame, setJoinedGame] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [joined, setJoined] = useState(false);
  const [contract, setContract] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const web3 = await initWeb3();
        console.log("Successfully connected to Web3!");
        const accountsList = await web3.eth.getAccounts();

        const networkId = await web3.eth.net.getId();
        const network = GoFishContract.networks[networkId];
        const instance = new web3.eth.Contract(GoFishContract.abi, network && network.address);

        instance.defaultAccount = accountsList[0];
        web3.eth.defaultAccount = accountsList[0];
        setAccounts(accountsList);
        setContract(instance);
        setAddress(accountsList[0]);
      } catch (err) {
        alert("Web3 failed to load");
        console.error(err);
      }
    })()
  }, [])

  useEffect(() => {
    if (contract) {
      //console.log(contract.defaultAccount);
      //console.log(accounts);
      contract.methods.dealer().call().then(res => {
        setDealer(res);
      });
      contract.methods.joined(address).call().then(res => {
        setJoined(res);
        if (res) {
          //setJoined
          contract.methods.seeHand().call({from: contract.defaultAccount}).then(res => {
            setHand(res);
          });
        }
      })
      // contract.methods.getAddress().call({from: address}).then(res => {
      //   console.log("");
      // }) 
    }
  }, [address])
  return (
    <div id = "container">
        {address ? <div>
            Playing As:
            <br />
            {address}
            <br />
            {hand && joined ? (
                <div>
                
                    Your hand:
                    {hand.map((card, i) =>(
                        <div key = {i}> {card} </div>
                    ))}
                </div>
            ) :
            <button onClick = {() => contract.methods.invite(address).send({from: address}).then(() => window.location.reload())}> Join Game </button>
            }
            <br />
            {address == dealer ?
            (<div>
            You are the dealer. Invite an account:
            <input value = {inputAddress === dealer? "" : inputAddress} onChange = {e => setInputAddress(e.target.value)} />
            <button onClick = {() => contract.methods.invite(inputAddress).send({from: address})}> Invite </button>
            </div>) : 
            <div>
            Dealer is {dealer}
            </div>}
      </div> : "Connect with an Ethereum account to interact with this page."}
    </div>
  );
}

export default App;
