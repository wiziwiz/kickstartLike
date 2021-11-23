import web3 from './web3.js';

import CampaignFactory from './contracts/build/CompainFactory.json'
const contractAddress = '0xFe53b083418beE4eD52d3ae9e5Ccb4485a8A9852'; // '0x57f7F8A268e20c9F54A7052eF3ad5009E907A700';

const instance = new web3.sender.eth.Contract(
    CampaignFactory.abi,
    contractAddress
);
console.log(instance.abi);
export default instance;