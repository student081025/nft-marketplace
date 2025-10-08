// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";


contract FoodDeliverySubscriptionToHealthyFood is ERC721URIStorage, ERC721Enumerable, Ownable, ERC721Burnable
{
    uint256 private _tokenIds;
    address private contractConnectDelivery;

    constructor() ERC721("FoodDeliverySubscriptionToHealthyFood", "HF") Ownable(msg.sender)
    {}

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory)
    {
       return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable, ERC721) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function generateNFTImage(string memory tarrif, uint callories, uint mealsPerDay, uint plan) internal pure returns(string memory)
    {
        bytes memory image = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">', "Food delivery subscrition: HealthyFood", '</text>',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">', "Tarrif: ", tarrif, '</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Calories: ", Strings.toString(callories), '</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">', "Meals per day: ", Strings.toString(mealsPerDay), '</text>',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">', "Plan: ", Strings.toString(plan), '</text>',
            '</svg>');
        return string(abi.encodePacked("data:image/svg+xml;base64,",Base64.encode(image)));
    }

    function updateURI(uint tokenId, string memory tarrif, uint callories, uint mealsPerDay, uint plan) internal pure returns (string memory)
    {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"id": "', Strings.toString(tokenId), '",',
                '"delivery": "HealthyFood",',
                '"tariff": "', tarrif, '",',
                '"callories": "', Strings.toString(callories), '",',
                '"mealNum": "', Strings.toString(mealsPerDay), '",',
                '"plan": "', Strings.toString(plan), '",',
                '"description": "Subscribtion to the food delivery service.",',
                '"image": "', generateNFTImage(tarrif, callories, mealsPerDay, plan), '"',
            '}'
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function mint(string memory tarrif, uint callories, uint mealsPerDay, uint plan) public onlyOwner
    {
        uint256 newItemId = _tokenIds;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, updateURI(newItemId, tarrif, callories, mealsPerDay, plan));
        _tokenIds += 1;
    }

    function updateJson(uint256 tokenId, string memory tarrif, uint callories, uint mealsPerDay, uint plan) public
    {
        require(msg.sender == contractConnectDelivery,
        "You do not have access to this function");
        _setTokenURI(tokenId, updateURI(tokenId, tarrif, callories, mealsPerDay, plan));
    }

    function tokensOfOwner(address owner) view public returns (uint256[] memory, uint256)
    {
        uint amount = balanceOf(owner);
        uint256[] memory tokensIds = new uint256[](amount);
        for (uint i = 1; i <= amount; i++)
        {
            tokensIds[i - 1] = tokenOfOwnerByIndex(owner, i - 1);
        }

        return (tokensIds, amount);
    }

    function burnNFT(uint256 tokenId) public
    {
        burn(tokenId);
    }

    function setContractConnect(address cont) public onlyOwner
    {
        contractConnectDelivery = cont;
    }
}
