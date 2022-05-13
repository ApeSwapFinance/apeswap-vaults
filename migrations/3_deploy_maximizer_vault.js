const BananaVault = artifacts.require("BananaVault");
const KeeperMaximizerVaultApe = artifacts.require("KeeperMaximizerVaultApe");
const StrategyMaximizerMasterApe = artifacts.require("StrategyMaximizerMasterApe");
const RouterMock = artifacts.require("RouterMock");
const { getNetworkConfig } = require('../deploy-config')
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');


// NOTE: TESTNET MasterApe
// const strategyDeployments = [
//   {
//     farmPid: 7,
//     farmStakeTokenAddress: "0x30E74ceFD298990880758E20223f03129F52E699",  // HOR-NEY
//   },
//   {
//     farmPid: 8,
//     farmStakeTokenAddress: "0x4419D815c9c9329f9679782e76ec15bCe1B14a6D", // FOR-EVER
//   },
// ]

// NOTE MAINNET MasterApe
const strategyDeployments = [
  {
    farmPid: 1,
    farmStakeTokenAddress: "0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713",  // BANANA-BNB
  },
  {
    farmPid: 2,
    farmStakeTokenAddress: "0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914", // BANANA-BUSD
  },
  {
    farmPid: 45,
    farmStakeTokenAddress: "0x29A4A3D77c010CE100A45831BF7e798f0f0B325D", // MATIC-BNB
  },
  {
    farmPid: 49,
    farmStakeTokenAddress: "0x47A0B7bA18Bb80E4888ca2576c2d34BE290772a6", // FTM-BNB
  },
  {
    farmPid: 117,
    farmStakeTokenAddress: "0x119D6Ebe840966c9Cf4fF6603E76208d30BA2179", // CEEK-BNB
  },
]

module.exports = async function (deployer, network, accounts) {
  let { adminAddress, masterApeAddress, bananaTokenAddress, treasuryAddress, apeRouterAddress, wrappedNativeAddress, chainlinkRegistry } = getNetworkConfig(network, accounts);
  const tempAdmin = accounts[0];

  if (tempAdmin == adminAddress) {
    throw new Error(`tempAdmin (accounts[0]) ${tempAdmin} == adminAddress ${adminAddress}. This will cause role issues. Update deploy-config.js to new adminAddress.`)
  }
  /**
   * Deploy mock Router (if needed)
   */
  if (network == 'development') {
    console.log(`Deploying RouterMock for development`);
    await deployer.deploy(RouterMock);
    apeRouterAddress = (await RouterMock.deployed()).address;
  }

  /**
   * Deploy BananaVault
   */
  await deployer.deploy(BananaVault,
    bananaTokenAddress,
    masterApeAddress,
    tempAdmin, // Using temp admin to manage roles during deployment
  );
  const bananaVault = await BananaVault.deployed();

  /**
   * Deploy KeeperMaximizerVaultApe
   */
  const MaximizerSettings = {
    treasury: treasuryAddress,
    keeperFee: 50, // .5%
    platform: treasuryAddress,
    platformFee: 0,
    buyBackRate: 0,
    withdrawFee: 10, // .1%
    withdrawFeePeriod: "57896044618658097711785492504343953926634992332820282019728792003956564819968", // MAX_UINT256 / 2
    withdrawRewardsFee: 0,
  }
  await deployer.deploy(KeeperMaximizerVaultApe,
    chainlinkRegistry, // Keeper
    tempAdmin, // Owner (Using temp admin to add strategies during deployment)
    bananaVault.address,
    86400, // Compound max delay (1day)
    [
      MaximizerSettings.treasury,
      MaximizerSettings.keeperFee,
      MaximizerSettings.platform,
      MaximizerSettings.platformFee,
      MaximizerSettings.buyBackRate,
      MaximizerSettings.withdrawFee,
      MaximizerSettings.withdrawFeePeriod,
      MaximizerSettings.withdrawRewardsFee,
    ]
  );
  const keeperMaximizerVaultApe = await KeeperMaximizerVaultApe.deployed();

  /**
   * Define roles and grant roles
   */
  this.DEFAULT_ADMIN_ROLE = await bananaVault.DEFAULT_ADMIN_ROLE();
  this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
  await bananaVault.grantRole(this.MANAGER_ROLE, keeperMaximizerVaultApe.address, { from: tempAdmin });
  await bananaVault.grantRole(this.DEFAULT_ADMIN_ROLE, adminAddress, { from: tempAdmin });
  await bananaVault.grantRole(this.MANAGER_ROLE, adminAddress, { from: tempAdmin });
  await bananaVault.renounceRole(this.DEFAULT_ADMIN_ROLE, tempAdmin, { from: tempAdmin });
  await bananaVault.renounceRole(this.MANAGER_ROLE, tempAdmin, { from: tempAdmin });
  const bananaVaultOutput = {
    bananaVaultAddress: bananaVault.address,
    MaximizerHasManagerRole: await bananaVault.hasRole(this.MANAGER_ROLE, keeperMaximizerVaultApe.address),
    adminHasAdminRole: await bananaVault.hasRole(this.DEFAULT_ADMIN_ROLE, adminAddress),
    adminHasManagerRole: await bananaVault.hasRole(this.MANAGER_ROLE, adminAddress),
    tempAdminHasAdminRole: await bananaVault.hasRole(this.DEFAULT_ADMIN_ROLE, tempAdmin),
    tempAdminHasManagerRole: await bananaVault.hasRole(this.MANAGER_ROLE, tempAdmin),
  }

  /**
   * Deploy strategies
   */
  let strategyOutput = [];
  for (const strategyDeployment of strategyDeployments) {
    const { farmPid, farmStakeTokenAddress } = strategyDeployment;
    const isBananaStaking = farmStakeTokenAddress == bananaTokenAddress;
    await deployer.deploy(StrategyMaximizerMasterApe,
      masterApeAddress,
      farmPid,
      isBananaStaking,
      farmStakeTokenAddress,
      bananaTokenAddress,
      bananaVault.address,
      apeRouterAddress,
      [bananaTokenAddress],
      [bananaTokenAddress, wrappedNativeAddress],
      [
        adminAddress,  // owner
        keeperMaximizerVaultApe.address // vaultApe address
      ]
    );
    const strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.deployed();
    await keeperMaximizerVaultApe.addVault(strategyMaximizerMasterApe.address, { from: tempAdmin });
    strategyOutput.push({
      strategyMaximizerMasterApe: strategyMaximizerMasterApe.address,
      farmPid,
      farmStakeTokenAddress,
      isBananaStaking,
    })
  }

  await keeperMaximizerVaultApe.transferOwnership(adminAddress, { from: tempAdmin });
  const keeperOutput = {
    keeperMaximizerVaultApeAddress: keeperMaximizerVaultApe.address,
    keeperOwner: await keeperMaximizerVaultApe.owner(),
    bytesLib: BytesLib.address,
  }

  /**
   * Log output
   */
  console.dir({
    adminAddress,
    masterApeAddress,
    keeperOutput,
    bananaVaultOutput,
    MaximizerSettings,
    withdrawFeePeriod: MaximizerSettings.withdrawFeePeriod.toString(),
    strategyOutput,
  })
};
