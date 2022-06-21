const KeeperMaximizerVaultApe = artifacts.require("KeeperMaximizerVaultApe");
const StrategyMaximizerMasterApe = artifacts.require(
  "StrategyMaximizerMasterApe"
);
const { getNetworkConfig } = require("../deploy-config");


// NOTE: TESTNET MasterApe
// interface StrategyMaximizerMasterApe {
//   farmPid: Number;
//   farmStakeTokenAddress: String;
// }
const strategyDeployments = [
  {
    farmPid: 7,
    farmStakeTokenAddress: "0x30E74ceFD298990880758E20223f03129F52E699", // HOR-NEY
    skipValidation: true,
  },
  {
    farmPid: 8,
    farmStakeTokenAddress: "0x4419D815c9c9329f9679782e76ec15bCe1B14a6D", // FOR-EVER
    skipValidation: true,
  },
];

// NOTE MAINNET MasterApe
// interface StrategyMaximizerMasterApe {
//   farmPid: Number;
//   farmStakeTokenAddress: String;
// }
// const strategyDeployments = [
//   {
//     farmPid: 1,
//     farmStakeTokenAddress: "0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713",  // BANANA-BNB
//     // skipValidation: true // NOTE: Enable if you want to skip validation
//   },
//   {
//     farmPid: 2,
//     farmStakeTokenAddress: "0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914", // BANANA-BUSD
//   },
//   {
//     farmPid: 45,
//     farmStakeTokenAddress: "0x29A4A3D77c010CE100A45831BF7e798f0f0B325D", // MATIC-BNB
//   },
//   {
//     farmPid: 49,
//     farmStakeTokenAddress: "0x47A0B7bA18Bb80E4888ca2576c2d34BE290772a6", // FTM-BNB
//   },
//   {
//     farmPid: 117,
//     farmStakeTokenAddress: "0x119D6Ebe840966c9Cf4fF6603E76208d30BA2179", // CEEK-BNB
//   },
// ]

/**
 * Verify strategies are not already added to vault
 *
 * @param {string} keeperMaximizerVaultApeAddress
 * @param {StrategyMaximizerMasterApe[]} strategyDeploymentArray
 */
async function verifyStrategyDeployments(
  keeperMaximizerVaultApe,
  strategyDeploymentArray
) {
  const vaultsLength = await keeperMaximizerVaultApe.vaultsLength();
  const strategyPromises = [];
  const strategies = [];
  for (let index = 0; index < vaultsLength; index++) {
    const strategyPromise = keeperMaximizerVaultApe
      .vaults(index)
      .then((strategyAddress) => StrategyMaximizerMasterApe.at(strategyAddress))
      .then((contract) => strategies.push(contract));
    strategyPromises.push(strategyPromise);
  }
  await Promise.all(strategyPromises);
  const infoPromises = [];
  const farmStakeTokens = [];
  const farmPids = [];
  for (const strategy of strategies) {
    infoPromises.push(
      strategy.FARM_PID().then((farmPid) => farmPids.push(farmPid.toNumber()))
    );
    infoPromises.push(
      strategy
        .STAKE_TOKEN()
        .then((farmStakeToken) => farmStakeTokens.push(farmStakeToken))
    );
  }
  await Promise.all(infoPromises);

  const validationErrors = [];
  for (const strategyDeployment of strategyDeploymentArray) {
    if (strategyDeployment.skipValidation) {
      console.log(
        `verifyStrategyDeployments:: skipValidation flag set. Skipping strategy verification for stake token: ${strategyDeployment.farmStakeTokenAddress}`
      );
      continue;
    }
    // Check if this strategy deployment is registered in the vault already
    if (
      farmStakeTokens.includes(strategyDeployment.farmStakeTokenAddress) ||
      farmPids.includes(strategyDeployment.farmPid)
    ) {
      validationErrors.push(strategyDeployment);
    }
  }

  if (validationErrors.length) {
    console.dir({
      validationErrors,
    });
    throw new Error(
      `verifyStrategyDeployments:: Verification failed for strategy deployment configuration.`
    );
  }
}

/**
 * Truffle deployment script.
 *
 * @param {*} deployer
 * @param {string} network
 * @param {string[]} accounts
 */
module.exports = async function (deployer, network, accounts) {
  let {
    adminAddress,
    masterApeAddress,
    bananaTokenAddress,
    treasuryAddress,
    apeRouterAddress,
    wrappedNativeAddress,
    chainlinkRegistry,
    keeperMaximizerVaultApeAddress,
    gnosisLink,
  } = getNetworkConfig(network, accounts);

  if (!keeperMaximizerVaultApeAddress) {
    throw new Error(
      `keeperMaximizerVaultApeAddress not found in deploy-config.js. This is needed to configure new strategies.`
    );
  }
  const keeperMaximizerVaultApe = await KeeperMaximizerVaultApe.at(
    keeperMaximizerVaultApeAddress
  );
  await verifyStrategyDeployments(
    keeperMaximizerVaultApe,
    strategyDeployments
  );

  const bananaVaultAddress = await keeperMaximizerVaultApe.BANANA_VAULT();

  /**
   * Deploy strategies
   */
  let strategyOutput = [];
  for (const strategyDeployment of strategyDeployments) {
    const { farmPid, farmStakeTokenAddress } = strategyDeployment;
    const isBananaStaking = farmStakeTokenAddress == bananaTokenAddress;
    await deployer.deploy(
      StrategyMaximizerMasterApe,
      masterApeAddress,
      farmPid,
      isBananaStaking,
      farmStakeTokenAddress,
      bananaTokenAddress,
      bananaVaultAddress,
      apeRouterAddress,
      [bananaTokenAddress],
      [bananaTokenAddress, wrappedNativeAddress],
      [
        adminAddress, // owner
        keeperMaximizerVaultApeAddress, // vaultApe address
      ]
    );
    const strategyMaximizerMasterApe =
      await StrategyMaximizerMasterApe.deployed();
    // NOTE: Must be done from owner of KeeperMaximizerVaultApe
    // await keeperMaximizerVaultApe.addVault(strategyMaximizerMasterApe.address, { from: adminAddress });
    strategyOutput.push({
      strategyMaximizerMasterApe: strategyMaximizerMasterApe.address,
      farmPid,
      farmStakeTokenAddress,
      isBananaStaking,
    });
  }

  /**
   * Log output
   */
  console.dir({
    adminAddress,
    keeperMaximizerVaultApe: keeperMaximizerVaultApeAddress,
    bananaVaultAddress,
    masterApeAddress,
    strategyOutput,
    nextSteps: `Add strategyMaximizerMasterApe addresses above to KeeperMaximizerVaultApe.addVault(address) from the "owner" address.`,
    gnosisLink: gnosisLink(adminAddress),
  });
};
