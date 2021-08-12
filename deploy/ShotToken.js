module.exports = async function ({ getNamedAccounts, deployments, network }) {
  if(network.tags.staging) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const shotToken = await deploy("ShotToken", {
      from: deployer,
      args: [],
      log: true,
      deterministicDeployment: false
    })
    if (shotToken.newlyDeployed) {
      log(
        `contract ShotToken deployed at ${shotToken.address} using ${shotToken.receipt.gasUsed} gas`
      );
    }
  }
}
module.exports.tags = ["ShotToken"]