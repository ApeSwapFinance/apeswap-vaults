const VaultApe = artifacts.require("VaultApe");
const VaultApeWhitelist = artifacts.require("VaultApeWhitelist");
const StrategyMasterChefFactory = artifacts.require("StrategyMasterChefFactory");
const StrategyMasterChefReflectFactory = artifacts.require("StrategyMasterChefReflectFactory");
const StrategyMasterChefSingleReflectFactory = artifacts.require("StrategyMasterChefSingleReflectFactory");
const StrategyMasterChefSingleFactory = artifacts.require("StrategyMasterChefSingleFactory");
const StrategyKoalaChefSingleFactory = artifacts.require("StrategyKoalaChefSingleFactory");
const StrategyMasterApeSingleFactory = artifacts.require("StrategyMasterApeSingleFactory");
const StrategyAuto4BeltFactory = artifacts.require("StrategyAuto4BeltFactory");
const StrategyBeltTokenFactory = artifacts.require("StrategyBeltTokenFactory");
const StrategyAutoBeltTokenFactory = artifacts.require("StrategyAutoBeltTokenFactory");
const StrategyStakingPoolLPFactory = artifacts.require("StrategyStakingPoolLPFactory");
const StrategyVenusBNBFactory = artifacts.require("StrategyVenusBNBFactory");
const StrategyKoalaFarmFactory = artifacts.require("StrategyKoalaFarmFactory");
const { MasterChefVaults, MasterApeSingleVaults, MasterChefSingleVaults, KoalaChefSingleVaults, KoalaChefVaults, MasterChefReflectVaults, MasterChefSingleReflectVaults } = require('../configs/vaults');

const config = {
  bsc: {
    adminAddress: "0x0341242Eb1995A9407F1bf632E8dA206858fBB3a", // "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
    vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa", //  "0x933724464bf9832146E7A023e689DE420ab490D1" "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
    usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
    autoFarm: "0x0895196562C7868C5Be92459FaE7f877ED450452",
    masterBelt: "0xd4bbc80b9b102b77b21a06cb77e954049605e6c1",
  },
  development: {
    adminAddress: "0x0341242Eb1995A9407F1bf632E8dA206858fBB3a", // "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
    vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa", //  "0x933724464bf9832146E7A023e689DE420ab490D1" "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
    usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
    bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
    autoFarm: "0x0895196562C7868C5Be92459FaE7f877ED450452",
    masterBelt: "0xd4bbc80b9b102b77b21a06cb77e954049605e6c1",
  },
  polygon: {
    adminAddress: "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13",
    routerAddress: "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607",
    vaultAddress: "0x37ac7DE40A6fd71FD1559Aa00F154E8dcb72efdb",
    usdAddress: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
    bananaAddress: "0x5d47baba0d66083c52009271faf3f50dcc01023c",
  }
}

const deployStrategies = false;

module.exports = async function (deployer, network) {
  await deployer.deploy(VaultApe); 
  const vaultApe = await VaultApe.deployed();

  // const vaultAddress = config[network].vaultAddress; // "0x76045DaA63d0bcCbD2EEF93fcC6209f9B710FA58" // 

  const adminAddress = config[network].adminAddress;
  const routerAddress = config[network].routerAddress;
  const usdAddress = config[network].usdAddress;
  const bananaAddress = config[network].bananaAddress;
  // await vaultApe.initialize(adminAddress, adminAddress);
  const vaultAddress = vaultApe.address;


  await deployer.deploy(StrategyMasterChefReflectFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
  await deployer.deploy(StrategyMasterChefSingleReflectFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyKoalaChefSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyMasterChefSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
 
  await deployer.deploy(StrategyVenusBNBFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
  await deployer.deploy(StrategyAutoBeltTokenFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress, config[network].autoFarm);
  
  await deployer.deploy(StrategyAuto4BeltFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress, config[network].autoFarm);

  await deployer.deploy(StrategyBeltTokenFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress, config[network].masterBelt);
  
  await deployer.deploy(StrategyMasterApeSingleFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);

  await deployer.deploy(StrategyMasterChefFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
  await deployer.deploy(StrategyStakingPoolLPFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
 
  await deployer.deploy(StrategyKoalaFarmFactory, adminAddress, vaultAddress, routerAddress, bananaAddress, usdAddress);
 
 
  if (deployStrategies) {
    console.log('Deploying strategies');
    const strategyMasterChefSingleFactory = await StrategyMasterChefSingleFactory.deployed();
    const strategyMasterApeSingleFactory = await StrategyMasterApeSingleFactory.deployed();
    const strategyKoalaFarmFactory = await StrategyKoalaFarmFactory.deployed();
    const strategyKoalaChefSingleFactory = await StrategyKoalaChefSingleFactory.deployed();
    const strategyMasterChefFactory = await StrategyMasterChefFactory.deployed();
    const strategyMasterReflectChefFactory = await StrategyMasterChefReflectFactory.deployed();
    const strategyMasterChefSingleReflectFactory = await StrategyMasterChefSingleReflectFactory.deployed();
    
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

    for (const vault of MasterChefReflectVaults[network]) {
    console.log('Deploying vault', vault)
    const tx = await strategyMasterReflectChefFactory.
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

  for (const vault of MasterChefSingleReflectVaults[network]) {
    console.log('Deploying vault', vault)
    const tx = await strategyMasterChefSingleReflectFactory.
    deployDefaultMasterChefStrategy(
      vault.configAddresses, 
      vault.pid, 
      vault.earnedToWnativePath, 
      vault.earnedToUsdPath, 
      vault.earnedToBananaPath,
      vault.earnedToWantPath)
      console.log(tx);
  }

  }

};
