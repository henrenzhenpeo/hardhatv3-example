import { network } from "hardhat";
import { parseEther } from "viem";

async function main() {
    const { viem } = await network.connect();
    const [deployer] = await viem.getWalletClients();

    console.log("部署账户:", deployer.account.address);

    // 部署合约
    const ecommerce = await viem.deployContract("Ecommerce");
    console.log("✅ Ecommerce 部署成功！");
    console.log("📌 合约地址:", ecommerce.address);

    // === 自动上架商品 ===
    await ecommerce.write.listProduct([
        "Phone",
        "Latest smartphone",
        parseEther("1"), // 1 ETH
    ]);
    console.log("📦 上架 Phone 成功");

    await ecommerce.write.listProduct([
        "MacBook",
        "Powerful laptop",
        parseEther("2"), // 2 ETH
    ]);
    console.log("📦 上架 MacBook 成功");

    // 查看商品数量
    const count = await ecommerce.read.productCount();
    console.log("🛒 当前商品数量:", count.toString());
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
