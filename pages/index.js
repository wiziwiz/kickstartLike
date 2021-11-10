import React, { Component } from 'react';
import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

class CampaignIndex extends Component 
{
    async componentDidMount() 
    {
        // we already deployed the CampaignFactory contract with the deply.js script.
        // Then we deployed a main Campaign contract and then a clone contract with the 
        // createInitialCampaigns.js script.
        // the provider here is only suitable for interrogation purposes. Can't send anything nor 
        // provide any account via infura.
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        const masterContract = await factory.methods.getMasterContract().call();
        console.log('Main contract deployed at ', masterContract);
        console.log('campaigns: ', campaigns);
    }

    render()
    {
        return <div>index</div>
    }
}

export default CampaignIndex;