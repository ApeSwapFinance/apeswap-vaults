// Contracts
const KeeperMaximizerVaultApe = artifacts.require("KeeperMaximizerVaultApe");
const BananaVault = artifacts.require("BananaVault");
const StrategyMaximizerMasterApe = artifacts.require("StrategyMaximizerMasterApe");

/*
    exec¶
    Execute a JS module within the Truffle environment.


    truffle exec <script.js> [--network <name>] [--compile]
    This will include web3, set the default provider based on the network specified (if any), and include your contracts as global objects while executing the script. Your script must export a function that Truffle can run.

    See the Writing external scripts section for more details.

    Options:

    <script.js>: JavaScript file to be executed. Can include path information if the script does not exist in the current directory. (required)
    --network <name>: Specify the network to use, using artifacts specific to that network. Network name must exist in the configuration.
    --compile: Compile contracts before executing the script.
    https://trufflesuite.com/docs/truffle/reference/truffle-commands/#exec
*/


// Configuration
const keeperMaximizerVaultApeAddress = '0x38f010F1005fC70239d6Bc2173896CA35D624e8d';
const strategies = [
    '0x17884b90f18B8875147D02a8119a6226841d282e',
    '0x6862c220a88e0267D9B0652b7102A2d0c72bF7Eb'
];

/**
 * npx truffle exec ./scripts/verifyMaximizerStrategy.js --network bsc 
 * 
 * @param {*} callback 
 */
module.exports = async function (callback) {
    try {
        // Fetch accounts from wallet - these are unlocked
        const accounts = await web3.eth.getAccounts()

        // Fetch the deployed exchange
        const keeperMaximizerVaultApe = await KeeperMaximizerVaultApe.at(keeperMaximizerVaultApeAddress);
        const maximizerOwner = await keeperMaximizerVaultApe.owner();
        // TODO: Check verification for roles in BANANA_VAULT
        const bananaVaultAddress = await keeperMaximizerVaultApe.BANANA_VAULT();
        const bananaVault = await BananaVault.at(bananaVaultAddress);
        const bananaToken = await bananaVault.bananaToken();

        const strategyOutput = []
        for (let index = 0; index < strategies.length; index++) {
            let passedVerification = true;
            const strategyAddress = strategies[index];
            const strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.at(strategyAddress);

            const strategyDetails = {
                BANANA_VAULT: await strategyMaximizerMasterApe.BANANA_VAULT(),
                BANANA: await strategyMaximizerMasterApe.BANANA(),
                vaultApe: await strategyMaximizerMasterApe.vaultApe(),
                router: await strategyMaximizerMasterApe.router(),
                owner: await strategyMaximizerMasterApe.owner(),
                FARM_PID: (await strategyMaximizerMasterApe.FARM_PID()).toNumber(),
                STAKE_TOKEN: await strategyMaximizerMasterApe.STAKE_TOKEN(),
            }

            // TODO: Verify farm pid and stake token via MasterApe
            if (strategyDetails.BANANA_VAULT != bananaVaultAddress) {
                passedVerification = false;
                console.error(`Strategy ${strategyAddress} BANANA_VAULT does not match maximizer vault.`)
            }

            if (strategyDetails.BANANA != bananaToken) {
                passedVerification = false;
                console.error(`Strategy ${strategyAddress} BANANA does not match BANANA vault.`)
            }

            if (strategyDetails.vaultApe != keeperMaximizerVaultApeAddress) {
                passedVerification = false;
                console.error(`Strategy ${strategyAddress} vaultApe does not match maximizer vault.`)
            }

            if (strategyDetails.owner != maximizerOwner) {
                passedVerification = false;
                console.error(`Strategy ${strategyAddress} owner does not match maximizer vault.`)
            }

            strategyOutput.push({ passedVerification, ...strategyDetails });
        }

        console.dir({
            keeperMaximizerVaultApeAddress,
            maximizerOwner,
            bananaVaultAddress,
            strategyOutput
        })
    }
    catch (error) {
        console.log(error)
    }

    callback()
}