// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC20 提供标准ERC20功能 （balanceOf,transfer,approve）

/// @title MyToken - Simple ERC20 with owner mint + public burn
contract MyToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply) ERC20(name_, symbol_) Ownable(msg.sender){
        // 初试供应铸给部署者
        _mint(msg.sender, initialSupply);
    }

    // @notice 只有合约owner 可以铸造币
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to,amount);
    }

    // @notice 持有者可以销毁自己的代币
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
