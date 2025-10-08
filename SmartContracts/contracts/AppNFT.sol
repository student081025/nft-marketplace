// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

interface NFTFitness
{
    function updateJson(uint256 tokenId, uint256 status, string memory tariff, uint date, uint visits) external;
    function changeMintTime(uint256 tokenId, uint256 time) external;
}

contract AppNFT
{
    mapping (uint256 => address) private NFTContractsERC721;
    address private manager;

    constructor() 
    {
        manager = msg.sender;
    }

    function hasNFTToGym(uint256 gymID, address wallet) public view returns (uint256[] memory, uint256) 
    {
        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("tokensOfOwner(address)", wallet));
        require(success,
        'The call of tokensOfOwner(address) was not successful');
        (uint256[] memory tokensIdsOwner, uint256 size1) = abi.decode(data, (uint256[], uint256));

        return (tokensIdsOwner, size1);
    }

    function getDuration(uint256 gymID, uint256 tokenId, uint date) public view returns(uint256)
    {
        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("getTimeOfMint(uint256)",tokenId));
        require(success,
        'The call of getTimeOfMint(uint256) was not successful');
        (uint256 time) = abi.decode(data, (uint256));
        uint256 dueDate = time + date * 86400;

        return dueDate;
    }

    function writeOffVisit(uint256 tokenId, uint256 gymID, uint256 status, string memory tariff, uint date, uint visits) public
    {
        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');

        require(status == 1,
        'The membership is paused');

        require(visits > 0,
        'No remaining visits');

        require(block.timestamp <= getDuration(gymID, tokenId, date),
        'Your gym membership expired');

        uint visit = visits - 1;
        NFTFitness(NFTContractsERC721[gymID]).updateJson(tokenId, status, tariff, date, visit);
    }

    function pauseMembership(uint256 tokenId, uint256 gymID, uint256 status, string memory tariff, uint date, uint visits) public
    {
        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');

        require(status == 1,
        'The membership is already paused');

        uint256 statusNew = block.timestamp;
        NFTFitness(NFTContractsERC721[gymID]).updateJson(tokenId, statusNew, tariff, date, visits);
    }

    function unpauseMembership(uint256 tokenId, uint256 gymID, uint256 status, string memory tariff, uint date, uint visits) public
    {
        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("ownerOf(uint256)", tokenId));
        require(success,
        'The call of ownerOf(uint256) was not successful');
        (address owner) = abi.decode(data, (address));
        require(owner == msg.sender,
        'You do not have access to this NFT');

        require(status != 1,
        'The membership is not paused');

        (bool success1, bytes memory data1) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("getTimeOfMint(uint256)",tokenId));
        require(success1,
        'The call of getTimeOfMint(uint256) was not successful');
        (uint256 time) = abi.decode(data1, (uint256));
        
        uint256 change = time + (block.timestamp - status);
        NFTFitness(NFTContractsERC721[gymID]).changeMintTime(tokenId, change);
        NFTFitness(NFTContractsERC721[gymID]).updateJson(tokenId, 1, tariff, date, visits);
    }

    function addNFTContract(uint256 ID, address NFTContract) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        NFTContractsERC721[ID] = NFTContract;
    }

    function deleteNFTContract(uint256 ID) public 
    {
        require (msg.sender == manager,
        "Only manager can call this function");
        delete(NFTContractsERC721[ID]);
    }

    function getNFTContract(uint256 ID) public view returns(address)
    {
        return NFTContractsERC721[ID];
    }

    function returnURI(uint256 tokenId, uint256 gymID) public view returns(string memory)
    {

        (bool success, bytes memory data) = NFTContractsERC721[gymID].staticcall(abi.encodeWithSignature("tokenURI(uint256)",tokenId));
        require(success,
        'The call of getTimeOfMint(uint256) was not successful');
        (string memory uri) = abi.decode(data, (string));
        return uri;
    }

}
