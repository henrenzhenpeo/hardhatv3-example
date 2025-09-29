// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductTracking {

    struct Product {
        uint256 id;
        string name;
        string origin;
        string currentOwner;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductRegistered(uint256 id, string name, string origin, string currentOwner, uint256 timestamp);

    // 注册产品
    function registerProduct(string memory _name, string memory _origin, string memory _owner) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _origin, _owner, block.timestamp);
        emit ProductRegistered(productCount, _name, _origin, _owner, block.timestamp);
    }

    // 更新产品信息
    function updateOwner(uint256 _id, string memory _newOwner) public {
        require(_id > 0 && _id <= productCount, "Product does not exist");
        products[_id].currentOwner = _newOwner;
    }

    // 查询产品信息
    function getProduct(uint256 _id) public view returns (Product memory) {
        require(_id > 0 && _id <= productCount, "Product does not exist");
        return products[_id];
    }
}
