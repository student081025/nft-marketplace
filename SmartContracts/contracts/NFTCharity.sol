//SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract CharitytoKoteyka is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ERC721Burnable
{
    uint256 private _tokenIds;

    address private contractConnect;

    constructor() ERC721("CharitytoKoteyka", "Ko") Ownable(msg.sender)
    { }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory)
    {
       return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable, ERC721) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0))
        {
            revert("Soulbound: Transfer failed");
        }
        return super._update(to, tokenId, auth);
    }

    function generateNFTImage(string memory color) internal pure returns(string memory)
    {
        bytes memory image = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<rect width="100%" height="100%" fill="', color, '"/>',
            '</svg>');
        return string(abi.encodePacked("data:image/svg+xml;base64,",Base64.encode(image)));
    }

    function updateURI(uint256 tokenId, uint256 status, uint256 donations, uint256 pay) internal pure returns (string memory)
    {
        string memory rank;
        string memory color;
        if(1 ether <= donations && donations < 2 ether)
        {
            rank = 'Silver';
            color = '#C0C0C0';
        }
        else if (donations >= 2 ether)
        {
            rank = 'Gold';
            color = '#FFD700';
        }
        else
        {
            rank = 'Bronze';
            color = '#CD7F32';
        }

        bytes memory dataURI = abi.encodePacked(
            '{',
                '"id": "', Strings.toString(tokenId), '",',
                '"charity": "Koteyka",',
                '"status":"',  Strings.toString(status), '",',
                '"rank": "', rank, '",',
                '"sum": "', Strings.toString(donations), '",',
                '"pay": "', Strings.toString(pay), '",',
                '"description": "Charity subscription.",',
                '"image": "', generateNFTImage(color), '"',
            '}'
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function mint(uint256 pay) public
    {
        uint256 newItemId = _tokenIds;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, updateURI(newItemId, 0, 0, pay));
        _tokenIds += 1;
    }

    function updateJson(uint256 tokenId, uint256 status, uint256 donations, uint256 pay) public
    {
        require(msg.sender == contractConnect,
        "You do not have access to this function");
        _setTokenURI(tokenId, updateURI(tokenId, status, donations, pay));
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
        contractConnect = cont;
    }
}
