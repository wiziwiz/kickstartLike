import React, { Component } from "react";
import { Card, Grid, GridColumn, Button } from "semantic-ui-react";
import Layout from '../../components/Layout';
import getCampaign from '../../ethereum/campaign';
import web3 from "../../ethereum/web3";
import ContributeForm from "./contributeForm";
import { Link } from '../../routes';

class CampaignShow extends Component{

    static async getInitialProps(props)
    {
        const campaign = getCampaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestNb: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards()
    {
        const {
            balance,
            manager,
            minimumContribution,
            requestNb,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaign and can create requests to withdraw this campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (wei).',
                description: 'You must contribute at least this minimum amount to become a contributer and approver.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestNb,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the campaign balance.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: approversCount,
                meta: 'Number of approvers.',
                description: 'Number of people who have already donated and have the ability to approve requests.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.readonly.utils.fromWei(balance, 'ether'),
                meta: 'Balance of the campaign (ether).',
                description: 'Amount of money this campaign has left to spend.',
                style: {overflowWrap: 'break-word'}
            }
        ];

        return <Card.Group items={items} />;
    }

    render() 
    {
        return(
            <Layout>
                <h3>CampaignSHow</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>   
                            {this.renderCards()}    
                            
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />    
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;