import Web3 from "web3";

export default () => {
    return new Promise((res, rej) => {
        window.onload = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum)
                try {
                    await window.ethereum.enable();
                    res(web3);
                } catch (err) {
                    rej(err);
                }
            }
            else if (window.web3) {
                const web3 = window.web3;
                res(web3);
            } 
            else {
                const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
                const web3 = new Web3(provider);
                res(web3);
            }
        }
    })
}