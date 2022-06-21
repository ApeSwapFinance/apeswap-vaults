const BananaVault = artifacts.require("BananaVault");
const { getNetworkConfig } = require('../deploy-config')

module.exports = async function (deployer, network, accounts) {
  const { adminAddress, masterApeAddress, bananaTokenAddress } = getNetworkConfig(network, accounts);
  const treasury = adminAddress;
  const withdrawFee = 0;

  await deployer.deploy(BananaVault,
    bananaTokenAddress,
    masterApeAddress,
    accounts[0],
    // adminAddress, // FIXME: transferOnwership to admin at end
    treasury,
    withdrawFee,
  );

  this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
  await bananaVault.grantRole(this.MANAGER_ROLE, maximizerVaultApe.address, { from: adminAddress });

  console.dir({
    BananaVault: BananaVault.address,
    masterApeAddress,
    adminAddress,
    treasury,
    withdrawFee,
  })
};
