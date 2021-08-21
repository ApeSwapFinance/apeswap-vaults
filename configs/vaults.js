const MasterChefVaults = [
    {   
        // VID: 1 -  BANANA/BNB MasterApe https://bscscan.com/address/0x34eea30d37febf1c17aec86bf64e83162e6b79d8
        configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        pid: 1,
        earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken1Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    },
    {   
        // VID: 2 -  BANANA/BUSD MasterApe https://bscscan.com/address/0xea5c64199c63d5cc2e7b9e40d38f09999558d49f
        configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        pid: 2,
        earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken1Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    },
    {   
        // VID: 3 -  TAKO/BNB MasterApe - https://bscscan.com/address/0x0e43e6e5a625369e2ab5ff91b1d5b8b6c21443de
        configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43','0xdb77fa37766dbf0d74bc9f0ad497f7cc887ea322','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        pid: 5,
        earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
    }
];

const MasterApeSingleVaults = [
    {   
        // VID: 0 - BANANA -> BANANA MasterApe https://bscscan.com/address/0xb9cab3025130527a2b45cf8455e01159d94c844f
        configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        pid: 0,
        earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    }
];

const MasterChefSingleVaults = [
    {   
        // VID: 4 -  TAKO -> TAKO MasterApe https://bscscan.com/address/0x388e7d10266de5ae7de97340571ede51eee30dbc
        configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        pid: 0,
        earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    }
];

module.exports = {
    MasterChefSingleVaults,
    MasterApeSingleVaults,
    MasterChefVaults
}