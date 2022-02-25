const BananaVault = artifacts.require("BananaVault");
const KeeperMaximizerVaultApe = artifacts.require("KeeperMaximizerVaultApe");
const StrategyMaximizerMasterApe = artifacts.require("StrategyMaximizerMasterApe");
const { getNetworkConfig } = require('../deploy-config')

module.exports = async function (deployer, network, accounts) {
  const { adminAddress, masterApeAddress, bananaTokenAddress, apeFactory, apeRouter, wrappedNativeAddress } = getNetworkConfig(network, accounts);
  const treasury = adminAddress;
  
  //HOR-NEY
  // await deployer.deploy(StrategyMaximizerMasterApe,
  //   masterApeAddress,
  //   7,
  //   false,
  //   "0x30E74ceFD298990880758E20223f03129F52E699",
  //   bananaTokenAddress,
  //   "0xb49cE4cC95431e8A9Fca934195F4c56f94fa7CBd",
  //   apeRouter,
  //   [bananaTokenAddress],
  //   [bananaTokenAddress, wrappedNativeAddress],
  //   [
  //     adminAddress,
  //     "0x34Cb31040CA9c03b27D9EcD6E2664575456aAf2F"
  //   ]
  // );
  // const strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.deployed();

  //FOR-EVER
  await deployer.deploy(StrategyMaximizerMasterApe,
    masterApeAddress,
    7,
    false,
    "0x4419D815c9c9329f9679782e76ec15bCe1B14a6D",
    bananaTokenAddress,
    "0xb49cE4cC95431e8A9Fca934195F4c56f94fa7CBd",
    apeRouter,
    [bananaTokenAddress],
    [bananaTokenAddress, wrappedNativeAddress],
    [
      adminAddress,
      "0x34Cb31040CA9c03b27D9EcD6E2664575456aAf2F"
    ]
  );
  const strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.deployed();
};
