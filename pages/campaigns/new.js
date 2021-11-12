import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from'../../ethereum/factory';
import web3 from '../../ethereum/web3';
import routes, { Router } from '../../routes'

class CampaignNew extends Component 
{
    state = 
    {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try {
            const accounts = await web3.sender.eth.getAccounts();
            // if metamask is used, no need to specify the ammout of gas. It will calculate it for us.
            // So this could be improved.
            await factory.methods
                    .createCampaign(this.state.minimumContribution)
                    .send({
                        gas: '2500000', gasPrice: '5000000000',
                        from: accounts[0]
                    });
            Router.pushRoute('/');           
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({loading: false});
    };

    render()
    {
        return (
            <Layout>
                <h3>Create a campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum contribution</label>
                        <Input 
                            label='wei'
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value})}
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading} >Create!</Button>
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

export default CampaignNew;