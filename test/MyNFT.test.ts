import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("MyNFT (ERC721)", async () => {
    // 连接 Hardhat 网络，获取 viem 客户端
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [ownerClient, aliceClient] = await viem.getWalletClients();

    it("should deploy and mint NFT to owner", async () => {
        // 部署 MyNFT 合约
        const nft = await viem.deployContract("MyNFT", ["MyNFT", "MNFT"]);

        // mint 一个 NFT 给 owner
        await nft.write.mint([ownerClient.account.address, "https://example.com/metadata/1.json"]);

        // 读取 NFT 的 tokenURI，验证是否正确
        const uri = await nft.read.tokenURI([1n]);
        assert.equal(uri, "https://example.com/metadata/1.json");
    });

    it("should allow owner to mint to alice", async () => {
        // 再部署一个新合约实例
        const nft = await viem.deployContract("MyNFT", ["MyNFT", "MNFT"]);

        // owner mint NFT 给 Alice
        await nft.write.mint([aliceClient.account.address, "https://example.com/metadata/2.json"]);

        // 查询 Alice 的 NFT URI
        const aliceTokenUri = await nft.read.tokenURI([1n]);
        assert.equal(aliceTokenUri, "https://example.com/metadata/2.json");
    });
});
