const MasterChefVaults = {
    bsc: [
        {
            // VID: 1 -  BANANA/BNB MasterApe https://bscscan.com/address/0x4e4efe113214c1371b264c09f59f64c5f12589f8
            configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            pid: 1,
            earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken1Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        },
        {
            // VID: 2 -  BANANA/BUSD MasterApe https://bscscan.com/address/0x234101c6612115cac7bdb74ee20f388bb95db8cc
            configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            pid: 2,
            earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken1Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        },
        {
            // VID: x -  BUSD/USDC MasterApe x
            configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0xC087C78AbaC4A0E900a327444193dBF9BA69058E', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            pid: 8,
            earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'],
            earnedToToken1Path: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        },
        {
            // VID: 4 -  TAKO/BNB MasterApe - https://bscscan.com/address/0x1a28148fcdb86a7f290bf8d787dbc02131e75cb4
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0xdb77fa37766dbf0d74bc9f0ad497f7cc887ea322', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 5,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        },
        {
            // VID: 5 -  TAKO/BUSD MasterApe - https://bscscan.com/address/0x1d2485cb0a027d182a38d841670d38b13b373439
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0xe4fba63b748175d2775bfe49c106a10800200bb6', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 6,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        },
        {
            // VID: 17 -  INKU/BNB MasterApe - https://bscscan.com/address/0x66393477b5da3451dc4b55c4a2bedd13a9963078
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0xbd229081e5ce7b4ca5a63b65f3b2fea804fce819', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 20,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xb37cad62441ef8b866f3e36f12fd42062b6c0f33'],
            earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0xb37cad62441ef8b866f3e36f12fd42062b6c0f33', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        },
        {
            // VID: 18 -  INKU/BUSD MasterApe - https://bscscan.com/address/0x401e3534daad56cea6ba066534e32186e21f51f7
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0x5cd6a02caddf484d758d39f2f4005074c771cca9', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 22,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xb37cad62441ef8b866f3e36f12fd42062b6c0f33'],
            earnedToToken1Path: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0xb37cad62441ef8b866f3e36f12fd42062b6c0f33', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        },
        {
            // VID: 7 -  BBQ/BNB MasterApe - https://bscscan.com/address/0x5dd098bf3f713d32ea5338c374e080daa1f84ec9
            configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec', '0x3d6a067dc8a5b6657749905eeaaa39b43af4f294', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            pid: 12,
            earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToToken1Path: ['0x0000000000000000000000000000000000000000', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            token0ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            token1ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        },
        {
            // VID: 8 -  BBQ/BUSD MasterApe - https://bscscan.com/address/0xd8579a412c2dfe2532ed77d68ec8a3040ec3792a
            configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec', '0x376d38a381919f9d1c61715d34f8163c28bb23e5', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            pid: 13,
            earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            earnedToToken1Path: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        }
    ],
    polygon: [
        {
            // VID: 0 - CRYSTL/MATIC -> CRYSTL MasterChef 
            configAddresses: ['0xebcc84d2a73f0c9e23066089c6c24f4629ef1e6d', '0xb8e54c9ea1616beebe11505a419dd8df1000e02a', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            pid: 1,
            earnedToWnativePath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'],
            earnedToBananaPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToToken1Path: ['0x0000000000000000000000000000000000000000', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            token0ToEarnedPath: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            token1ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
        },
        {
            // VID: 0 - BANANA/ETH -> CRYSTL MasterChef 
            configAddresses: ['0xebcc84d2a73f0c9e23066089c6c24f4629ef1e6d', '0x44b82c02f404ed004201fb23602cc0667b1d011e', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            pid: 3,
            earnedToWnativePath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'],
            earnedToBananaPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken1Path: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'],
            token0ToEarnedPath: ['0x5d47baba0d66083c52009271faf3f50dcc01023c', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            token1ToEarnedPath: ['0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
        },
        {
            // VID: 0 - HAIR/MATIC -> HAIR MasterChef
            configAddresses: ['0xc6ae34172bb4fc40c49c3f53badebce3bb8e6430', '0x491c17b1b9aa867f3a7a480baffc0721d59a7393', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            pid: 1,
            earnedToWnativePath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToToken1Path: ['0x0000000000000000000000000000000000000000', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            token0ToEarnedPath: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            token1ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
        },
        {
            // VID: 0 - HAIR/USDC -> HAIR MasterChef
            configAddresses: ['0xc6ae34172bb4fc40c49c3f53badebce3bb8e6430', '0xb394009787c2d0cb5b45d06e401a39648e21d681', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            pid: 8,
            earnedToWnativePath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            earnedToToken1Path: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            token1ToEarnedPath: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
        }
    ]
};

const MasterChefReflectVaults = {
    bsc: [
        {
            // VID: 40 -  SING/BUSD MasterApe - https://bscscan.com/address/0x27B4e72CA589b629e96077e11DfaB94fc57b2e29
            configAddresses: ['0x31b05a72037e91b86393a0f935fe7094141ba0a7', '0xdddc245c62a0aa875893ab53b52455acdcd7f526', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            pid: 0,
            earnedToWnativePath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            earnedToToken1Path: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
        },
        {
            // VID: 39 -  SING/BNB MasterApe - https://bscscan.com/address/0x64e079980a701779C71BEab3372CaB88236DC536
            configAddresses: ['0x31b05a72037e91b86393a0f935fe7094141ba0a7', '0xdd5f9a9f05a9680867936c878ae6db4c9dab5c37', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            pid: 1,
            earnedToWnativePath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            earnedToToken1Path: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
        }
    ],
    polygon: []
}



const MasterApeSingleVaults = {
    bsc: [
        {
            // VID: 0 - BANANA -> BANANA MasterApe https://bscscan.com/address/0x9a668d5482828a444d7322fe5420ab5b44ce3de7
            configAddresses: ['0x5c8d727b265dbafaba67e050f2f739caeeb4a6f9', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            pid: 0,
            earnedToWnativePath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x0000000000000000000000000000000000000000', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
        },
    ],
    polygon: [
        {
            // VID: 0 - SING/USDC -> SING MasterChef
            configAddresses: ['0x9762fe3ef5502df432de41e7765b0ccc90e02e92', '0x6046eb198abc5ea4f17027bc00a2aee0420e84ee', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            pid: 0,
            earnedToWnativePath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToToken1Path: ['0x0000000000000000000000000000000000000000', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            token0ToEarnedPath: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            token1ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
        },
        {
            // VID: 0 - SING/WMATIC -> SING MasterChef
            configAddresses: ['0x9762fe3ef5502df432de41e7765b0ccc90e02e92', '0x854d3639f38f65c091664062230091858955ddc2', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            pid: 1,
            earnedToWnativePath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToToken0Path: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToToken1Path: ['0x0000000000000000000000000000000000000000', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            token0ToEarnedPath: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            token1ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
        }
    ]
};

const KoalaChefSingleVaults = {
    bsc: [
        {
            // VID: 9 - LYPTUS -> NALIS KoalaChef https://bscscan.com/address/0x8fc695150ba8d8fd575cbb23909d0ea9f3758ecb
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0xba26397cdff25f0d26e815d218ef3c77609ae7f1', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 1,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xba26397cdff25f0d26e815d218ef3c77609ae7f1'],
        },
        {
            // VID: 36 - NALIS -> NALIS KoalaChef https://bscscan.com/address/0x4523c6e7e17b859fd6b17731649c5eda78ce4c26
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 0,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
    ],
    polygon: []
};

const KoalaChefVaults = {
    bsc: [
        {
            // VID: 10 - LYPTUS/BNB -> NALIS KoalaChef https://bscscan.com/address/0x8854a605f72932d2524ad95e175ac9478582dd71
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0x1ea398a30f0f2a6ce00bebfe08fe11cd9df5afb6', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 9,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xba26397cdff25f0d26e815d218ef3c77609ae7f1'],
            earnedToToken1Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0xba26397cdff25f0d26e815d218ef3c77609ae7f1', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
        {
            // VID: 11 - LYPTUS/BUSD -> NALIS KoalaChef https://bscscan.com/address/0xb804ddc3c93778b517abf0da422fc00d10bf348a
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0x744527700ceb261689df9862fcd0036f5771324c', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 8,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xba26397cdff25f0d26e815d218ef3c77609ae7f1'],
            earnedToToken1Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0xba26397cdff25f0d26e815d218ef3c77609ae7f1', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
        {
            // VID: 13 - NALIS/BNB -> NALIS KoalaChef https://bscscan.com/address/0xee8b8f798ab1e7124e13884236cf66551b5b1d39
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0x8c7ef42d68889ef820cae512f43d8c256fdaa1a0', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 7,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            earnedToToken1Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            token1ToEarnedPath: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
        {
            // VID: 14 - NALIS/BUSD -> NALIS KoalaChef https://bscscan.com/address/0xc413901624b3ae28f9546c690e054840c21e3b9c
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0x138acb44f9f2e4e7f3bbcb7bbb1a268068dc202c', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 6,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            earnedToToken1Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
    ],
    polygon: [
        {
            // VID: 14 - NALIS/BUSD -> NALIS KoalaChef https://bscscan.com/address/0xc413901624b3ae28f9546c690e054840c21e3b9c
            configAddresses: ['0x7b3ca828e189739660310b47fc89b3a3e8a0e564', '0x138acb44f9f2e4e7f3bbcb7bbb1a268068dc202c', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            pid: 6,
            earnedToWnativePath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToToken0Path: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            earnedToToken1Path: ['0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            token0ToEarnedPath: ['0x0000000000000000000000000000000000000000', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
            token1ToEarnedPath: ['0xe9e7cea3dedca5984780bafc599bd69add087d56', '0xb2ebaa0ad65e9c888008bf10646016f7fcdd73c3'],
        },
    ]
};

const MasterChefSingleVaults = {
    bsc: [
        {
            // VID: 3 -  TAKO -> TAKO MasterApe https://bscscan.com/address/0x402af21344ef92880a8e2b066bafd38f4e3de815
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 0,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
        },
        {
            // VID: 16 -  INKU -> TAKO MasterApe https://bscscan.com/address/0x05b4582c52963ed192cc6b419913505c964e702c
            configAddresses: ['0x4448336ba564bd620be90d55078e397c26492a43', '0xb37cad62441ef8b866f3e36f12fd42062b6c0f33', '0x2f3391aebe27393aba0a790aa5e1577fea0361c2'],
            pid: 21,
            earnedToWnativePath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0x2f3391aebe27393aba0a790aa5e1577fea0361c2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xb37cad62441ef8b866f3e36f12fd42062b6c0f33'],
        },
        {
            // VID: 6 - BBQ -> BBQ MasterChef https://bscscan.com/address/0xd31d80e7e76a9f9fd1363b32f2e487b9d4ba1149
            configAddresses: ['0x26b2081247222f44d010a1a7ec74fe9ecc1d89ec', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
            pid: 0,
            earnedToWnativePath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xd9a88f9b7101046786490baf433f0f6ab3d753e2', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0xd9a88f9b7101046786490baf433f0f6ab3d753e2'],
        },
    ],
    polygon: [
        {
            // VID: 0 - CRYSTL -> CRYSTL MasterChef
            configAddresses: ['0xebcc84d2a73f0c9e23066089c6c24f4629ef1e6d', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
            pid: 0,
            earnedToWnativePath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'],
            earnedToBananaPath: ['0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0x76bf0c28e604cc3fe9967c83b3c3f31c213cfe64'],
        },
        {
            // VID: 0 - HAIR -> HAIR MasterChef
            configAddresses: ['0xc6ae34172bb4fc40c49c3f53badebce3bb8e6430', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
            pid: 0,
            earnedToWnativePath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0x100A947f51fA3F1dcdF97f3aE507A72603cAE63C'],
        }
    ]
};


const MasterChefSingleReflectVaults = {
    bsc: [
        {
            // VID: 38 -  SING -> SING MasterApe - https://bscscan.com/address/0xf04c2b3b2632990220277d9933d15874035d1bc7
            configAddresses: ['0x31b05a72037e91b86393a0f935fe7094141ba0a7', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
            pid: 2,
            earnedToWnativePath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563', '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0x23894c0ce2d79b79ea33a4d02e67ae843ef6e563'],
        }
    ],
    polygon: [
        {
            // VID: 0 - SING -> SING MasterChef
            configAddresses: ['0x9762fe3ef5502df432de41e7765b0ccc90e02e92', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
            pid: 2,
            earnedToWnativePath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'],
            earnedToUsdPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'],
            earnedToBananaPath: ['0xcb898b0efb084df14dd8e018da37b4d0f06ab26d', '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0x5d47baba0d66083c52009271faf3f50dcc01023c'],
            earnedToWantPath: ['0x0000000000000000000000000000000000000000', '0xcb898b0efb084df14dd8e018da37b4d0f06ab26d'],
        }
    ]
};

const BeltAutoStrategies = {
    bsc: [
        // beltBNB
        {
            configAddresses: ['0x763a05bdb9f8946d8C3FA72d1e0d3f5E68647e5C', '0xa8Bb71facdd46445644C277F9499Dd22f6F0A30C', '0xa184088a740c695e156f91f5cc086a06bb78b827', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            pid: 338,
            earnedToWnativePath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        },
        // 4Belt
        {
            configAddresses: ['0x9cb73f20164e399958261c289eb5f9846f4d1404', '0xa184088a740c695e156f91f5cc086a06bb78b827', '0xF6e65B33370Ee6A49eB0dbCaA9f43839C1AC04d5'],
            pid: 341,
            earnedToWnativePath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xe9e7cea3dedca5984780bafc599bd69add087d56'],
            earnedToBananaPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95'],
            earnedToWantPath: ['0xa184088a740c695e156f91f5cc086a06bb78b827', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        },
    ]
}

const BeltTokenVaults = {
    bsc: [
        // beltBNB -> BELT
        {
            configAddresses: ['0xa8Bb71facdd46445644C277F9499Dd22f6F0A30C', '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xD4BbC80b9B102b77B21A06cb77E954049605E6c1', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            pid: 9,
            earnedToWnativePath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'],
            earnedToBananaPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95'],
            earnedToWantPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        },
        // beltBTC -> BELT
        {
            configAddresses: ['0x51bd63F240fB13870550423D208452cA87c44444', '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xD4BbC80b9B102b77B21A06cb77E954049605E6c1', '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'],
            pid: 7,
            earnedToWnativePath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'],
            earnedToBananaPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95'],
            earnedToWantPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c'],
        },
    ]
}

const Belt4TokenVaults = {
    bsc: [
        // 4belt -> BELT
        {
            configAddresses: ['0xD4BbC80b9B102b77B21A06cb77E954049605E6c1', '0x9cb73F20164e399958261c289Eb5F9846f4D1404', '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xF6e65B33370Ee6A49eB0dbCaA9f43839C1AC04d5'],
            pid: 3,
            earnedToWnativePath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
            earnedToUsdPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'],
            earnedToBananaPath: ['0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f', '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95'],
        },
    ]
}

module.exports = {
    MasterChefSingleVaults,
    MasterApeSingleVaults,
    MasterChefVaults,
    KoalaChefSingleVaults,
    KoalaChefVaults,
    MasterChefSingleReflectVaults,
    MasterChefReflectVaults,
    BeltTokenVaults,
    Belt4TokenVaults
}