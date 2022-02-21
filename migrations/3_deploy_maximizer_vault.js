const BananaVault = artifacts.require("BananaVault");
const KeeperMaximizerVaultApe = artifacts.require("KeeperMaximizerVaultApe");
const StrategyMaximizerMasterApe = artifacts.require("StrategyMaximizerMasterApe");
const { getNetworkConfig } = require('../deploy-config')

module.exports = async function (deployer, network, accounts) {
  const { adminAddress, masterApeAddress, bananaTokenAddress, apeFactory, apeRouter, wrappedNativeAddress } = getNetworkConfig(network, accounts);
  const treasury = adminAddress;

  await deployer.deploy(BananaVault,
    bananaTokenAddress,
    masterApeAddress,
    adminAddress
  );
  const bananaVault = await BananaVault.deployed();

  await deployer.deploy(KeeperMaximizerVaultApe,
    adminAddress,
    adminAddress,
    bananaVault.address,
    86400,
    [treasury, 50, treasury, 0, 0, 25, 259200, 100]);
  const keeperMaximizerVaultApe = await KeeperMaximizerVaultApe.deployed();

  await deployer.deploy(StrategyMaximizerMasterApe,
    masterApeAddress,
    0,
    true,
    bananaTokenAddress,
    bananaTokenAddress,
    bananaVault.address,
    apeRouter,
    [bananaTokenAddress],
    [bananaTokenAddress, wrappedNativeAddress],
    [
      adminAddress,
      keeperMaximizerVaultApe.address
    ]
  );
  const strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.deployed();


  // Define roles and grant roles
  this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
  await bananaVault.grantRole(this.MANAGER_ROLE, keeperMaximizerVaultApe.address, { from: adminAddress });

  //Add vault
  await keeperMaximizerVaultApe.addVault(strategyMaximizerMasterApe.address, { from: adminAddress });

  console.dir({
    bananaVault: bananaVault.address,
    keeperMaximizerVaultApe: keeperMaximizerVaultApe.address,
    masterApeAddress,
    adminAddress,
    treasury,
  })
};
