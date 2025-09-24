// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter = 1;
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory name_, string memory symbol_)
    ERC721(name_, symbol_)
    Ownable(msg.sender) // v5.x 必须传初始 owner
    {}

    function mint(address to, string calldata uri) external onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        try this.ownerOf(tokenId) returns (address) {
            return _tokenURIs[tokenId];
        } catch {
            revert("ERC721: URI query for nonexistent token");
        }
    }
}
