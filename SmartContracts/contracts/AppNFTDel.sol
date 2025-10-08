// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface deliveryService
{
    function addBidInstance(uint256 tokenId, string memory deliveryAddress, uint numDayWriteOff) external;
}

contract AppNFTFood
{
    mapping (uint256 => address) private NFTContractsERC721;
    mapping (uint256 => address) private deliveryServices;
    address private manager;

    constructor() 
    {
        manager = msg.sender;
    }

    function hasNFTToFoodSubscription(uint256 foodID, address wallet) public view returns (uint256[] memory, uint256) 
    {
        (bool success, bytes memory data) = NFTContractsERC721[foodID].staticcall(abi.encodeWithSignature("tokensOfOwner(address)", wallet));
        require(success,
        'The call of tokensOfOwner(address) was not successful');
        (uint256[] memory tokensIdsOwner, uint256 size1) = abi.decode(data, (uint256[], uint256));

        return (tokensIdsOwner, size1);
    }

    function bidFormation(uint256 delId, uint256 tokenId, string memory delAddress, uint daysToWriteOff) public
    {
        (bool success, bytes memory data) = NFTContractsERC721[delId].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');
        require(daysToWriteOff <= 3,
        'You cannot write off this amount');

        deliveryService(deliveryServices[delId]).addBidInstance(tokenId, delAddress, daysToWriteOff);
    }

    function addFoodDelivery(uint256 ID, address NFTAddress, address deliveryAddress) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        NFTContractsERC721[ID] = NFTAddress;
        deliveryServices[ID] = deliveryAddress;
    }

    function deleteFoodDelivery(uint256 ID) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        delete(NFTContractsERC721[ID]);
        delete(deliveryServices[ID]);
    }

    function getContracts(uint256 ID) public view returns(address, address)
    {
        return (NFTContractsERC721[ID], deliveryServices[ID]);
    }

    function returnURI(uint256 tokenId, uint256 foodID) public view returns(string memory)
    {
        (bool success, bytes memory data) = NFTContractsERC721[foodID].staticcall(abi.encodeWithSignature("tokenURI(uint256)",tokenId));
        require(success,
        'The call of tokenURI(uint256) was not successful');
        (string memory uri) = abi.decode(data, (string));
        return uri;
    }
}
