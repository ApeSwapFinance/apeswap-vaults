const VaultApe = artifacts.require("VaultApe");
const StrategyFactory = artifacts.require("StrategyFactory");
const StrategyMasterChefFactory = artifacts.require("StrategyMasterChefFactory");
const StrategyMasterChefSingleFactory = artifacts.require("StrategyMasterChefSingleFactory");
const StrategyKoalaChefSingleFactory = artifacts.require("StrategyKoalaChefSingleFactory");
const StrategyMasterApeSingleFactory = artifacts.require("StrategyMasterApeSingleFactory");
const StrategyKoalaFarmFactory = artifacts.require("StrategyKoalaFarmFactory");
const { MasterChefVaults, MasterApeSingleVaults, MasterChefSingleVaults, KoalaChefSingleVaults, KoalaChefVaults } = require('../configs/vaults');

const config = {
  bsc: {
    adminAddress: "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
    vaultAddress: "0x5dE9A25A297D85013a4176e2737a3488D86e8EC0",
    usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  }
}

const deployStrategies = true;

module.exports = async function (deployer, network) {
  await deployer.deploy(VaultApe); 
  const vaultApe = await VaultApe.deployed();

  const vaultAddress = vaultApe.address;
  // const vaultAddress = config[network].vaultAddress;

  const adminAddress = config[network].adminAddress;
  const routerAddress = config[network].routerAddress;
  const usdAddress = config[network].usdAddress;
  const bananaAddress = config[network].bananaAddress;

  await deployer.deploy(StrategyKoalaChefSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyMasterChefSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyMasterApeSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyKoalaFarmFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyMasterChefFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  const strategyMasterChefSingleFactory = await StrategyMasterChefSingleFactory.deployed();
  const strategyMasterApeSingleFactory = await StrategyMasterApeSingleFactory.deployed();
  const strategyKoalaFarmFactory = await StrategyKoalaFarmFactory.deployed();
  const strategyKoalaChefSingleFactory = await StrategyKoalaChefSingleFactory.deployed();
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

    for (const vault of KoalaChefVaults) {
      await strategyKoalaFarmFactory.
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

    for (const vault of KoalaChefSingleVaults) {
      await strategyKoalaChefSingleFactory.
      deployDefaultKoalaChefSingleStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath,
        vault.earnedToWantPath,
        )
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
