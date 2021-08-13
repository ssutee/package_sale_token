require('dotenv').config();

const { network, ethers, artifacts } = require("hardhat");

const ERC20 = artifacts.require("ERC20");

module.exports = async function ({ getNamedAccounts, deployments }) {
  if(network.tags.production) {
    const { deploy, log } = deployments
    const { deployer, affiliateWallet } = await getNamedAccounts()
    const pst = await deploy("PackageSaleToken", {
      from: deployer,
      args: [process.env.TOKEN_A_ADDRESS, process.env.TOKEN_B_ADDRESS, affiliateWallet],
      log: true,
      deterministicDeployment: false
    })
    if (pst.newlyDeployed) {
      log(
        `contract PackageSaleToken deployed at ${pst.address} using ${pst.receipt.gasUsed} gas`
      );
    }
    const shotToken = await ERC20.at(process.env.TOKEN_B_ADDRESS)
    await shotToken.approve(pst.address, ethers.constants.MaxUint256.sub(1), {from:affiliateWallet})
  }
}

module.exports.tags = ["PackageSaleToken"]