const apeRouter = "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7";
const pcsRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const bananaAddress = "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95";
const cakeAddress = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
const wrappedNative = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const masterApe = "0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9";
const masterChef = "0x73feaa1eE314F8c655E354234017bE2193C9E24E"; //PCS

const farms = [
    {
        name: 'ApeSwap BNB-BANANA vault',
        pid: 1,
        masterchef: masterApe,
        wantAddress: '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713',
        rewardAddress: bananaAddress,
        router: apeRouter,
        tokensToLPAmount: "100000000000000000000",
        earnedToWnativePath: [bananaAddress, wrappedNative],
        earnedToBananaPath: [bananaAddress],
    },
    // {
    //     name: 'ApeSwap BNB-BUSD vault',
    //     pid: 3,
    //     masterchef: masterApe,
    //     wantAddress: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93',
    //     rewardAddress: bananaAddress,
    //     router: apeRouter,
    //     tokensToLPAmount: "100000000000000000000",
    //     earnedToWnativePath: [bananaAddress, wrappedNative],
    //     earnedToBananaPath: [bananaAddress],
    // },
    // {
    //     name: 'ApeSwap USDC-BUSD vault',
    //     pid: 8,
    //     masterchef: masterApe,
    //     wantAddress: '0xC087C78AbaC4A0E900a327444193dBF9BA69058E',
    //     rewardAddress: bananaAddress,
    //     router: apeRouter,
    //     tokensToLPAmount: "100000000000000000000",
    //     earnedToWnativePath: [bananaAddress, wrappedNative],
    //     earnedToBananaPath: [bananaAddress],
    // },
    {
        name: 'PCS Cake vault',
        pid: 0,
        masterchef: masterChef,
        wantAddress: cakeAddress,
        rewardAddress: cakeAddress,
        router: pcsRouter,
        tokensToLPAmount: "100000000000000000000",
        earnedToWnativePath: [cakeAddress, wrappedNative],
        earnedToBananaPath: [cakeAddress, bananaAddress],
    },
    // {
    //     name: 'PCS BNB-CAKE vault',
    //     pid: 251,
    //     masterchef: masterChef,
    //     wantAddress: "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0",
    //     rewardAddress: cakeAddress,
    //     router: pcsRouter,
    //     tokensToLPAmount: "100000000000000000000",
    //     earnedToWnativePath: [cakeAddress, wrappedNative],
    //     earnedToBananaPath: [cakeAddress, bananaAddress],
    // },
    // {
    //     name: 'Pacoca BNB-BANANA vault',
    //     pid: 17,
    //     masterchef: "0x55410D946DFab292196462ca9BE9f3E4E4F337Dd",
    //     wantAddress: "0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713",
    //     rewardAddress: "0x55671114d774ee99D653D6C12460c780a67f1D18",
    //     router: apeRouter,
    //     tokensToLPAmount: "100000000000000000000",
    //     earnedToWnativePath: ["0x55671114d774ee99D653D6C12460c780a67f1D18", wrappedNative],
    //     earnedToBananaPath: ["0x55671114d774ee99D653D6C12460c780a67f1D18", wrappedNative, bananaAddress],
    // },
];

module.exports = {
    farms,
}

/**
 * If you want to find a PCS farm
 const masterchef = new web3.eth.Contract(MasterChef_ABI, farmInfo.masterchef);

for (let i = 0; i < 400; i++) {
    const addr = await masterchef.methods.poolInfo(i).call();
    if (addr.lpToken == "0x0eD7e52944161450477ee417DE9Cd3a859b14fD0") {
    console.log("FOUNDDDD", i);
    return;
    }
    console.log(i, addr.lpToken);
}
 */