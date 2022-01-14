const { MasterChefVaults, MasterApeSingleVaults, KoalaChefSingleVaults, MasterChefReflectVaults, MasterChefSingleVaults, BeltTokenVaults, Belt4TokenVaults } = require('../../configs/vaults');


const testConfig = {
  //0x9f6609Ec4601F7974d4adA0c73e6bf1ddC29A0E5 has a lot of busd and bnb and wbnb
  //0xF0eFA30090FED96C5d8A0B089C8aD56f1388A608 has a lot of bananas
  testAccount: '0x9f6609Ec4601F7974d4adA0c73e6bf1ddC29A0E5',//'0x41f2E851431Ae142edE42B6C467515EF5053061d',
  testAccount2: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
  adminAddress: "0x0341242Eb1995A9407F1bf632E8dA206858fBB3a",
  //PCS Router: 0x10ED43C718714eb63d5aA57B78B54704E256024E
  //ApeSwap Router: 0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7
  routerAddress: "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
  pcsRouterAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
  usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  wrappedNative: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  autoFarm: "0x0895196562C7868C5Be92459FaE7f877ED450452",
  masterBelt: "0xd4bbc80b9b102b77b21a06cb77e954049605e6c1",
  rewardAddress: "0x4EB6b0A7543508f6EbD81c2E9c7cA7A471475e73",
  buyBackAddress: "0xa22c3fAc4B4a4dfbF6a8F5F8fe85d9478acE2B0C",
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
    tokensToLPAmount: "10000000000000000000",
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
    tokensToLPAmount: "1000000000000000000000",
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
  },
  // beltBNB -> AUTO
  // {
  //   contractName: 'StrategyAutoBeltToken',
  //   vault: BeltAutoStrategies.bsc[0],
  //   wantToken: BeltAutoStrategies.bsc[0].configAddresses[1],
  //   initParams: (vaultApeAddress) => {
  //     return [
  //       [vaultApeAddress, BeltAutoStrategies.bsc[0].configAddresses[0], testConfig.routerAddress, BeltAutoStrategies.bsc[0].configAddresses[1], BeltAutoStrategies.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress, BeltAutoStrategies.bsc[0].configAddresses[3]],
  //       BeltAutoStrategies.bsc[0].earnedToWnativePath,
  //       BeltAutoStrategies.bsc[0].earnedToUsdPath,
  //       BeltAutoStrategies.bsc[0].earnedToBananaPath,
  //       BeltAutoStrategies.bsc[0].earnedToWantPath,
  //       BeltAutoStrategies.bsc[0].pid,
  //     ]
  //   }
  // },
  // beltBNB -> BELT
  {
    name: 'beltBNB',
    contractName: 'StrategyBeltToken',
    vault: BeltTokenVaults.bsc[0],
    wantToken: BeltTokenVaults.bsc[0].configAddresses[0],
    oToken: BeltTokenVaults.bsc[0].configAddresses[3],
    initParams: (vaultApeAddress) => {
      return [
        [vaultApeAddress, testConfig.pcsRouterAddress, BeltTokenVaults.bsc[0].configAddresses[0], BeltTokenVaults.bsc[0].configAddresses[1], testConfig.usdAddress, testConfig.bananaAddress, BeltTokenVaults.bsc[0].configAddresses[2], BeltTokenVaults.bsc[0].configAddresses[3]],
        BeltTokenVaults.bsc[0].earnedToWnativePath,
        BeltTokenVaults.bsc[0].earnedToUsdPath,
        BeltTokenVaults.bsc[0].earnedToBananaPath,
        BeltTokenVaults.bsc[0].earnedToWantPath,
        BeltTokenVaults.bsc[0].pid,
      ]
    }
  },
  // beltBTC -> BELT
  {
    name: 'beltBTC',
    contractName: 'StrategyBeltToken',
    vault: BeltTokenVaults.bsc[1],
    wantToken: BeltTokenVaults.bsc[1].configAddresses[0],
    oToken: BeltTokenVaults.bsc[1].configAddresses[3],
    tokensToLPAmount: "1000000000000000",
    initParams: (vaultApeAddress) => {
      return [
        [vaultApeAddress, testConfig.pcsRouterAddress, BeltTokenVaults.bsc[1].configAddresses[0], BeltTokenVaults.bsc[1].configAddresses[1], testConfig.usdAddress, testConfig.bananaAddress, BeltTokenVaults.bsc[1].configAddresses[2], BeltTokenVaults.bsc[1].configAddresses[3]],
        BeltTokenVaults.bsc[1].earnedToWnativePath,
        BeltTokenVaults.bsc[1].earnedToUsdPath,
        BeltTokenVaults.bsc[1].earnedToBananaPath,
        BeltTokenVaults.bsc[1].earnedToWantPath,
        BeltTokenVaults.bsc[1].pid,
      ]
    }
  },
  // 4Belt -> BELT
  {
    contractName: 'Strategy4Belt',
    vault: Belt4TokenVaults.bsc[0],
    wantToken: Belt4TokenVaults.bsc[0].configAddresses[1],
    tokensToLPAmount: "100000000000000000000",
    initParams: (vaultApeAddress) => {
      return [
        [vaultApeAddress, Belt4TokenVaults.bsc[0].configAddresses[0], testConfig.pcsRouterAddress, Belt4TokenVaults.bsc[0].configAddresses[1], Belt4TokenVaults.bsc[0].configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress, Belt4TokenVaults.bsc[0].configAddresses[3]],
        Belt4TokenVaults.bsc[0].earnedToWnativePath,
        Belt4TokenVaults.bsc[0].earnedToUsdPath,
        Belt4TokenVaults.bsc[0].earnedToBananaPath,
        Belt4TokenVaults.bsc[0].pid,
      ]
    }
  }
];

module.exports = {
  testConfig,
  testStrategies
}