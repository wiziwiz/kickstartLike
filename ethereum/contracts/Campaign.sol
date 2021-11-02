// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "./lib/CloneFactory.sol";

contract CompainFactory is CloneFactory
{
    Campaign[] public deployedCampaigns;
    address private masterContract;
    address private masterManager;
    bool private isFirstDeployed;
    

    constructor()
    {
        isFirstDeployed = true;
    }
    
    function createCampaign(uint minimum) external
    {
        
        Campaign newCampaign;
        if (isFirstDeployed)
        {
            masterManager = msg.sender;
            newCampaign = new Campaign();
            masterContract = address(newCampaign);
            isFirstDeployed = false;
        }
        else
        {
            newCampaign = Campaign(createClone(masterContract));
            newCampaign.initialize(minimum, msg.sender);
            deployedCampaigns.push(newCampaign);
        }
    }
    
    function getDeployedCampaigns() public view returns(Campaign[] memory)
    {
        return deployedCampaigns;
    }
    
    function getMasterContract() external view returns(address)
    {
        return masterContract;
    }
    
    function getMasterManager() external view returns(address)
    {
        return masterManager;
    }
}


contract Campaign
{
    struct Request
    {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    mapping(address => bool) public approvers;
    uint public minimumContribution;
    mapping(uint => Request) public requests;
    uint private requestNb;
    uint public approversCount;
    bool private initialized;
    
    modifier restricted()
    {
        require(msg.sender == manager);
        _;
    }

    function initialize(uint minimum, address campaignManager) external
    {
        require(!initialized);
        manager = campaignManager;
        minimumContribution = minimum;
        requestNb = 0;
        approversCount = 0;
        initialized = true;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description , uint value , address payable recipient)
        restricted external payable 
    {
        Request storage req = requests[requestNb++];
        req.description     = description;
        req.value           = value;
        req.recipient       = recipient;
        req.complete        = false;
        req.approvalCount   = 0;
    }
    
    function approveRequest(uint requestIndex) external 
    {   
        Request storage req = requests[requestIndex];
        require(approvers[msg.sender]);
        require(!req.approvals[msg.sender]);
        req.approvals[msg.sender];
        req.approvalCount++;
    }
    
    function finalizeRequest(uint requestIndex) 
        external restricted
    {
        Request storage req = requests[requestIndex];
        require(!req.complete);
        require(req.approvalCount > (approversCount / 2));
        req.recipient.transfer(req.value);
        req.complete = true;
    }
}



// pragma solidity ^0.4.17;

// contract CampaignFactory {
//     address[] public deployedCampaigns;

//     function createCampaign(uint minimum) public {
//         address newCampaign = new Campaign(minimum, msg.sender);
//         deployedCampaigns.push(newCampaign);
//     }

//     function getDeployedCampaigns() public view returns (address[]) {
//         return deployedCampaigns;
//     }
// }

// contract Campaign {
//     struct Request {
//         string description;
//         uint value;
//         address recipient;
//         bool complete;
//         uint approvalCount;
//         mapping(address => bool) approvals;
//     }

//     Request[] public requests;
//     address public manager;
//     uint public minimumContribution;
//     mapping(address => bool) public approvers;
//     uint public approversCount;

//     modifier restricted() {
//         require(msg.sender == manager);
//         _;
//     }

//     function Campaign(uint minimum, address creator) public {
//         manager = creator;
//         minimumContribution = minimum;
//     }

//     function contribute() public payable {
//         require(msg.value > minimumContribution);

//         approvers[msg.sender] = true;
//         approversCount++;
//     }

//     function createRequest(string description, uint value, address recipient) public restricted {
//         Request memory newRequest = Request({
//            description: description,
//            value: value,
//            recipient: recipient,
//            complete: false,
//            approvalCount: 0
//         });

//         requests.push(newRequest);
//     }

//     function approveRequest(uint index) public {
//         Request storage request = requests[index];

//         require(approvers[msg.sender]);
//         require(!request.approvals[msg.sender]);

//         request.approvals[msg.sender] = true;
//         request.approvalCount++;
//     }

//     function finalizeRequest(uint index) public restricted {
//         Request storage request = requests[index];

//         require(request.approvalCount > (approversCount / 2));
//         require(!request.complete);

//         request.recipient.transfer(request.value);
//         request.complete = true;
//     }
// }