// SPDX-License-Identifier: MIT

pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";


contract GymMembershipToSportick is ERC721URIStorage, ERC721Enumerable, Ownable, ERC721Burnable
{
    uint256 private _tokenIds;
    mapping(uint256 => uint256) tokenIdToTime;
    address private contractConnect;

    constructor() ERC721("GymMembershipToSportick", "SP") Ownable(msg.sender)
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

    function generateNFTImage(string memory status, string memory tariff, uint date, uint visits) internal pure returns(string memory)
    {
        bytes memory image = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">', "Gym membership: Sportick", '</text>',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">', "Status: ", status, '</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">', "Tariff: ", tariff, '</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">', "Duration: ", Strings.toString(date), '</text>',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle">', "Visits: ", Strings.toString(visits), '</text>',
            '</svg>');
        return string(abi.encodePacked("data:image/svg+xml;base64,",Base64.encode(image)));
    }

    function updateURI(uint tokenId, uint256 status, string memory tariff, uint date, uint visits) internal pure returns (string memory)
    {
        string memory statusS;
        if(status == 1)
        {
            statusS = 'Active';
        }
        else 
        {
            statusS = 'Paused';
        }
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"id": "', Strings.toString(tokenId), '",',
                '"gym": "Sportick",',
                '"status": "', Strings.toString(status), '",',
                '"tariff": "', tariff, '",',
                '"visits": "', Strings.toString(visits), '",',
                '"date": "', Strings.toString(date), '",',
                '"description": "Gym membership to the fitness center.",',
                '"image": "', generateNFTImage(statusS, tariff, date, visits), '"',
            '}'
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function mint(string memory tariff, uint date, uint visits) public onlyOwner
    {
        uint256 newItemId = _tokenIds;
        tokenIdToTime[newItemId] = block.timestamp;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, updateURI(newItemId, block.timestamp, tariff, date, visits));
        _tokenIds += 1;
    }

    function updateJson(uint256 tokenId, uint256 status, string memory tariff, uint date, uint visits) public
    {
        require(msg.sender == contractConnect,
        "You do not have access to this function");
        _setTokenURI(tokenId, updateURI(tokenId, status, tariff, date, visits));
    }

    function changeMintTime(uint256 tokenId, uint256 time) public
    {
        require(msg.sender == contractConnect,
        "You do not have access to this function");
        tokenIdToTime[tokenId] = time;
        
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

    function getTimeOfMint(uint256 tokenId) view public returns (uint256)
    {
        return tokenIdToTime[tokenId];
    }

    function burnNFT(uint256 tokenId) public
    {
        burn(tokenId);
        delete(tokenIdToTime[tokenId]);
    }

    function setContractConnect(address cont) public onlyOwner
    {
        contractConnect = cont;
    }
}