// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ecommerce {
    address public owner;
    uint256 public productCount = 0;

    enum ProductStatus { Available, Sold, Disputed, Refunded }

    struct Product {
        uint256 id;
        address payable seller;
        string name;
        string description;
        uint256 price;
        ProductStatus status;
        address buyer;
    }

    mapping(uint256 => Product) public products;

    event ProductListed(uint256 id, string name, uint256 price, address seller);
    event ProductPurchased(uint256 id, address buyer);
    event ProductDisputed(uint256 id);
    event ProductRefunded(uint256 id, address buyer);

    constructor() {
        owner = msg.sender;  // 合约创建者是商店的拥有者
    }

    // 卖家发布商品
    function listProduct(string memory _name, string memory _description, uint256 _price) public {
        require(_price > 0, "Price must be greater than zero");
        productCount++;
        products[productCount] = Product(productCount, payable(msg.sender), _name, _description, _price, ProductStatus.Available, address(0));

        emit ProductListed(productCount, _name, _price, msg.sender);
    }

    // 买家购买商品
    function purchaseProduct(uint256 _id) public payable {
        Product storage product = products[_id];
        require(product.status == ProductStatus.Available, "Product is not available for purchase");
        require(msg.value == product.price, "Incorrect payment amount");

        product.buyer = msg.sender;
        product.status = ProductStatus.Sold;
        product.seller.transfer(msg.value); // 支付给卖家

        emit ProductPurchased(_id, msg.sender);
    }

    // 买家对商品提出争议
    function disputeProduct(uint256 _id) public {
        Product storage product = products[_id];
        require(msg.sender == product.buyer, "Only the buyer can dispute");
        require(product.status == ProductStatus.Sold, "Product is not sold yet");

        product.status = ProductStatus.Disputed;

        emit ProductDisputed(_id);
    }

    // 合约拥有者处理争议并退款
    function resolveDispute(uint256 _id, bool refund) public {
        require(msg.sender == owner, "Only the owner can resolve disputes");

        Product storage product = products[_id];
        require(product.status == ProductStatus.Disputed, "Product is not in dispute");

        if (refund) {
            product.status = ProductStatus.Refunded;
            payable(product.buyer).transfer(product.price); // 退款给买家

            emit ProductRefunded(_id, product.buyer);
        } else {
            product.status = ProductStatus.Available; // 争议未解决，商品重新上架
        }
    }
}
