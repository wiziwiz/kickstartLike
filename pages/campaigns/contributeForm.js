import React, { Component } from "react";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import getCampaign from '../../ethereum/campaign';
import web3 from "../../ethereum/web3";
import routes, { Router } from '../../routes'

class ContributeForm extends Component
{
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        const campaign = getCampaign(this.props.address);
        try 
        {
            const accounts = await web3.sender.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.readonly.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } 
        catch (error) 
        {
            this.setState({ errorMessage: error.message });
        }
        this.setState({loading: false, value: ''});
    };

    render()
    {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input 
                        label='ether'
                        labelPosition="right"
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value})}
                    />
                </Form.Field>

                <Button primary loading={this.state.loading} >Contribute!</Button>
                <Message
                    error
                    header='Something went wrong'
                    content={this.state.errorMessage}
                />
            </Form>
        );
    }
}

export default ContributeForm;