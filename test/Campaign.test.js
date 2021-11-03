const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/contracts/build/CompainFactory.json');
const compiledCampaingn = require('../ethereum/contracts/build/Campaign');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send( {from: accounts[0], gas: '3000000'} );

    // this will create original compaign to be cloned
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    });
    // clone campaign
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '3000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //take the 1st element and assign it to campaignAddress
    // when apssing an address to the Contract constructor, it will not deply a new contract. It will retrieve an already deployed one.
    campaign = await new web3.eth.Contract(
        compiledCampaingn.abi,
        campaignAddress
    );
});


describe('Campaigns', () => {
    it('deploys a factory and a campaign', () =>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value:'101',
            from: accounts[1]
        });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });

    it('requires a minimum contribution', async () => {
        try{
            const manager = await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });
            assert(false);
        }
        catch(e)
        {
            assert(e);
        }
    });

    it('allows a manager to make a request', async () => {
        await campaign.methods
            .createRequest('buy batteries', '200', accounts[2])
            .send({
                gas:'3000000',
                from: accounts[0]
            });
        const request = await campaign.methods.requests(0).call();
        assert('buy batteries', request.description);
    });

    it('processes requests', async () => {

        const reciepient = accounts[2];
        const manager = accounts[0];
        const contributor = accounts[1];


        let initialBalance = await web3.eth.getBalance(reciepient);
        initialBalance =  web3.utils.fromWei(initialBalance, 'ether');
        initialBalance = parseFloat(initialBalance);

        // contribution
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: contributor
        });
        // request
        await campaign.methods
            .createRequest('buy batteries', web3.utils.toWei('5', 'ether'), accounts[2])
            .send({
                gas:'3000000',
                from: manager
            });
        // approve
        await campaign.methods
            .approveRequest(0)
            .send({
                gas:'3000000',
                from: contributor
            });
        // finalize
        const isFinilized = await campaign.methods
            .finalizeRequest(0)
            .send({
                gas:'3000000',
                from: manager
            });
        
        let newBalance = await web3.eth.getBalance(reciepient);
        newBalance =  web3.utils.fromWei(newBalance, 'ether');
        newBalance = parseFloat(newBalance);
        
        console.log('initialBalance = ', initialBalance, ' newBalance = ', newBalance);
        assert(isFinilized);
        assert(newBalance > initialBalance);
    });

});
