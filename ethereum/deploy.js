const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
//const { abi, evm } = require("./contracts/build/compainFactory.json");

const compiledFactory = require('./contracts/build/CompainFactory.json');

// const mnemonic = '';
// const rinkeby = '';

// const provider = new HDWalletProvider(
//     mnemonic,
//     rinkeby
// );

// const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.sender.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  // if not enough gas error, go on inkeby network dashboard and have a 
  // look at the last block mined : gas used... 
  const result = await new web3.sender.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '2500000', gasPrice: '5000000000', from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();
