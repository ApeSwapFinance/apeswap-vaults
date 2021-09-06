const VaultApe = artifacts.require("VaultApe");
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
    vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa", //  "0x933724464bf9832146E7A023e689DE420ab490D1" "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
    usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  },
  polygon: {
    adminAddress: "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607",
    vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
    usdAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
    bananaAddress: "0x5d47baba0d66083c52009271faf3f50dcc01023c",
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
 
  if (deployStrategies) {
    console.log('Deploying strategies');
    const strategyMasterChefSingleFactory = await StrategyMasterChefSingleFactory.deployed();
    const strategyMasterApeSingleFactory = await StrategyMasterApeSingleFactory.deployed();
    const strategyKoalaFarmFactory = await StrategyKoalaFarmFactory.deployed();
    const strategyKoalaChefSingleFactory = await StrategyKoalaChefSingleFactory.deployed();
    const strategyMasterChefFactory = await StrategyMasterChefFactory.deployed();
    for (const vault of MasterChefVaults[network]) {
      console.log('Deploying vault', vault)
      const tx = await strategyMasterChefFactory.
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
        console.log(tx);
    }

    for (const vault of KoalaChefVaults[network]) {
      console.log('Deploying vault', vault)
      const tx = await strategyKoalaFarmFactory.
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
        console.log(tx);
    }

    for (const vault of MasterChefSingleVaults[network]) {
      console.log('Deploying vault', vault)
      const tx = await strategyMasterChefSingleFactory.
      deployDefaultMasterChefStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath,
        vault.earnedToWantPath)
        console.log(tx);
    }

    for (const vault of MasterApeSingleVaults[network]) {
      console.log('Deploying vault', vault)
      const tx = await strategyMasterApeSingleFactory.
      deployDefaultMasterApeSingleStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath)
        console.log(tx);
    }

    for (const vault of KoalaChefSingleVaults[network]) {
      console.log('Deploying vault', vault)
      const tx = await strategyKoalaChefSingleFactory.
      deployDefaultKoalaChefSingleStrategy(
        vault.configAddresses, 
        vault.pid, 
        vault.earnedToWnativePath, 
        vault.earnedToUsdPath, 
        vault.earnedToBananaPath,
        vault.earnedToWantPath,
        )
        console.log(tx);
    }

  }

};
