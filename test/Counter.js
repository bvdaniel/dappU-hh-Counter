const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", () => {
  let counter;
  beforeEach(async () => {
    //Fetch the account
    const Counter = await ethers.getContractFactory("Counter");
    // Deploy it, choose a name for the deploy
    counter = await Counter.deploy("My Counter", 1);
  });

  describe("Deployment", () => {
    it("sets the count", async () => {
      // Check the account, use the expect to read
      expect(await counter.count()).to.equal(1);
    });

    it("sets the name", async () => {
      expect(await counter.name()).to.equal("My Counter");
    });
  });

  describe("Counting", () => {
    let transaction, readCount;

    it("read from the count public variable", async () => {
      expect(await counter.count()).to.equal(1);
    });
    it("read from the getCount() function", async () => {
      expect(await counter.getCount()).to.equal(1);
    });

    it("read from the name public variable", async () => {
      expect(await counter.name()).to.equal("My Counter");
    });
    it("read from the getName() function", async () => {
      expect(await counter.getName()).to.equal("My Counter");
    });

    it("updates the name wih setName()", async () => {
      transaction = await counter.setName("holinwo");
      await transaction.wait();
      expect(await counter.name()).to.equal("holinwo");
      transaction = await counter.setName("marimbo");
      await transaction.wait();
      expect(await counter.getName()).to.equal("marimbo");
    });

    it("increments the count", async () => {
      transaction = await counter.increment();
      await transaction.wait();
      expect(await counter.count()).to.equal(2);
      transaction = await counter.increment();
      await transaction.wait();
      expect(await counter.count()).to.equal(3);
    });
    it("decreases the count", async () => {
      transaction = await counter.decrease();
      await transaction.wait();
      expect(await counter.count()).to.equal(0);

      // Cannot decrement count below 0
      await expect(counter.decrease()).to.be.reverted;
    });
  });
});
