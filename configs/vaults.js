const MasterChefVaults = [
    {   
        // VID: 1 -  BANANA/BNB MasterApe https://bscscan.com/address/0xb0b589bc7f4f1b81a71152dd3ebd9e105fafd445
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
        // VID: 2 -  BANANA/BUSD MasterApe https://bscscan.com/address/0x6d58d0d59d13e1fc2af5d87ec0756151127df7a4
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
        // VID: 3 -  TAKO/BNB MasterApe - https://bscscan.com/address/0x42b6ac5ebb465927bd1df02745e353735785e859
        configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43','0xdb77fa37766dbf0d74bc9f0ad497f7cc887ea322','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        pid: 5,
        earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
    },
    {   
        // VID: 5 -  TAKO/BUSD MasterApe - https://bscscan.com/address/0x559bc3c55cb05b10fd0e6173ac7c934e657d1f7f
        configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43','0xe4fba63b748175d2775bfe49c106a10800200bb6','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        pid: 6,
        earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56','0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
    },
    {   
        // VID: 7 -  BBQ/BNB MasterApe - https://bscscan.com/address/0xeb299c1b0e6e2cfbe7cca54353e732e2871e4996
        configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec','0x3d6a067dc8a5b6657749905eeaaa39b43af4f294','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        pid: 12,
        earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToToken1Path: ['0x0000000000000000000000000000000000000000','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        token0ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        token1ToEarnedPath: ['0x0000000000000000000000000000000000000000','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
    },
    {   
        // VID: 8 -  BBQ/BUSD MasterApe - https://bscscan.com/address/0xcda7f65b12c37284a1a4c9f3740400f1ac6c34c5
        configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec','0x376d38a381919f9d1c61715d34f8163c28bb23e5','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        pid: 13,
        earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToToken0Path: ['0x0000000000000000000000000000000000000000','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        earnedToToken1Path: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        token0ToEarnedPath: ['0x0000000000000000000000000000000000000000','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56','0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
    }
];

const MasterApeSingleVaults = [
    {   
        // VID: 0 - BANANA -> BANANA MasterApe https://bscscan.com/address/0x4eBD80dd32548c6422c0E3ebEA18F863f59a80B9
        configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        pid: 0,
        earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x0000000000000000000000000000000000000000','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    },
];

const KoalaChefSingleVaults = [
    {   
        // VID: 10 - LYPTUS -> NALIS KoalaChef https://bscscan.com/address/0x6ff8369282c292d832d18f302619b71ccef5af80
        configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0xba26397cdff25f0d26e815d218ef3c77609ae7f1', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        pid: 1,
        earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xe9e7cea3dedca5984780bafc599bd69add087d56','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToWantPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xe9e7cea3dedca5984780bafc599bd69add087d56','0xba26397cdff25f0d26e815d218ef3c77609ae7f1'],
    },
    {   
        // VID: 11 - NALIS -> NALIS KoalaChef https://bscscan.com/address/0xd18cb0739149d39f2429dffee6e086f2ca1b0627
        configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        pid: 0,
        earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3','0xe9e7cea3dedca5984780bafc599bd69add087d56','0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        earnedToWantPath: ['0x0000000000000000000000000000000000000000','0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
    },
];

const MasterChefSingleVaults = [
    {   
        // VID: 4 -  TAKO -> TAKO MasterApe https://bscscan.com/address/0xf7dd757994be51ed7e77f83f5ff63434e10246cf
        configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        pid: 0,
        earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    },
    {   
        // VID: 6 - BBQ -> BBQ MasterChef https://bscscan.com/address/0x476666c9d628c680cd7e38bc34218e8dc89432db
        configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        pid: 0,
        earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2','0xe9e7cea3dedca5984780bafc599bd69add087d56'],
        earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
    }
];

module.exports = {
    MasterChefSingleVaults,
    MasterApeSingleVaults,
    MasterChefVaults,
    KoalaChefSingleVaults
}