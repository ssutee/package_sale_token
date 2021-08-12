require('dotenv').config();
module.exports = async function ({ getNamedAccounts, deployments }) {
  if(network.tags.staging) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const BusdToken = await deployments.get('BusdToken')
    const ShotToken = await deployments.get('ShotToken')
    const pst = await deploy("PackageSaleToken", {
      from: deployer,
      args: [BusdToken.address, ShotToken.address],
      log: true,
      deterministicDeployment: false
    })
    if (pst.newlyDeployed) {
      log(
        `contract PackageSaleTokenTest deployed at ${pst.address} using ${pst.receipt.gasUsed} gas`
      );
    }
  }
}

module.exports.tags = ["PackageSaleTokenTest"]
module.exports.dependencies = ['ShotToken', 'BusdToken']