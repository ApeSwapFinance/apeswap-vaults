const { expectRevert, time, ether } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');

// Load compiled artifacts
const VaultApe = contract.fromArtifact('VaultApe');

describe('VaultApe', function () {
  this.timeout(60000);

  const testerAddress = testConfig.testAccount;
  let vaultApe;
  beforeEach(async () => {
    // Deploy new vault
    vaultApe = await VaultApe.new();
  });

  for (const strategy of testStrategies) {

    describe(`Testing ${strategy.contractName}`, () => {
      const toDeposit = '10000000000000000'
      beforeEach(async () => {
        // Add Strategy
        const strategyContract = contract.fromArtifact(strategy.contractName);
        this.strategy = await strategyContract.new()
        await this.strategy.initialize(...strategy.initParams(vaultApe.address));
        await vaultApe.addPool(this.strategy.address);

        // Approve want token
        const erc20Contract = new web3.eth.Contract(IERC20_ABI, strategy.wantToken);
        await erc20Contract.methods.approve(vaultApe.address, MAX_UINT256).send({ from: testerAddress });
      });

      it('should deposit and have shares supply', async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress })
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit)
        expect(userInfo.toString()).equal(toDeposit)
      });

      it('should increase stakedWantTokens after compound', async () => {

        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit);
        expect(userInfo.toString()).equal(toDeposit);

        await time.advanceBlock();
        await time.advanceBlock();

        await vaultApe.earnAll();
        const newUserInfo = await vaultApe.userInfo(0, testerAddress);
        const newStakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(userInfo.toString()).equal(newUserInfo.toString());
        expect(newStakedWantTokens.gt(stakedWantTokens)).to.be.true;
      });

      it('should be able to withdraw', async () => {
        const toDeposit = '6936116396509672'

        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
        await vaultApe.withdraw(0, toDeposit, testerAddress, { from: testerAddress });
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(userInfo.toNumber()).equal(0);
        expect(stakedWantTokens.toNumber()).to.equal(0);
      });

    });
  }

});
