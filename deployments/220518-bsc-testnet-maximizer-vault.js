const deployment = {
  keeper: 'https://keepers.chain.link/chapel/677',
  adminAddress: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
  masterApeAddress: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
  keeperOutput: {
    keeperMaximizerVaultApeAddress: '0xb644735E601e979F9bB6429af4037f05deA3Bb09',
    keeperMaximizerOwner: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581'
  },
  bananaVaultOutput: {
    bananaVaultAddress: '0xa9a80BaaACB326Cd26eFE17574F892c10428078B',
    MaximizerHasManagerRole: true,
    adminHasAdminRole: true,
    adminHasManagerRole: true,
    tempAdminHasAdminRole: false,
    tempAdminHasManagerRole: false
  },
  MaximizerSettings: {
    treasury: '0x033996008355D0BE4E022c00f06F844547e23dcF',
    keeperFee: 50,
    platform: '0x033996008355D0BE4E022c00f06F844547e23dcF',
    platformFee: 0,
    buyBackRate: 0,
    withdrawFee: 10,
    withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
    withdrawRewardsFee: 0
  },
  withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
  strategyOutput: [
    {
      strategyMaximizerMasterApe: '0xe635B6C53bCDB4e98224E2cDC50a130CA38f9647',
      farmPid: 7,
      farmStakeTokenAddress: '0x30E74ceFD298990880758E20223f03129F52E699',
      isBananaStaking: false
    },
    {
      strategyMaximizerMasterApe: '0x60ddD0e76a958Ba341aD677eAd713Af5Ef447D9d',
      farmPid: 8,
      farmStakeTokenAddress: '0x4419D815c9c9329f9679782e76ec15bCe1B14a6D',
      isBananaStaking: false
    }
  ]
}

const parsedDeployment = {
  keeper: 'https://keepers.chain.link/chapel/677',
  adminAddress: {
    address: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
    explorer: 'https://testnet.bscscan.com/address/0xE375D169F8f7bC18a544a6e5e546e63AD7511581'
  },
  masterApeAddress: {
    address: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
    explorer: 'https://testnet.bscscan.com/address/0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613'
  },
  keeperOutput: {
    keeperMaximizerVaultApeAddress: {
      address: '0xb644735E601e979F9bB6429af4037f05deA3Bb09',
      explorer: 'https://testnet.bscscan.com/address/0xb644735E601e979F9bB6429af4037f05deA3Bb09'
    },
    keeperMaximizerOwner: {
      address: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
      explorer: 'https://testnet.bscscan.com/address/0xE375D169F8f7bC18a544a6e5e546e63AD7511581'
    }
  },
  bananaVaultOutput: {
    bananaVaultAddress: {
      address: '0xa9a80BaaACB326Cd26eFE17574F892c10428078B',
      explorer: 'https://testnet.bscscan.com/address/0xa9a80BaaACB326Cd26eFE17574F892c10428078B'
    },
    MaximizerHasManagerRole: true,
    adminHasAdminRole: true,
    adminHasManagerRole: true,
    tempAdminHasAdminRole: false,
    tempAdminHasManagerRole: false
  },
  MaximizerSettings: {
    treasury: {
      address: '0x033996008355D0BE4E022c00f06F844547e23dcF',
      explorer: 'https://testnet.bscscan.com/address/0x033996008355D0BE4E022c00f06F844547e23dcF'
    },
    keeperFee: 50,
    platform: {
      address: '0x033996008355D0BE4E022c00f06F844547e23dcF',
      explorer: 'https://testnet.bscscan.com/address/0x033996008355D0BE4E022c00f06F844547e23dcF'
    },
    platformFee: 0,
    buyBackRate: 0,
    withdrawFee: 10,
    withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
    withdrawRewardsFee: 0
  },
  withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
  strategyOutput: [
    {
      strategyMaximizerMasterApe: {
        address: '0xe635B6C53bCDB4e98224E2cDC50a130CA38f9647',
        explorer: 'https://testnet.bscscan.com/address/0xe635B6C53bCDB4e98224E2cDC50a130CA38f9647'
      },
      farmPid: 7,
      farmStakeTokenAddress: {
        address: '0x30E74ceFD298990880758E20223f03129F52E699',
        explorer: 'https://testnet.bscscan.com/address/0x30E74ceFD298990880758E20223f03129F52E699'
      },
      isBananaStaking: false
    },
    {
      strategyMaximizerMasterApe: {
        address: '0x60ddD0e76a958Ba341aD677eAd713Af5Ef447D9d',
        explorer: 'https://testnet.bscscan.com/address/0x60ddD0e76a958Ba341aD677eAd713Af5Ef447D9d'
      },
      farmPid: 8,
      farmStakeTokenAddress: {
        address: '0x4419D815c9c9329f9679782e76ec15bCe1B14a6D',
        explorer: 'https://testnet.bscscan.com/address/0x4419D815c9c9329f9679782e76ec15bCe1B14a6D'
      },
      isBananaStaking: false
    }
  ]
}



module.exports = { deployment, parsedDeployment };
