import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Header, Table } from 'semantic-ui-react'
import { Link } from '../../../routes'
import getCampaign from '../../../ethereum/campaign';
import web3 from "../../../ethereum/web3";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component
{
    state = {
        requestNb: 0,
        requests: [],
        errorMessage: '',
        loading: false
    };
    static async getInitialProps(props)
    {
        const { address } = props.query;
        const campaign = getCampaign(address);
        let requests; 
        let requestNb; 
        let approversCount;
        try 
        {
            const accounts = await web3.sender.eth.getAccounts();
            const campaign = getCampaign(address);
            requestNb = await campaign.methods.getRequestsCount().call();
            requestNb = parseInt(requestNb)
            approversCount = await campaign.methods.approversCount().call();
            requests = await Promise.all(
                Array(requestNb)
                    .fill()
                    .map((element, index) => {
                        return campaign.methods.requests(index).call()
                    })
            );
        } 
        catch (error) 
        {
            console.log("error", error.message);
        }
        console.log("address: ", address, "requests: ", requests, "requestNb: ", requestNb, "approversCount: ", approversCount);
        return { address: address, requests: requests, requestNb: requestNb, approversCount: approversCount };
    }

    renderRows()
    {
        return this.props.requests.map((request, index) => {
            return ( 
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            );
        });
    }
    
    render()
    {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Requests</h3>

                <Link route= {`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style= {{ marginBottom: 10}}>Add Request</Button>
                    </a>
                </Link>
                
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestNb} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex