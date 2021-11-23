import web3 from './web3';
import Campaign from './contracts/build/Campaign.json';

const getCampaign = (contractAddress) =>
{
   return new web3.sender.eth.Contract(
        Campaign.abi,
        contractAddress
    );
};

export default getCampaign;