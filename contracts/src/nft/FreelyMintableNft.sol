// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {CourageSvgs} from "./CourageSvgs.sol";
import {DataURIs} from "./DataURIs.sol";

contract FreelyMintableNft is ERC721Enumerable {
    using Strings for uint256;
    using DataURIs for string;

    string private _backgroundColor;
    uint256 private immutable _seedOffset;

    constructor(string memory name, string memory symbol, string memory backgroundColor) ERC721(name, symbol) {
        _backgroundColor = backgroundColor;
        _seedOffset = uint256(keccak256(abi.encode(name, symbol, backgroundColor)));
    }

    function mint(address to, uint256 quantity) external {
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, totalSupply());
        }
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Only owner or approved address can burn a token.");
        _burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return _generateJson(tokenId).toJsonURI();
    }

    function _generateJson(uint256 tokenId) private view returns (string memory) {
        string memory tokenIdString = tokenId.toString();
        uint256 scrambledTokenId = uint256(keccak256(abi.encodePacked(tokenId))) ^ _seedOffset;
        return string(
            abi.encodePacked(
                "{\n" '  "name": "',
                name(),
                " #",
                tokenIdString,
                '",\n' '  "description": "A free NFT with unique art. Do with it as you will.",' '  "image": "',
                CourageSvgs.generateSvg(_backgroundColor, scrambledTokenId).toSvgURI(),
                '"\n' "}\n"
            )
        );
    }
}
