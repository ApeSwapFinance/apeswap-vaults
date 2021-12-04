const { expectRevert, time, ether } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { MasterChefVaults } = require('../configs/vaults');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const { testConfig } = require('./utils/config.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');

// Load compiled artifacts
const VaultApe = contract.fromArtifact('VaultApe');
const StrategyMasterChef = contract.fromArtifact('StrategyMasterChef');

describe('MasterChefStrategy', function () {
  const testerAddress = testConfig.testAccount;

  beforeEach(async () => {
    // Deploy new vault
    this.vaultApe = await VaultApe.new();

    // Add BANANA/BNB Strategy
    const vault = MasterChefVaults.bsc[0];
    this.strategy = await StrategyMasterChef.new()
    await this.strategy.initialize(
      [this.vaultApe.address, vault.configAddresses[0], testConfig.routerAddress, vault.configAddresses[1], vault.configAddresses[2], testConfig.usdAddress, testConfig.bananaAddress], 
      vault.pid, 
      vault.earnedToWnativePath, 
      vault.earnedToUsdPath, 
      vault.earnedToBananaPath, 
      vault.earnedToToken0Path, 
      vault.earnedToToken1Path, 
      vault.token0ToEarnedPath, 
      vault.token1ToEarnedPath);
    await this.vaultApe.addPool(this.strategy.address);


    // Approve BANANA/BNB
    const contract = new web3.eth.Contract(IERC20_ABI, vault.configAddresses[1]);
    await contract.methods.approve(this.vaultApe.address, MAX_UINT256).send({ from: testerAddress });
  });

  it('should deposit and have shares supply', async () => {
    const toDeposit = 10
    await this.vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress })
    const userInfo = await this.vaultApe.userInfo(0, testerAddress);
    const stakedWantTokens = await this.vaultApe.stakedWantTokens(0, testerAddress);
    expect(stakedWantTokens.toNumber()).equal(toDeposit)
    expect(userInfo.toNumber()).equal(toDeposit)
  });

  it('should increase stakedWantTokens after compound', async () => {
    const toDeposit = '6936116396509672'
    
    await this.vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
    const userInfo = await this.vaultApe.userInfo(0, testerAddress);
    const stakedWantTokens = await this.vaultApe.stakedWantTokens(0, testerAddress);
    expect(stakedWantTokens.toString()).equal(toDeposit);
    expect(userInfo.toString()).equal(toDeposit);

    await time.advanceBlock();
    await time.advanceBlock();

    await this.vaultApe.earnAll();
    const newUserInfo = await this.vaultApe.userInfo(0, testerAddress);
    const newStakedWantTokens = await this.vaultApe.stakedWantTokens(0, testerAddress);
    expect(userInfo.toString()).equal(newUserInfo.toString());
    expect(newStakedWantTokens.toNumber()).to.be.above(stakedWantTokens.toNumber());
  });

  it('should be able to withdraw', async () => {
    const toDeposit = '6936116396509672'

    await this.vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
    await this.vaultApe.withdraw(0, toDeposit, testerAddress, { from: testerAddress });
    const userInfo = await this.vaultApe.userInfo(0, testerAddress);
    const stakedWantTokens = await this.vaultApe.stakedWantTokens(0, testerAddress);
    expect(userInfo.toNumber()).equal(0);
    expect(stakedWantTokens.toNumber()).to.equal(0);
  });

});
