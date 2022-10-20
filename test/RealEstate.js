const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstate", () => {
  let realEstate, escrow;
  let deployer, seller, buyer;
  let nftID = 1;
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    buyer = accounts[1];
    seller = deployer;

    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      seller.address,
      buyer.address
    );
    transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("sends an NFT to the seller / deployer", async () => {});
    expect(await realEstate.ownerOf(nftID).to.equal(seller.address));
  });

  describe("Selling real estate", async () => {
    it("executes a succesful transaction", async () => {});
    // Expect seller to be owner before the sale
    expect(await realEstate.ownerOf(nftID).to.equal(seller.address));
    // Execute the sale
    transaction = await escrow.connect(buyer).finalizeSale();
    await transaction.wait();
    console.log("Buyer finalizes sale");
    // Expect buyer to be the owner
    expect(await realEstate.ownerOf(nftID).to.equals(buyer.address));
  });
});
