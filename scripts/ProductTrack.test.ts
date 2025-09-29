import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";

describe("ProductTracking", async () => {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();

    it("Should register a product and emit ProductRegistered event", async () => {
        const productTracking = await viem.deployContract("ProductTracking");

        await viem.assertions.emit(
            productTracking.write.registerProduct(["Apple", "USA", "Alice"]),
            productTracking,
            "ProductRegistered",
        );
    });

    it("Should update owner correctly", async () => {
        const productTracking = await viem.deployContract("ProductTracking");

        // 注册产品
        await productTracking.write.registerProduct(["Laptop", "China", "Bob"]);

        // 更新 owner
        await productTracking.write.updateOwner([1n, "Charlie"]);

        // 读取产品信息
        const product = await productTracking.read.getProduct([1n]);

        assert.equal(product.currentOwner, "Charlie");
    });

    it("Should return the same product data as stored", async () => {
        const productTracking = await viem.deployContract("ProductTracking");

        await productTracking.write.registerProduct(["Phone", "Korea", "Diana"]);

        const product = await productTracking.read.getProduct([1n]);

        assert.equal(product.id, 1n);
        assert.equal(product.name, "Phone");
        assert.equal(product.origin, "Korea");
        assert.equal(product.currentOwner, "Diana");
    });

    it("Should emit ProductRegistered with timestamp close to block time", async () => {
        const productTracking = await viem.deployContract("ProductTracking");
        const blockBefore = await publicClient.getBlock();

        const tx = await productTracking.write.registerProduct(["Watch", "Japan", "Eve"]);
        const receipt = await publicClient.getTransactionReceipt({ hash: tx });

        const events = await publicClient.getContractEvents({
            address: productTracking.address,
            abi: productTracking.abi,
            eventName: "ProductRegistered",
            fromBlock: blockBefore.number,
            strict: true,
        });

        assert.equal(events.length, 1);
        const event = events[0];
        const ts = event.args.timestamp as bigint;

        // 检查时间戳范围
        assert.ok(ts >= blockBefore.timestamp, "timestamp should be >= blockBefore");
    });
});
