import { network } from "hardhat";

async function main() {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [ownerClient, aliceClient] = await viem.getWalletClients();

    // 把这里换成 Ignition 输出的合约地址（或者你部署后得到的地址）
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const token = await viem.getContractAt("MyToken", tokenAddress);

    console.log("Owner:", ownerClient.account.address);
    console.log("Alice:", aliceClient.account.address);

    // 1) owner -> read balance
    const ownerBal = await token.read.balanceOf([ownerClient.account.address]);
    console.log("Owner balance:", ownerBal.toString());

    // 2) owner transfer 1 token to alice (18 decimals)
    const one = 1n * 10n ** 18n;
    console.log("Transferring 1 token from owner to alice...");
    await token.write.transfer([aliceClient.account.address, one], { account: ownerClient.account });

    const aliceBal = await token.read.balanceOf([aliceClient.account.address]);
    console.log("Alice balance (after transfer):", aliceBal.toString());

    // 3) alice burn 0.5 token
    const half = (1n * 10n ** 18n) / 2n;
    console.log("Alice burning 0.5 token...");
    await token.write.burn([half], { account: aliceClient.account });

    const aliceBalAfter = await token.read.balanceOf([aliceClient.account.address]);
    console.log("Alice balance (after burn):", aliceBalAfter.toString());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
