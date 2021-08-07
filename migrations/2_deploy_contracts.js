const VaultApe = artifacts.require("VaultApe");
const StrategyFactory = artifacts.require("StrategyFactory");
const StrategyMasterChefFactory = artifacts.require("StrategyMasterChefFactory");
const StrategyMasterChefSingleFactory = artifacts.require("StrategyMasterChefSingleFactory");
const StrategyMasterApeSingleFactory = artifacts.require("StrategyMasterApeSingleFactory");
const StrategyKoalaFarmFactory = artifacts.require("StrategyKoalaFarmFactory");


const adminAddress = "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13";
const routerAddress = "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7";
let vaultAddress = "0xd265954530a6942c80b22bab2a4c89c7335fcd6d";

module.exports = async function (deployer) {
  await deployer.deploy(VaultApe);

  const vaultApe = await VaultApe.deployed();

  vaultAddress = vaultApe.address;

  await deployer.deploy(StrategyMasterChefSingleFactory, adminAddress, vaultAddress, routerAddress);

  await deployer.deploy(StrategyMasterApeSingleFactory, adminAddress, vaultAddress, routerAddress);

  await deployer.deploy(StrategyKoalaFarmFactory, adminAddress, vaultAddress, routerAddress);

  await deployer.deploy(StrategyMasterChefFactory, adminAddress, vaultAddress, routerAddress);
};
