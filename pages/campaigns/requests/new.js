import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import routes, { Router, Link } from '../../../routes';
import getCampaign from '../../../ethereum/campaign';
import web3 from "../../../ethereum/web3";


class RequestNew extends Component
{
    state = {
        description: '',
        amount: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props)
    {
        const { address } = props.query;
        const accounts = await web3.sender.eth.getAccounts();
        console.log("accounts : ", accounts);
        return { address: address};
    }


    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        const campaign = getCampaign(this.props.address);
        try 
        {
            const accounts = await web3.sender.eth.getAccounts();
            await campaign.methods.createRequest(this.state.description, web3.readonly.utils.toWei(this.state.amount, 'ether'), this.state.recipient).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } 
        catch (error) 
        {
            this.setState({ errorMessage: error.message });
        }
        this.setState({loading: false, description: '', amount: '', recipient: ''});
    };

    render()
    {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.value}
                            onChange={event => this.setState({ description: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Amount in Ether</label>
                        <Input 
                            label='ether'
                            labelPosition="right"
                            value={this.state.amount}
                            onChange={event => this.setState({ amount: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value})}
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading} >Create</Button>
                    <Message
                        error
                        header='Something went wrong'
                        content={this.state.errorMessage}
                    />
                </Form>
            </Layout>
        );
    }

}

export default RequestNew