const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const Globs = require('./globalVars');


const provider = new HDWalletProvider(
    Globs.mnemonic,
    Globs.rinkeby
);

const web3 = new Web3(provider);

const CampaignFactory = require('./contracts/build/CompainFactory.json');
const contractAddress = '0xFe53b083418beE4eD52d3ae9e5Ccb4485a8A9852';//'0x57f7F8A268e20c9F54A7052eF3ad5009E907A700';

const factory = new web3.eth.Contract(
    CampaignFactory.abi,
    contractAddress
);
console.log("ABI : ", factory.abi);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  console.log("accounts", accounts);
  // if not enough gas error, go on inkeby network dashboard and have a 
  // look at the last block mined : gas used... 
  let masterContract = await factory.methods.getMasterContract().call();
  if (masterContract === '0x0000000000000000000000000000000000000000')
  {
    // the factory contract is deployed but createCampaign was not called yet.
    await factory.methods.createCampaign('100').send({ gas: '2500000', gasPrice: '5000000000', from: accounts[0] });
    masterContract = await factory.methods.getMasterContract().call();
    console.log('main contract : ', masterContract);
    // clone campaign
    // await factory.methods.createCampaign('100').send({ gas: '2500000', gasPrice: '5000000000', from: accounts[0] });
    // const campaigns = await factory.methods.getDeployedCampaigns().call();
    // console.log('campaigns: ', campaigns);
  }
  else{
    console.log("Main campaign already created. ", masterContract);
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log('campaigns: ', campaigns);
  }
};
deploy();
