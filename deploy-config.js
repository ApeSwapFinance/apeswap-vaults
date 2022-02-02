
function getNetworkConfig(network, accounts) {
    if(["bsc", "bsc-fork"].includes(network)) {
        console.log(`Deploying with BSC MAINNET config.`)
        return {
            adminAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D', // BSC GSafe General Admin
        }
    } else if (['bsc-testnet', 'bsc-testnet-fork'].includes(network)) {
        console.log(`Deploying with BSC testnet config.`)
        return {
            adminAddress: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
            masterApeAddress: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
            bananaTokenAddress: '0x4Fb99590cA95fc3255D9fA66a1cA46c43C34b09a',
        }
    } else if (['polygon', 'polygon-fork'].includes(network)) {
        console.log(`Deploying with BSC MAINNET config.`)
        return {
            adminAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D', // BSC GSafe General Admin
        }
    } else if (['polygon-testnet', 'polygon-testnet-fork'].includes(network)) {
        console.log(`Deploying with BSC testnet config.`)
        return {
            adminAddress: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
        }
    } else if (['development'].includes(network)) {
        console.log(`Deploying with development config.`)
        return {
            adminAddress: accounts[0],
        }
    } else {
        throw new Error(`No config found for network ${network}.`)
    }
}

module.exports = { getNetworkConfig };
