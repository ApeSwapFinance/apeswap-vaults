/**
 * Pass in Truffle migration arguments to obtain deployment arguments for specific networks.
 * 
 * @param {*} network Network passed in Truffle migrations script
 * @param {*} accounts Accounts passed in Truffle migrations script
 * @returns 
 */
function getNetworkConfig(network, accounts) {
    if (["bsc", "bsc-fork"].includes(network)) {
        console.log(`Deploying with BSC MAINNET config.`)
        return {
            adminAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D', // BSC GSafe General Admin
            masterApeAddress: '0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9',
            bananaTokenAddress: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
            treasuryAddress: '0x65A25f178fD01e5e31FaBe85EeA86Ea06Ee5D43B', // Maximizer Vault LPFeeManager
            apeRouterAddress: '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7',
            wrappedNativeAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            chainlinkRegistry: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
            keeperMaximizerVaultApeAddress: '', // NOTE: Used to deploy single strategies
            explorerLink: (address) => `https://bscscan.com/address/${address}`,
            gnosisLink: (address) => `https://gnosis-safe.io/app/bnb:${address}/home`
        }
    } else if (['bsc-testnet', 'bsc-testnet-fork'].includes(network)) {
        console.log(`Deploying with BSC testnet config.`)
        return {
            adminAddress: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
            // adminAddress: '0x539EE706ea34a2145b653C995c4245f41450894d', // Doublo
            masterApeAddress: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
            bananaTokenAddress: '0x4Fb99590cA95fc3255D9fA66a1cA46c43C34b09a',
            treasuryAddress: '0x033996008355D0BE4E022c00f06F844547e23dcF', // Maximizer Vault LPFeeManager
            apeRouterAddress: "0x3380aE82e39E42Ca34EbEd69aF67fAa0683Bb5c1",
            wrappedNativeAddress: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
            chainlinkRegistry: "0xA3E3026562a3ADAF7A761B10a45217c400a4054A",
            keeperMaximizerVaultApeAddress: '0x88acDdae93F3624B96c82A49A0655c1959c8E1cb', // NOTE: Used to deploy single strategies
            explorerLink: (address) => `https://testnet.bscscan.com/address/${address}`,
            gnosisLink: (address) => address // Gnosis not supported for this network
        }
    } else if (['polygon', 'polygon-fork'].includes(network)) {
        console.log(`Deploying with POLYGON MAINNET config.`)
        return {
            adminAddress: '0x50Cf6cdE8f63316b2BD6AACd0F5581aEf5dD235D', // BSC GSafe General Admin
            explorerLink: (address) => `https://polygonscan.com/address/${address}`,
            gnosisLink: (address) => `https://gnosis-safe.io/app/matic:${address}/home`
        }
    } else if (['polygon-testnet', 'polygon-testnet-fork'].includes(network)) {
        console.log(`Deploying with POLYGON testnet config.`)
        return {
            adminAddress: '0xE375D169F8f7bC18a544a6e5e546e63AD7511581',
            explorerLink: (address) => `https://mumbai.polygonscan.com/address/${address}`,
            gnosisLink: (address) => address // Gnosis not supported for this network
        }
    } else if (['development'].includes(network)) {
        console.log(`Deploying with development config.`)
        return {
            adminAddress: accounts[1], // account 0 is used for tempAdmin
            treasuryAddress: accounts[2],
            masterApeAddress: '0xbbC5e1cD3BA8ED639b00927115e5f0e0040aA613',
            bananaTokenAddress: '0x4Fb99590cA95fc3255D9fA66a1cA46c43C34b09a',
            apeRouterAddress: '0x3380aE82e39E42Ca34EbEd69aF67fAa0683Bb5c1',
            wbnbAddress: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
            wrappedNativeAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            chainlinkRegistry: accounts[1],
            keeperMaximizerVaultApeAddress: '', // NOTE: Used to deploy single strategies
            explorerLink: (address) => address, // Explorer not supported for this network
            gnosisLink: (address) => address, // Gnosis not supported for this network
        }
    } else {
        throw new Error(`No config found for network ${network}.`)
    }
}

/**
 * Iterates through an object and converts any address strings to block explorer links passed
 * 
 * @param {Object<any>} addressObject Object to iterate through looking for possible addresses to convert
 * @param {(address: string) => string} getLink Function which takes an address and converts to an explorer link
 * @param {boolean} detailedInfo If `true` will instead turn an address string into an object {address: string, explorer: string}
 * @returns parsedAddressObject
 */
function convertAddressesToExplorerLinks(addressObject, getLink, detailedInfo = false) {
    // Using an internal function to allow for deep copying before
    function _convertAddressesToExplorerLinks(_addressObject, _getLink, _detailedInfo = false) {
        Object.keys(_addressObject).forEach(key => {
            const value = _addressObject[key];
            if (typeof value === 'object' && value !== null) {
                _convertAddressesToExplorerLinks(value, _getLink, _detailedInfo)
            } else if (typeof value === 'string') {
                // Check if value is an address
                if (value.length === 42 && value.slice(0, 2) === '0x') {
                    if (_detailedInfo) {
                        _addressObject[key] = {
                            address: value,
                            explorer: _getLink(value),
                        }
                    } else {
                        _addressObject[key] = _getLink(value)
                    }
                }
            }
        })
        return _addressObject;
    }
    const addrObjDeepCopy = JSON.parse(JSON.stringify(addressObject));
    return _convertAddressesToExplorerLinks(addrObjDeepCopy, getLink, detailedInfo)
}

module.exports = { getNetworkConfig, convertAddressesToExplorerLinks };
