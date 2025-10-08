// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface NFTDel
{
    function updateJson(uint256 tokenId, string memory tarrif, uint callories, uint mealsPerDay, uint plan) external;
}

contract DeliveryService {
    
    struct Bid
    {
        uint256 tokenId;
        string deliveryAddress;
        uint numDayWriteOff;
        bool status;
    }

    uint256 private _delManId = 1;
    address private contractConnectApp;
    address private contractConnectNFT;
    address private manager;

    mapping (address => uint256) delManMap;
    mapping (address => uint256[]) bidsInProcessbyDelMan;
    mapping (uint256 => Bid) bids;
    uint256[] bidsIDs;
    
    constructor()
    {
       manager = msg.sender;
    }

    function addDeliveryMan(address manAddress) public
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        require (delManMap[manAddress] == 0,
        "Delivery man has already been registered");

        uint256 newDelManId = _delManId;
        delManMap[manAddress] = newDelManId;
        _delManId += 1;
    }

    function removeDeliveryMan(address manAddress) public
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        require (delManMap[manAddress] != 0,
        "Delivery man has not been registered");

        delete delManMap[manAddress];
    }

    function addBidInstance(uint256 tokenId, string memory deliveryAddress, uint numDayWriteOff) public
    {
        require(msg.sender == contractConnectApp,
        "You do not have access to this function");
        require(bids[tokenId].numDayWriteOff == 0,
        "Bid already exists");

        Bid memory newBid = Bid(tokenId, deliveryAddress, numDayWriteOff, true);
        bids[tokenId] = newBid;
        bidsIDs.push(tokenId);
    }

    function takeOrder(uint256 bidId)  public
    {
        require (delManMap[msg.sender] != 0,
        "Delivery man has not been registered");
        require(bids[bidId].numDayWriteOff != 0,
        "Bid does not exist");
        require (bids[bidId].status != false,
        "Bid is already in delivery");

        bidsInProcessbyDelMan[msg.sender].push(bidId);
        bids[bidId].status = false;
    }

    function removeOrder(uint256 bidId)  public
    {
        require (delManMap[msg.sender] != 0,
        "Delivery man has not been registered");
        for (uint i = 0; i <  bidsInProcessbyDelMan[msg.sender].length; i++)
        {
            if (bidsInProcessbyDelMan[msg.sender][i] == bidId)
            {
                for (uint j = i; j <  bidsInProcessbyDelMan[msg.sender].length - 1; j++)
                {
                    bidsInProcessbyDelMan[msg.sender][j] =  bidsInProcessbyDelMan[msg.sender][j+1];
                }
                bidsInProcessbyDelMan[msg.sender].pop();
                break;
            }
        }
        bids[bidId].status = true;
    }

    function writeOffFood(uint256 tokenId, string memory tarrif, uint callories, uint mealsPerDay, uint plan) public
    {
        require (delManMap[msg.sender] != 0,
        "Delivery man has not been registered");
        uint numDayWriteOff = getBidById(tokenId).numDayWriteOff;
        require(plan - numDayWriteOff >= 0,
        'You cannot write off this amount');

        uint plan1 = plan - numDayWriteOff;
        NFTDel(contractConnectNFT).updateJson(tokenId, tarrif, callories, mealsPerDay, plan1);
        for (uint i = 0; i <  bidsInProcessbyDelMan[msg.sender].length; i++)
        {
            if ( bidsInProcessbyDelMan[msg.sender][i] == tokenId)
            {
                for (uint j = i; j <  bidsInProcessbyDelMan[msg.sender].length - 1; j++)
                {
                    bidsInProcessbyDelMan[msg.sender][j] =  bidsInProcessbyDelMan[msg.sender][j+1];
                }
                bidsInProcessbyDelMan[msg.sender].pop();
                break;
            }
        }

        for (uint i = 0; i < bidsIDs.length; i++)
        {
            if (bidsIDs[i] == tokenId)
            {
                for (uint j = i; j < bidsIDs.length - 1; j++)
                {
                    bidsIDs[j] = bidsIDs[j+1];
                }
                bidsIDs.pop();
                break;
            }
        }
    }

    function getBidById(uint256 Id) public view returns (Bid memory)
    {
        return bids[Id];
    }

    function getAllBids() public view returns (Bid[] memory)
    {
        uint size = bidsIDs.length;
        Bid[] memory bidsToReturn = new Bid[](size);
        for (uint i = 0; i < bidsIDs.length; i++)
        {
            bidsToReturn[i] = bids[bidsIDs[i]];
        }
        return (bidsToReturn);
    }

    function getBidsPerDelMan(address manAddress) public view returns (uint[] memory)
    {
        require (delManMap[manAddress] != 0,
        "Delivery man has not been registered");
        return  bidsInProcessbyDelMan[manAddress];
    }

    function setContractConnect(address contApp, address contNFT) public
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        contractConnectApp = contApp;
        contractConnectNFT = contNFT;
    }
}