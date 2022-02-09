# Truffle Typescript Boilerplate
Build Solidity smart contracts with truffle, openzeppelin and typescript support.

## Install 
Click "Use as Template" to create a repo on GitHub based on this repo. Otherwise:  
`git clone git@github.com:DeFiFoFum/truffle-typescript-template.git`   
  
`yarn install`

## Setup
Create a `.env` file based off of `.env.example` to deploy contracts to bsc mainnet/testnet and to verify deployed contracts.  

</br>

## Development
Start a local development blockchain by running the following command:  
`yarn ganache`  
  
Deploy contracts to the development blockchain:  
`yarn migrate:development` 

## Compile
`yarn compile`

</br>

## Deploy 

### Mainnet
`yarn migrate:bsc [--reset]` // Use `--reset` to redeploy already deployed contracts   
`yarn verify:bsc`  

### Testnet
`yarn migrate:testnet [--reset]`  
`yarn verify:testnet`  
  
_* new contracts that are created must be added to the verification script in package.json by adding `&&` to the end with the new contract verification._


## Lint
Lint with `solhint`  
`yarn lint` / `yarn lint:fix`    

</br>

## Test
Tests are architected with `@openzeppelin` test environment. This allows tests to be run independently of an external development blockchain.   

Test the project with `yarn test`   

Tests are using  
`@openzeppelin/test-helpers`  
`@openzeppelin/test-environment` 

</br>

### Solidity Coverage
[solidity-coverage](https://www.npmjs.com/package/solidity-coverage) is used in this repo to provide an output of the test coverage after running tests.

### Automated Tests
The OpenZeppelin test environment coupled with Github actions facilitates automated contract tests on pushes to GitHub! 

</br>

## Generate Types from Contracts
Use `typechain` to generate contract interfaces for UI integration.  
`yarn gen:types`  

## Contract Size 
Use the `truffle-contract-size` module to find the size of each contract in the `contracts/` directory with:  
`yarn size`  

## Deployed Contracts:

VaultApe:                   https://bscscan.com/address/0xa4c084d141A4E54F3C79707d58229e9e64bdF0aC#writeContract
StrategyMasterChefSingle:   https://bscscan.com/address/0x27619a7919bf31c15fca24dd10ccdb3f290b3581#code
StrategyMasterApeSingle:    https://bscscan.com/address/0x51b13b0068d27fd49284b3ceac7c55d372602ad9#readContract
StrategyMasterChef:         https://bscscan.com/address/0x5199e3ac3a64e8413f1fa3485b58a4741f23eb99#code


## Maximizer Vaults
The [Maximizer contracts](./contracts/maximizer/) are vaults which each reward tokens from external farms and auto compound BANANA rewards into the BANANA pool. These vaults were built to help alleviate the continuous sell pressure that vaults typically put on BANANA.
