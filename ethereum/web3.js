import Web3 from "web3";
const HDWalletProvider = require("@truffle/hdwallet-provider");

let readonly;
let sender;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") 
{
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  readonly = new Web3(window.ethereum);
  sender = readonly;
} 
else 
{
  let provider;
  // We are on the server *OR* the user is not running metamask
  const mnemonic = 'devote expand verb trouble truth output movie average universe grocery explain home';
  const rinkeby = 'https://rinkeby.infura.io/v3/3b24264d9853482393d129198e549835';

  provider = new HDWalletProvider(
      mnemonic,
      rinkeby
  );
  sender = new Web3(provider);

  provider = new Web3.providers.HttpProvider(
    rinkeby
  );
  readonly = new Web3(provider);
}

const web3 = {
  readonly: readonly,
  sender: sender
};


export default web3;