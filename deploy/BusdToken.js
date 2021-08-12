module.exports = async function ({ getNamedAccounts, deployments, network }) {
  if(network.tags.staging) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const busdToken = await deploy("BusdToken", {
      from: deployer,
      args: [],
      log: true,
      deterministicDeployment: false
    })
    if (busdToken.newlyDeployed) {
      log(
        `contract BusdToken deployed at ${busdToken.address} using ${busdToken.receipt.gasUsed} gas`
      );
    }
  }
}
module.exports.tags = ["BusdToken"]