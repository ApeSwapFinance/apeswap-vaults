const VaultApe = artifacts.require("VaultApe");
const StrategyFactory = artifacts.require("StrategyFactory");
const StrategyMasterChefFactory = artifacts.require("StrategyMasterChefFactory");
const StrategyMasterChefSingleFactory = artifacts.require("StrategyMasterChefSingleFactory");
const StrategyMasterApeSingleFactory = artifacts.require("StrategyMasterApeSingleFactory");
const StrategyKoalaFarmFactory = artifacts.require("StrategyKoalaFarmFactory");
const { MasterChefVaults, MasterApeSingleVaults, MasterChefSingleVaults } = require('../configs/vaults');

const config = {
  bsc: {
    adminAddress: "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
    vaultAddress: "0xd265954530a6942c80b22bab2a4c89c7335fcd6d",
    usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  }
}

let vaultAddress = "0xd265954530a6942c80b22bab2a4c89c7335fcd6d";
const deployStrategies = true;

module.exports = async function (deployer, network) {
  await deployer.deploy(VaultApe);

  const vaultApe = await VaultApe.deployed();

  vaultAddress = vaultApe.address;

  const adminAddress = config[network].adminAddress;
  const routerAddress = config[network].routerAddress;
  const usdAddress = config[network].usdAddress;
  const bananaAddress = config[network].bananaAddress;

  await deployer.deploy(StrategyMasterChefSingleFactory, adminAddress, vaultAddress, routerAddress, usdAddress, bananaAddress);

  await deployer.deploy(StrategyMasterApeSingleFactory, adminAddress, vaultAddress, routerAddress, usdAddress, bananaAddress);

  await deployer.deploy(StrategyKoalaFarmFactory, adminAddress, vaultAddress, routerAddress, usdAddress, bananaAddress);

  await deployer.deploy(StrategyMasterChefFactory, adminAddress, vaultAddress, routerAddress, usdAddress, bananaAddress);

  const strategyMasterChefSingleFactory = await StrategyMasterChefSingleFactory.deployed();
  const strategyMasterApeSingleFactory = await StrategyMasterApeSingleFactory.deployed();
  const strategyKoalaFarmFactory = await StrategyKoalaFarmFactory.deployed();
  const strategyMasterChefFactory = await StrategyMasterChefFactory.deployed();

  if (deployStrategies) {
    for (const vault of MasterChefVaults) {
      await strategyMasterChefFactory.
      deployDefaultMasterChefStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath, 
        vault.earnedToToken0Path, 
        vault.earnedToToken1Path, 
        vault.token0ToEarnedPath, 
        vault.token1ToEarnedPath)
    }

    for (const vault of MasterApeSingleVaults) {
      await strategyMasterApeSingleFactory.
      deployDefaultMasterApeSingleStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath)
    }

    for (const vault of MasterChefSingleVaults) {
      await strategyMasterChefSingleFactory.
      deployDefaultMasterChefStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath)
    }
  }

};
