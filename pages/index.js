import React, { Component } from 'react';
import { Button, Card } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component 
{
    static async getInitialProps()
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

        return { campaigns : campaigns, masterContract : masterContract};
    }

    async componentDidMount() 
    {
        
    }

    renderCamapaigns()
    {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });
        return <Card.Group items={items} />;
    }

    // link tag allow the route stuff
    // anker tag allows link to be clicked...
    render()
    {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route= "/campaigns/new">
                        <a>
                            <Button floated="right"
                                content="Create Campaign"
                                icon="add circle"
                                primary = {true}
                            />
                        </a>
                    </Link>
                    {this.renderCamapaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;