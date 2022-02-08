const { getContractGetterSnapshot } = require('../contractHelper');
const { formatBNObjectToString } = require('../bnHelper');

async function getUserInfoSnapshot(strategyContract, userAddress) {
    let promises = [];
    let userInfo = {};

    const functionCalls = [
        {
            functionName: 'userInfo',
            functionArgs: [userAddress]
        },
    ]

    for (const functionCall of functionCalls) {
        promises.push(
            strategyContract[functionCall.functionName](...functionCall.functionArgs).then(
                (value) =>
                    (userInfo = { ...userInfo, [functionCall.functionName]: formatBNObjectToString(value) })
            )
        );
    }

    await Promise.all(promises);
    return userInfo;
}


async function getBananaVaultSnapshot(bananaVaultContract, accounts) {
    const contractSnapshot = await getContractGetterSnapshot(bananaVaultContract, [
        'bananaToken',
        'lastHarvestedTime',
        'totalShares',
        'calculateTotalPendingBananaRewards',
        'getPricePerFullShare',
        'underlyingTokenBalance',
    ])

    let accountPromises = [];
    let accountSnapshots = {};
    for (const account of accounts) {
        accountPromises.push(
            getUserInfoSnapshot(bananaVaultContract, account).then(
                (accountSnapshot) =>
                    (accountSnapshots = { ...accountSnapshots, [account]: accountSnapshot })
            )
        );
    }
    await Promise.all(accountPromises);

    const snapshot = { contractSnapshot, accountSnapshots };
    return snapshot;
}

module.exports = { getUserInfoSnapshot, getBananaVaultSnapshot }
