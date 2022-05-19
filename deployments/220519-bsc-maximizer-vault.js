const deployment = {
    keeper: 'https://keepers.chain.link/',
    adminAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D',
    masterApeAddress: '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9',
    keeperOutput: {
        keeperMaximizerVaultApeAddress: '0xd05C4e96495FF95b1A8D3700ad5b50a54516eF92',
        keeperMaximizerOwner: '0x876688C3dF57953259D69de76B9F209bB3645e12'
    },
    bananaVaultOutput: {
        bananaVaultAddress: '0xd3b7Ec9051cc6067E5BD544B53b7633c196093A1',
        MaximizerHasManagerRole: true,
        adminHasAdminRole: true,
        adminHasManagerRole: true,
        tempAdminHasAdminRole: false,
        tempAdminHasManagerRole: false
    },
    MaximizerSettings: {
        treasury: '0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B',
        keeperFee: 50,
        platform: '0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B',
        platformFee: 0,
        buyBackRate: 0,
        withdrawFee: 10,
        withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
        withdrawRewardsFee: 0
    },
    withdrawFeePeriod: '57896044618658097711785492504343953926634992332820282019728792003956564819968',
    strategyOutput: [
        {
            strategyMaximizerMasterApe: '0x9FF9E711F479AF05f8964d4887B1A019B23ef097',
            farmPid: 1,
            farmStakeTokenAddress: '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713',
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: '0x179d3911A288E92b38082ed7be06d7aBFB3D5c47',
            farmPid: 2,
            farmStakeTokenAddress: '0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914',
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: '0xEd1b5787fA2f5630E3BB9B673E6a9B0D6c6De47B',
            farmPid: 3,
            farmStakeTokenAddress: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: '0x84B58D71D626158D4Ebb4a5acf09a3fd9e8F6cE4',
            farmPid: 45,
            farmStakeTokenAddress: '0x29A4A3D77c010CE100A45831BF7e798f0f0B325D',
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: '0xAa58f8BbD94A124Df867B7f5b40A719A605bbD7A',
            farmPid: 49,
            farmStakeTokenAddress: '0x47A0B7bA18Bb80E4888ca2576c2d34BE290772a6',
            isBananaStaking: false
        }
    ]
}

const parsedDeployment = {
    adminAddress: {
        address: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D',
        explorer: 'https://bscscan.com/address/0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D'
    },
    masterApeAddress: {
        address: '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9',
        explorer: 'https://bscscan.com/address/0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9'
    },
    keeperOutput: {
        keeperMaximizerVaultApeAddress: {
            address: '0xd05C4e96495FF95b1A8D3700ad5b50a54516eF92',
            explorer: 'https://bscscan.com/address/0xd05C4e96495FF95b1A8D3700ad5b50a54516eF92'
        },
        keeperMaximizerOwner: {
            address: '0x876688C3dF57953259D69de76B9F209bB3645e12',
            explorer: 'https://bscscan.com/address/0x876688C3dF57953259D69de76B9F209bB3645e12'
        }
    },
    bananaVaultOutput: {
        bananaVaultAddress: {
            address: '0xd3b7Ec9051cc6067E5BD544B53b7633c196093A1',
            explorer: 'https://bscscan.com/address/0xd3b7Ec9051cc6067E5BD544B53b7633c196093A1'
        },
        MaximizerHasManagerRole: true,
        adminHasAdminRole: true,
        adminHasManagerRole: true,
        tempAdminHasAdminRole: false,
        tempAdminHasManagerRole: false
    },
    MaximizerSettings: {
        treasury: {
            address: '0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B',
            explorer: 'https://bscscan.com/address/0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B'
        },
        keeperFee: 50,
        platform: {
            address: '0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B',
            explorer: 'https://bscscan.com/address/0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B'
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
                address: '0x9FF9E711F479AF05f8964d4887B1A019B23ef097',
                explorer: 'https://bscscan.com/address/0x9FF9E711F479AF05f8964d4887B1A019B23ef097'
            },
            farmPid: 1,
            farmStakeTokenAddress: {
                address: '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713',
                explorer: 'https://bscscan.com/address/0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713'
            },
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: {
                address: '0x179d3911A288E92b38082ed7be06d7aBFB3D5c47',
                explorer: 'https://bscscan.com/address/0x179d3911A288E92b38082ed7be06d7aBFB3D5c47'
            },
            farmPid: 2,
            farmStakeTokenAddress: {
                address: '0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914',
                explorer: 'https://bscscan.com/address/0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914'
            },
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: {
                address: '0xEd1b5787fA2f5630E3BB9B673E6a9B0D6c6De47B',
                explorer: 'https://bscscan.com/address/0xEd1b5787fA2f5630E3BB9B673E6a9B0D6c6De47B'
            },
            farmPid: 3,
            farmStakeTokenAddress: {
                address: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
                explorer: 'https://bscscan.com/address/0x51e6D27FA57373d8d4C256231241053a70Cb1d93'
            },
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: {
                address: '0x84B58D71D626158D4Ebb4a5acf09a3fd9e8F6cE4',
                explorer: 'https://bscscan.com/address/0x84B58D71D626158D4Ebb4a5acf09a3fd9e8F6cE4'
            },
            farmPid: 45,
            farmStakeTokenAddress: {
                address: '0x29A4A3D77c010CE100A45831BF7e798f0f0B325D',
                explorer: 'https://bscscan.com/address/0x29A4A3D77c010CE100A45831BF7e798f0f0B325D'
            },
            isBananaStaking: false
        },
        {
            strategyMaximizerMasterApe: {
                address: '0xAa58f8BbD94A124Df867B7f5b40A719A605bbD7A',
                explorer: 'https://bscscan.com/address/0xAa58f8BbD94A124Df867B7f5b40A719A605bbD7A'
            },
            farmPid: 49,
            farmStakeTokenAddress: {
                address: '0x47A0B7bA18Bb80E4888ca2576c2d34BE290772a6',
                explorer: 'https://bscscan.com/address/0x47A0B7bA18Bb80E4888ca2576c2d34BE290772a6'
            },
            isBananaStaking: false
        }
    ]
}

module.exports = { deployment, parsedDeployment }