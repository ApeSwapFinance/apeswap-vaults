const { getContractGetterSnapshot } = require('../contractHelper');
const { formatBNObjectToString } = require('../bnHelper');

async function getUserInfoSnapshot(strategyContract, userAddress) {
    let promises = [];
    let userInfo = {};

    const functionCalls = [
        {
            functionName: 'balanceOf',
            functionArgs: [userAddress]
        },
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

async function getStrategyMaximizerSnapshot(strategyContract, accounts) {
    const contractSnapshot = await getContractGetterSnapshot(strategyContract, [
        'accSharesPerStakedToken',
        'totalAutoBananaShares',
        'totalStake',
        'getExpectedOutputs',
        'settings',
        'useDefaultSettings',
    ])

    let accountPromises = [];
    let accountSnapshots = {};
    for (const account of accounts) {
        accountPromises.push(
            getUserInfoSnapshot(strategyContract, account).then(
                (accountSnapshot) =>
                    (accountSnapshots = { ...accountSnapshots, [account]: accountSnapshot })
            )
        );
    }
    await Promise.all(accountPromises);

    const snapshot = { contractSnapshot, accountSnapshots };
    return snapshot;
}

module.exports = { getUserInfoSnapshot, getStrategyMaximizerSnapshot }
