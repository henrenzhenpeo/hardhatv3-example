import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyNFTModule", (m) => {
    // 部署 NFT 合约，传入构造函数参数 name 和 symbol
    const nft = m.contract("MyNFT", ["MyNFT", "MNFT"]);

    // 部署完成后，调用 mint 给测试地址
    // 这里示例写死了地址 0x000...001
    // 你也可以用 m.getAccount(1) 获取 Hardhat 内置账户
    m.call(
        nft,                                 // 合约对象
        "mint",                              // 调用函数
        ["0x0000000000000000000000000000000000000001", "https://example.com/metadata/1.json"] // 参数
    );

    return { nft }; // 返回合约对象给 Ignition 模块管理
});
