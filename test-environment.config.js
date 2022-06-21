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
        fork: process.env.ARCHIVE_NODE_FORK + "@14864286", // An url to Ethereum node to use as a source for a fork
        unlocked_accounts: [
            // Unlocking mainnet accounts with funds
            '0x41f2E851431Ae142edE42B6C467515EF5053061d', 
            '0xF0eFA30090FED96C5d8A0B089C8aD56f1388A608', 
            '0x9f6609Ec4601F7974d4adA0c73e6bf1ddC29A0E5', 
            '0xF977814e90dA44bFA03b6295A0616a897441aceC', 
            "0xD183F2BBF8b28d9fec8367cb06FE72B88778C86B", 
            "0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69" /* has BUSDBNB LP tokens. for maximizer testing*/
        ], // Array of addresses specifying which accounts should be unlocked.
    },
};