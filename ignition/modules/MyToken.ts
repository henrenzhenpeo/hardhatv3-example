import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
    // 构造函数参数
    const initialSupply = 1000n * 10n ** 18n;

    // 部署合约并传入构造参数
    const token = m.contract("MyToken", ["MyToken", "MTK", initialSupply]);

    // 部署完成后，给一个固定地址 mint 100 个代币（示范用）
    // 你可以换成 m.getAccount(1) 来获取测试账户
    m.call(token, "mint", ["0x0000000000000000000000000000000000000001", 100n * 10n ** 18n]);

    return { token };
});
