const { default: BigNumber } = require("bignumber.js");
const { expect } = require("chai");
const { web3, artifacts } = require("hardhat");

const BasicToken = artifacts.require("BasicToken");
const PackageSaleToken = artifacts.require("PackageSaleToken");

const toWei = web3.utils.toWei;

describe("PackageSaleToken", () => {
  let deployer, bob, marry, john;
  let shotToken, busdToken, pst;
  
  before(async () => {
    accounts = await web3.eth.getAccounts();
    deployer = accounts[0];
    bob = accounts[1];
    marry = accounts[2];
    john = accounts[3];
  })

  beforeEach(async () => {
    shotToken = await BasicToken.new("SHOT Token", "SHOT", { from: deployer });
    busdToken = await BasicToken.new("BUSD Token", "BUSD", { from: deployer });
    pst = await PackageSaleToken.new(busdToken.address, shotToken.address);
  })

  describe("constructor", async() => {
    it("assigns properties", async() => {
      expect(await pst.tokenA()).to.eq(busdToken.address);
      expect(await pst.tokenB()).to.eq(shotToken.address);
    })
  })

  describe("setters", async() => {
    it("should set referral fee", async() => {
      await expect(pst.setReferralFee(toWei("1"), {from:bob})).revertedWith("caller is not the owner");
      await pst.setReferralFee(toWei("1"));
      expect((await pst.referralFee()).toString()).to.eq(toWei("1"));
    })
  })

  describe("packages", async() => {
    it("should add/remove package", async() => {
      await pst.addPackage(toWei("50"), toWei("100"))
      expect((await pst.packages(toWei("50"))).toString()).to.eq(toWei("100"))
      await pst.removePackage(toWei("50"))
      expect((await pst.packages(toWei("50"))).toString()).to.eq(toWei("0"))

      await expect(pst.addPackage(toWei("50"), toWei("100"), {from:bob})).revertedWith("caller is not the owner")
      await expect(pst.removePackage(toWei("50"), {from:bob})).revertedWith("caller is not the owner")
      await expect(pst.removePackage(toWei("50"))).revertedWith("No package")
    })
  })

  describe("withdraw tokens", async() => {
    it("should transfer tokens properly", async() => {
      await shotToken.mint(pst.address, toWei("1000"))
      await busdToken.mint(pst.address, toWei("1000"))

      await pst.withdrawTokenA();
      await pst.withdrawTokenB();

      expect((await busdToken.balanceOf(deployer)).toString()).to.eq(toWei("1000"))
      expect((await shotToken.balanceOf(deployer)).toString()).to.eq(toWei("1000"))

      expect((await busdToken.balanceOf(pst.address)).toString()).to.eq(toWei("0"))
      expect((await shotToken.balanceOf(pst.address)).toString()).to.eq(toWei("0"))
    })
  })

  describe("buy with referral", async() => {
    it("should transfer tokens properly", async() => {
      await shotToken.mint(pst.address, toWei("18666"))      

      // test package 1
      await busdToken.mint(bob, toWei("39"))
      await busdToken.approve(pst.address, toWei("39"), {from:bob})
      await expect(pst.buy(toWei("39"), bob, {from:bob})).revertedWith("Self-referral is not allowed")
      await pst.buy(toWei("39"), marry, {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("300"))
  
      // test package 2
      await busdToken.mint(bob, toWei("120"))
      await busdToken.approve(pst.address, toWei("120"), {from:bob})
      await pst.buy(toWei("120"), marry, {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("1300"))
  
      // test package 3
      await busdToken.mint(bob, toWei("225"))
      await busdToken.approve(pst.address, toWei("225"), {from:bob})
      await pst.buy(toWei("225"), marry, {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("3300"))
  
      // test package 4
      await busdToken.mint(bob, toWei("525"))
      await busdToken.approve(pst.address, toWei("525"), {from:bob})
      await pst.buy(toWei("525"), marry, {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("8300"))
  
      // test package 5
      await busdToken.mint(bob, toWei("1000"))
      await busdToken.approve(pst.address, toWei("1000"), {from:bob})
      await pst.buy(toWei("1000"), marry, {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("18300"))
  
      expect((await shotToken.balanceOf(pst.address)).toString()).to.eq(toWei("0"))
      expect((await shotToken.balanceOf(marry)).toString()).to.eq(toWei("366"))    
    })
  })

  describe("buy without referral", async() => {
    it("should transfer tokens properly", async() => {
      await shotToken.mint(pst.address, toWei("18300"))
      
      // test package 1
      await busdToken.mint(bob, toWei("39"))
      await busdToken.approve(pst.address, toWei("39"), {from:bob})
      await pst.buyNoReferral(toWei("39"), {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("300"))

      // test package 2
      await busdToken.mint(bob, toWei("120"))
      await busdToken.approve(pst.address, toWei("120"), {from:bob})
      await pst.buyNoReferral(toWei("120"), {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("1300"))

      // test package 3
      await busdToken.mint(bob, toWei("225"))
      await busdToken.approve(pst.address, toWei("225"), {from:bob})
      await pst.buyNoReferral(toWei("225"), {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("3300"))

      // test package 4
      await busdToken.mint(bob, toWei("525"))
      await busdToken.approve(pst.address, toWei("525"), {from:bob})
      await pst.buyNoReferral(toWei("525"), {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("8300"))

      // test package 5
      await busdToken.mint(bob, toWei("1000"))
      await busdToken.approve(pst.address, toWei("1000"), {from:bob})
      await pst.buyNoReferral(toWei("1000"), {from:bob})
      expect((await busdToken.balanceOf(bob)).toString()).to.eq("0")
      expect((await shotToken.balanceOf(bob)).toString()).to.eq(toWei("18300"))

      expect((await shotToken.balanceOf(pst.address)).toString()).to.eq(toWei("0"))
    })
  })
})