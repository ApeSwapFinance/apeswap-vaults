const VaultApe = artifacts.require("VaultApe");
const StrategyFactory = artifacts.require("StrategyFactory");


const adminAddress = "0x6c905b4108A87499CEd1E0498721F2B831c6Ab13";
const routerAddress = "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7";

module.exports = async function (deployer) {
  await deployer.deploy(VaultApe);

  const vaultApe = await VaultApe.deployed();

  await deployer.deploy(StrategyFactory, adminAddress, vaultApe.address, routerAddress);
};
