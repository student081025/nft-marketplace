// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface NFTCharity
{
    function updateJson(uint256 tokenId, uint256 status, uint256 donations, uint256 pay) external;
}

contract AppNFTCharity
{
    mapping (uint256 => address) private NFTContractsERC721;
    uint256[] contractsIDs;
    address private manager;

    constructor() 
    {
        manager = msg.sender;
    }

    function transferFunds(uint256 tokenId, uint256 charityId, uint256 status, uint256 donations, uint256 pay) public payable
    {
        (bool success, bytes memory data) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');

        require(status != 0,
        'The subscription is paused');
        require(block.timestamp >= status,
        'Too early');

        require(msg.value == pay,
        'The amount of money is not correct');
        require (msg.sender.balance >= msg.value,
        "Insufficient funds, replenish your balance");

        (bool success2, bytes memory data2) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("owner()"));
        require(success2,
        'The call of ownerOf(uint256) was not successful');
        (address Manager) = abi.decode(data2, (address));
       
        (bool success1, ) = payable(Manager).call{value: msg.value}("");
        require(success1, "Payment failed.");

        uint256 statusNew = block.timestamp + 1 days;
        uint256 donationsNew = donations + msg.value;

        NFTCharity(NFTContractsERC721[charityId]).updateJson(tokenId, statusNew, donationsNew, pay);
    }

    function statusChange(uint256 tokenId, uint256 charityId, uint256 status, uint256 donations, uint256 pay) public
    {
        (bool success, bytes memory data) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');
        uint256 statusNew;
        if (status == 0)
        {
            statusNew = block.timestamp + 1 days;
        }
        else
        {
            statusNew = 0;
        }

        NFTCharity(NFTContractsERC721[charityId]).updateJson(tokenId, statusNew, donations, pay);
    }

    function addNFTContract(uint256 ID, address NFTContract) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        NFTContractsERC721[ID] = NFTContract;
        contractsIDs.push(ID);
    }

    function deleteNFTContract(uint256 ID) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        for (uint i = 0; i < contractsIDs.length; i++)
        {
            if (contractsIDs[i] == ID)
            {
                for (uint j = i; j < contractsIDs.length - 1; j++)
                {
                    contractsIDs[j] = contractsIDs[j+1];
                }
                contractsIDs.pop();
                break;
            }
        }
        delete(NFTContractsERC721[ID]);
    }

    function getNFTContract(uint256 ID) public view returns(address)
    {
        return NFTContractsERC721[ID];
    }

    function getAllContracts() public view returns (uint256[] memory)
    {
        return contractsIDs;
    }

    function getTokenIdByOwner(uint256 num, uint256 charityId) public view returns (uint256, address)
    {
        (bool success, bytes memory data) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("tokenByIndex(uint256)", num));
        require(success,
        'The call of tokenByIndex(uint256) was not successful');
        (uint256 tokenId) = abi.decode(data, (uint256));

        (bool success1, bytes memory data1) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success1,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data1, (address));

        return (tokenId, owner);
    }

    function getTotalSupply(uint256 charityId) public view returns (uint256)
    {
        (bool success, bytes memory data) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("totalSupply()"));
        require(success,
        'The call of totalSupply() was not successful');

        (uint256 num) = abi.decode(data, (uint256));

        return num;
    }

    function returnURI(uint256 tokenId, uint256 charityId) public view returns(string memory)
    {

        (bool success, bytes memory data) = NFTContractsERC721[charityId].staticcall(abi.encodeWithSignature("tokenURI(uint256)",tokenId));
        require(success,
        'The call of tokenURI(uint256) was not successful');
        (string memory uri) = abi.decode(data, (string));
        return uri;
    }

}

