const BananaVault = artifacts.require("BananaVault");
const { getNetworkConfig } = require('../deploy-config')

module.exports = async function (deployer, network, accounts) {
  const { adminAddress, masterApeAddress, bananaTokenAddress } = getNetworkConfig(network, accounts);
  const treasury = adminAddress;
  const withdrawFee = 0;

  await deployer.deploy(BananaVault,
    bananaTokenAddress,
    masterApeAddress,
    adminAddress,
    treasury,
    withdrawFee,
  );

  console.dir({
    BananaVault: BananaVault.address,
    masterApeAddress,
    adminAddress,
    treasury,
    withdrawFee,
  })
};
