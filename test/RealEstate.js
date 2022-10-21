const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("RealEstate", () => {
  let realEstate, escrow;
  let deployer, seller;
  let nftID = 1;
  let purchasePrice = ether(100);
  let escrowAmount = ether(20);

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];
    seller = deployer;

    const RealEstate = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      purchasePrice,
      escrowAmount,
      seller.address,
      buyer.address,
      inspector.address,
      lender.address
    );
    transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("sends an NFT to the seller / deployer", async () => {
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
    });
  });

  describe("Selling real estate", async () => {
    let balance, transaction;
    it("executes a succesful transaction", async () => {
      // Expect seller to be owner before the sale
      expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
      // Check the Escrow balance
      balance = await escrow.getBalance();
      console.log("Escrow balance b4 tx: ", ethers.utils.formatEther(balance));

      // Buyer deposits earnest
      transaction = await escrow
        .connect(buyer)
        .depositEarnest({ value: ether(20) });
      console.log("BUyer deposits earnest ");

      // Check the Escrow balance
      balance = await escrow.getBalance();
      console.log(
        "Escrow balance after tx: ",
        ethers.utils.formatEther(balance)
      );

      // Inspector updates status
      transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(true);
      await transaction.wait();
      console.log("Inspector approved");

      // Seller approves the sale
      transaction = await escrow.connect(seller).approveSale();
      await transaction.wait();
      console.log("Seller approved");
      // Buyer approves the sale
      transaction = await escrow.connect(buyer).approveBuyer();
      await transaction.wait();
      console.log("Buyer approved");
      // Seller approves the sale
      transaction = await escrow.connect(lender).approveLender();
      await transaction.wait();
      console.log("Lender approved");
      //Lender funds sale
      transaction = await lender.sendTransaction({
        to: escrow.address,
        value: ether(80),
      });

      // Execute the sale
      transaction = await escrow.connect(buyer).finalizeSale();
      await transaction.wait();
      console.log("Buyer finalizes sale");
      // Expect buyer to be the owner
      expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);

      // Expect seller to receive the funds
      balance = await ethers.provider.getBalance(seller.address);
      console.log("Seller balance:", ethers.utils.formatEther(balance));
      expect(balance).to.be.above(ether(10099));
    });
  });
});
