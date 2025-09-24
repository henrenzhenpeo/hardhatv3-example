import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("MyToken (Hardhat v3 + viem)", async () => {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [owner, alice] = await viem.getWalletClients();

    it("should deploy with initial supply to owner", async () => {
        const initialSupply = 1000n * 10n ** 18n;

        const token = await viem.deployContract("MyToken", [
            "MyToken",
            "MTK",
            initialSupply,
        ]);

        const ownerBalance = await token.read.balanceOf([owner.account.address]);
        assert.equal(ownerBalance, initialSupply);
    });

    it("should allow only owner to mint", async () => {
        const initialSupply = 1000n * 10n ** 18n;
        const token = await viem.deployContract("MyToken", [
            "MyToken",
            "MTK",
            initialSupply,
        ]);

        // owner 给 alice mint
        await token.write.mint([alice.account.address, initialSupply]);

        const aliceBalance = await token.read.balanceOf([alice.account.address]);
        assert.equal(aliceBalance, initialSupply);

        // 非 owner mint -> 应该 revert
        await assert.rejects(
            token.write.mint([alice.account.address, 1n], { account: alice.account }),
        );
    });

    it("should allow holder to burn", async () => {
        const initialSupply = 1000n * 10n ** 18n;
        const token = await viem.deployContract("MyToken", [
            "MyToken",
            "MTK",
            initialSupply,
        ]);

        // owner 给 alice mint
        await token.write.mint([alice.account.address, initialSupply]);

        // alice 销毁 10
        await token.write.burn([10n], { account: alice.account });

        const balanceAfter = await token.read.balanceOf([alice.account.address]);
        assert.equal(balanceAfter, initialSupply - 10n);
    });
});
