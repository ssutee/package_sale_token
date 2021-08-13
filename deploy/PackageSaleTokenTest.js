require('dotenv').config();

const { network, ethers, artifacts } = require("hardhat");

const ERC20 = artifacts.require("ERC20");

module.exports = async function ({ getNamedAccounts, deployments }) {
  if(network.tags.staging) {
    const { deploy, log, execute } = deployments
    const { deployer, affiliateWallet } = await getNamedAccounts()
    const BusdToken = await deployments.get('BusdToken')
    const ShotToken = await deployments.get('ShotToken')
    const pst = await deploy("PackageSaleToken", {
      from: deployer,
      args: [BusdToken.address, ShotToken.address, affiliateWallet],
      log: true,
      deterministicDeployment: false
    })
    if (pst.newlyDeployed) {
      log(
        `contract PackageSaleTokenTest deployed at ${pst.address} using ${pst.receipt.gasUsed} gas`
      );
    }
    const shotToken = await ERC20.at(ShotToken.address)
    await shotToken.approve(pst.address, ethers.constants.MaxUint256.sub(1).toString(), {from:affiliateWallet})
  }
}

module.exports.tags = ["PackageSaleTokenTest"]
module.exports.dependencies = ['ShotToken', 'BusdToken']