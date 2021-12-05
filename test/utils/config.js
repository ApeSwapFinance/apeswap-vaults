const { MasterChefVaults, MasterApeSingleVaults, KoalaChefSingleVaults, MasterChefReflectVaults, MasterChefSingleVaults } = require('../../configs/vaults');


const testConfig = {
  testAccount: '0x41f2E851431Ae142edE42B6C467515EF5053061d',
  adminAddress: "0x0341242Eb1995A9407F1bf632E8dA206858fBB3a",
  routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
  vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
  usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  autoFarm: "0x0895196562C7868C5Be92459FaE7f877ED450452",
  masterBelt: "0xd4bbc80b9b102b77b21a06cb77e954049605e6c1",
};

const testStrategies = [
  // BANANA/BNB -> BANANA
  {
  contractName: 'StrategyMasterChef',
  vault: MasterChefVaults.bsc[0],
  wantToken: MasterChefVaults.bsc[0].configAddresses[1],
  initParams: (vaultApeAddress) => {
    return [
      [vaultApeAddress, MasterChefVaults.bsc[0].configAddresses[0], testConfig.routerAddress, MasterChefVaults.bsc[0].configAddresses[1], MasterChefVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress],
      MasterChefVaults.bsc[0].pid,
      MasterChefVaults.bsc[0].earnedToWnativePath,
      MasterChefVaults.bsc[0].earnedToUsdPath,
      MasterChefVaults.bsc[0].earnedToBananaPath,
      MasterChefVaults.bsc[0].earnedToToken0Path,
      MasterChefVaults.bsc[0].earnedToToken1Path,
      MasterChefVaults.bsc[0].token0ToEarnedPath,
      MasterChefVaults.bsc[0].token1ToEarnedPath
    ]
  }
},
// SING/BUSD -> SING
{
  contractName: 'StrategyMasterChefReflect',
  vault: MasterChefReflectVaults.bsc[0],
  wantToken: MasterChefReflectVaults.bsc[0].configAddresses[1],
  initParams: (vaultApeAddress) => {
    return [
      [vaultApeAddress, MasterChefReflectVaults.bsc[0].configAddresses[0], testConfig.routerAddress, MasterChefReflectVaults.bsc[0].configAddresses[1], MasterChefReflectVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress],
      MasterChefReflectVaults.bsc[0].pid,
      MasterChefReflectVaults.bsc[0].earnedToWnativePath,
      MasterChefReflectVaults.bsc[0].earnedToUsdPath,
      MasterChefReflectVaults.bsc[0].earnedToBananaPath,
      MasterChefReflectVaults.bsc[0].earnedToToken0Path,
      MasterChefReflectVaults.bsc[0].earnedToToken1Path,
      MasterChefReflectVaults.bsc[0].token0ToEarnedPath,
      MasterChefReflectVaults.bsc[0].token1ToEarnedPath
    ]
  }
},
// BANANA -> BANANA
{
  contractName: 'StrategyMasterApeSingle',
  vault: MasterApeSingleVaults.bsc[0],
  wantToken: MasterApeSingleVaults.bsc[0].configAddresses[1],
  initParams: (vaultApeAddress) => {
    return [
      [vaultApeAddress, MasterApeSingleVaults.bsc[0].configAddresses[0], testConfig.routerAddress, MasterApeSingleVaults.bsc[0].configAddresses[1], MasterApeSingleVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress],
      MasterApeSingleVaults.bsc[0].pid,
      MasterApeSingleVaults.bsc[0].earnedToWnativePath,
      MasterApeSingleVaults.bsc[0].earnedToUsdPath,
      MasterApeSingleVaults.bsc[0].earnedToBananaPath,
    ]
  }
},
// TAKO -> TAKO
{
  contractName: 'StrategyMasterChefSingle',
  vault: MasterChefSingleVaults.bsc[0],
  wantToken: MasterChefSingleVaults.bsc[0].configAddresses[1],
  initParams: (vaultApeAddress) => {
    return [
      [vaultApeAddress, MasterChefSingleVaults.bsc[0].configAddresses[0], testConfig.routerAddress, MasterChefSingleVaults.bsc[0].configAddresses[1], MasterChefSingleVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress],
      MasterChefSingleVaults.bsc[0].pid,
      MasterChefSingleVaults.bsc[0].earnedToWnativePath,
      MasterChefSingleVaults.bsc[0].earnedToUsdPath,
      MasterChefSingleVaults.bsc[0].earnedToBananaPath,
      MasterChefSingleVaults.bsc[0].earnedToWantPath,
    ]
  }
},
// LYPTUS -> NALIS
{
  contractName: 'StrategyKoalaChefSingle',
  vault: KoalaChefSingleVaults.bsc[0],
  wantToken: KoalaChefSingleVaults.bsc[0].configAddresses[1],
  initParams: (vaultApeAddress) => {
    return [
      [vaultApeAddress, KoalaChefSingleVaults.bsc[0].configAddresses[0], testConfig.routerAddress, KoalaChefSingleVaults.bsc[0].configAddresses[1], KoalaChefSingleVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress],
      KoalaChefSingleVaults.bsc[0].pid,
      KoalaChefSingleVaults.bsc[0].earnedToWnativePath,
      KoalaChefSingleVaults.bsc[0].earnedToUsdPath,
      KoalaChefSingleVaults.bsc[0].earnedToBananaPath,
      KoalaChefSingleVaults.bsc[0].earnedToWantPath,
    ]
  }
}
];

module.exports = {
  testConfig,
  testStrategies
}