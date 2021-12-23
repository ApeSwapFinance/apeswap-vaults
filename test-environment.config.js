require('dotenv').config();

module.exports = {
    accounts: {
        amount: 10, // Number of unlocked accounts
        ether: 100, // Initial balance of unlocked accounts (in ether)
    },

    contracts: {
        // type: 'truffle', // Contract abstraction to use: 'truffle' for @truffle/contract or 'web3' for web3-eth-contract
        // defaultGas: 6e6, // Maximum gas for contract calls (when unspecified)
        // Options available since v0.1.2
        // defaultGasPrice: 20e9, // Gas price for contract calls (when unspecified)
        // artifactsDir: 'build/contracts', // Directory where contract artifacts are stored
    },

    node: { // Options passed directly to Ganache client
        // gasLimit: 8e6, // Maximum gas per block
        // gasPrice: 20e9, // Sets the default gas price for transactions if not otherwise specified.
        fork: process.env.ARCHIVE_NODE_FORK, // An url to Ethereum node to use as a source for a fork
        unlocked_accounts: ['0x41f2E851431Ae142edE42B6C467515EF5053061d', '0xF0eFA30090FED96C5d8A0B089C8aD56f1388A608', '0x9f6609Ec4601F7974d4adA0c73e6bf1ddC29A0E5', '0x933DE7fadF291926609a2fd0ED79aCe0F8D6dCbf'], // Array of addresses specifying which accounts should be unlocked.
    },
};