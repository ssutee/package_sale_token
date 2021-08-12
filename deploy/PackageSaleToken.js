require('dotenv').config();
module.exports = async function ({ getNamedAccounts, deployments }) {
  if(network.tags.production) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const pst = await deploy("PackageSaleToken", {
      from: deployer,
      args: [process.env.TOKEN_A_ADDRESS, process.env.TOKEN_B_ADDRESS],
      log: true,
      deterministicDeployment: false
    })
    if (pst.newlyDeployed) {
      log(
        `contract PackageSaleToken deployed at ${pst.address} using ${pst.receipt.gasUsed} gas`
      );
    }
  }
}

module.exports.tags = ["PackageSaleToken"]