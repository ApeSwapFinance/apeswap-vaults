const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const MasterChef_ABI = require('./utils/abis/MasterChef-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { farms } = require('../configs/farms.js');
// Helpers
const { expectRevert, time, ether, BN, constants } = require('@openzeppelin/test-helpers');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');
const { getStrategyMaximizerSnapshot } = require('./helpers/maximizer/strategyMaximizerHelper');
const { getBananaVaultSnapshot } = require('./helpers/maximizer/bananaVaultHelper');
const { getAccountTokenBalances } = require('./helpers/contractHelper');
const { subBNStr, addBNStr } = require('./helpers/bnHelper');
const { advanceNumBlocks } = require('./helpers/openzeppelinExtensions');

// Load compiled artifacts
const KeeperMaximizerVaultApe = contract.fromArtifact('KeeperMaximizerVaultApe');
const StrategyMaximizerMasterApe = contract.fromArtifact("StrategyMaximizerMasterApe");
const BananaVault = contract.fromArtifact("BananaVault");

describe('KeeperMaximizerVaultApe', function () {
  this.timeout(9960000);

  //0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69
  const testerAddress = testConfig.testAccount;
  const testerAddress2 = testConfig.testAccount2;
  const rewardAddress = testConfig.rewardAddress;
  const buyBackAddress = testConfig.buyBackAddress;
  const adminAddress = testConfig.adminAddress;
  let maximizerVaultApe, strategyMaximizerMasterApe, bananaVault, router;
  let usdToken, bananaToken, wantToken;

  const blocksToAdvance = 10;

  beforeEach(async () => {
    // Deploy new vault
    masterApe = contract.fromArtifact('IMasterApe', testConfig.masterApe);
    bananaVault = await BananaVault.new(testConfig.bananaAddress, testConfig.masterApe, adminAddress);
    maximizerVaultApe = await KeeperMaximizerVaultApe.new(adminAddress, adminAddress, bananaVault.address, adminAddress, adminAddress);
  });

  farms.forEach((farm, farmIndex) => {
    const farmInfo = farm;

    let toDeposit = "1000000000000000000";
    let staticDeposit = "1000000000000000000";
    let tokensToLPAmount = farm.tokensToLPAmount ? farm.tokensToLPAmount : "1000000000000000000";

    describe(farm.name, function () {

      before(async () => {
        router = contract.fromArtifact("IUniRouter02", farmInfo.router);
        usdToken = contract.fromArtifact('ERC20', testConfig.usdAddress);
        bananaToken = contract.fromArtifact('ERC20', testConfig.bananaAddress);
        wantToken = contract.fromArtifact('ERC20', farmInfo.wantAddress);
        await usdToken.approve(farmInfo.router, MAX_UINT256, { from: testerAddress });

        let token0 = '0x0000000000000000000000000000000000000000';
        let token1 = '0x0000000000000000000000000000000000000000';
        let pair = null;
        try {
          pair = contract.fromArtifact("IUniPair", farmInfo.wantAddress);
          token0 = await pair.token0();
          token1 = await pair.token1();
        } catch (e) { }


        if (token0 != '0x0000000000000000000000000000000000000000') {
          const tokenContract0 = contract.fromArtifact('ERC20', token0);
          const tokenContract1 = contract.fromArtifact('ERC20', token1);
          await tokenContract0.approve(router.address, MAX_UINT256, { from: testerAddress });
          await tokenContract1.approve(router.address, MAX_UINT256, { from: testerAddress });

          if (token0 == testConfig.wrappedNative) {
            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            await router.addLiquidityETH(token1, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
            const LPTokens = await pair.balanceOf(testerAddress);
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            await pair.transfer(testerAddress2, (Number(toDeposit)).toString(), { from: testerAddress });
          } else if (token1 == testConfig.wrappedNative) {
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            await router.addLiquidityETH(token0, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
            const LPTokens = await pair.balanceOf(testerAddress);
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            await pair.transfer(testerAddress2, (Number(toDeposit)).toString(), { from: testerAddress });
          } else {

            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }

            await router.addLiquidity(token0, token1, tokensToLPAmount, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            const LPTokens = await pair.balanceOf(testerAddress);
            console.log(LPTokens.toString());
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            console.log(toDeposit.toString());
          }
        } else {
          //single token
          if (farmInfo.wantAddress != testConfig.usdAddress) {
            const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, farmInfo.wantAddress]);
            await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, farmInfo.wantAddress], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
          }
          toDeposit = (Math.floor(Number(tokensToLPAmount) * 0.05)).toString();
        }

        await wantToken.transfer(testerAddress2, (Number(toDeposit) * 2).toString(), { from: testerAddress });
      });

      beforeEach(async () => {
        // Add Strategy
        strategyMaximizerMasterApe = await StrategyMaximizerMasterApe.new(
          farmInfo.masterchef,
          farmInfo.pid,
          farmInfo.pid == 0,
          farmInfo.wantAddress,
          farmInfo.rewardAddress,
          bananaVault.address,
          testConfig.routerAddress,
          farmInfo.earnedToBananaPath,
          farmInfo.earnedToWnativePath,
          farmInfo.earnedToLinkPath,
          [
            adminAddress,
            maximizerVaultApe.address
          ]);

        // Define roles and grant roles
        this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
        await bananaVault.grantRole(this.MANAGER_ROLE, maximizerVaultApe.address, { from: adminAddress });

        //Add vault
        await maximizerVaultApe.addVault(strategyMaximizerMasterApe.address, { from: adminAddress });

        // Approve want token
        const erc20Contract = new web3.eth.Contract(IERC20_ABI, farmInfo.wantAddress);
        await erc20Contract.methods.approve(maximizerVaultApe.address, MAX_UINT256).send({ from: testerAddress });
        await erc20Contract.methods.approve(maximizerVaultApe.address, MAX_UINT256).send({ from: testerAddress2 });

      });

      it('should deposit and have shares', async () => {
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })
        const userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
      });

      it('should withdraw and pay withdraw fee', async () => {
        const wantAccountSnapshotBefore = await getAccountTokenBalances(wantToken, [testerAddress, adminAddress]);
        const bananaAccountSnapshotBefore = await getAccountTokenBalances(bananaToken, [testerAddress, adminAddress]);
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress });
        // Snapshot Before
        const strategySnapshotBefore = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);

        let userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit);

        await advanceNumBlocks(blocksToAdvance);
        await maximizerVaultApe.earn(0);
        // // Second deposit
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress });
        // Test values
        userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.eq(new BN(toDeposit).mul(new BN(2)))).equal(true, 'user stake amount inaccurate');
        // NOTE: Only testing for value increases
        expect(Number(userInfo.rewardDebt)).to.be.greaterThan(0, 'reward debt did not increase');

        // Snapshot After
        const strategySnapshotAfter = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);
        // Withdrawing both deposits
        await maximizerVaultApe.withdraw(0, new BN(toDeposit).mul(new BN(2)), { from: testerAddress })
        // NOTE: Only testing for value increases
        expect(
          new BN(strategySnapshotAfter.contractSnapshot.totalAutoBananaShares)
            .gt(new BN(strategySnapshotBefore.contractSnapshot.totalAutoBananaShares)))
          .equal(true, 'auto banana shares did not increase');

        userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(Number(userInfo.stake)).equal(0, 'user stake is not zero after withdraw')
        // That the stake token of that vault increases for the tester by the amount less than the withdraw fee
        const wantAccountSnapshotAfter = await getAccountTokenBalances(wantToken, [testerAddress, adminAddress]);
        const bananaAccountSnapshotAfter = await getAccountTokenBalances(bananaToken, [testerAddress, adminAddress]);
        const withdrawFee = new BN(toDeposit).mul(new BN(2)).mul(new BN("25")).div(new BN("10000")); //0.25% withdraw fees
        const shouldBeBalance = new BN(wantAccountSnapshotBefore[testerAddress]).sub(withdrawFee);

        // Assert stake token balances
        expect(
          new BN(wantAccountSnapshotAfter[adminAddress])
            .eq(withdrawFee))
          .equal(true, 'withdraw fee to treasury address inaccurate');
        expect(wantAccountSnapshotAfter[testerAddress]).equal(shouldBeBalance.toString(), 'user want balance inaccurate after withdraw');
        // Assert BANANA reward token balances
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaAccountSnapshotAfter[testerAddress])
            .gt(new BN(bananaAccountSnapshotBefore[testerAddress])))
          .equal(true, 'banana tokens did not increase for tester address after earn/withdraw');
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaAccountSnapshotAfter[adminAddress])
            .gt(new BN(bananaAccountSnapshotBefore[adminAddress])))
          .equal(true, 'banana tokens did not increase for treasury address after earn/reward withdraw fee');

        const strategySnapshotFinal = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);

        expect(
          new BN(strategySnapshotFinal.accountSnapshots[testerAddress].userInfo.rewardDebt)
            .eq(new BN(0)))
          .equal(true, 'user reward debt was not brought to zero after pulling out all funds');

      });

      it('should put banana rewards in vault', async () => {
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })
        const bananaVaultSnapshotBefore = await getBananaVaultSnapshot(bananaVault, [strategyMaximizerMasterApe.address]);

        await advanceNumBlocks(blocksToAdvance);


        const checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const bananaVaultSnapshotAfter = await getBananaVaultSnapshot(bananaVault, [strategyMaximizerMasterApe.address]);

        expect(
          new BN(bananaVaultSnapshotBefore.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares).lt(
            new BN(bananaVaultSnapshotAfter.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares))
        ).equal(true, 'BANANA vault shares did not increase after upkeep')


        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);
        expect(Number(accSharesPerStakedToken)).to.be.greaterThan(0, 'accSharesPerStakedToken did not increase')

        const share = await masterApe.userInfo(0, bananaVault.address);
        expect(Number(share.amount)).to.be.greaterThan(0, 'shares did not increase')
      });

      it('should get all rewards', async () => {
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })

        const bananaBalanceBefore = await bananaToken.balanceOf(testerAddress);

        await advanceNumBlocks(blocksToAdvance);

        let checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        //second time performUpkeep to check if bananas in pool also compound and generate more rewards
        await advanceNumBlocks(blocksToAdvance);
        checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);

        await maximizerVaultApe.harvestAll(0, { from: testerAddress });

        const bananaBalanceAfter = await bananaToken.balanceOf(testerAddress);

        //Check if banana rewards in pool also generate rewards
        expect(Number(bananaBalanceAfter - bananaBalanceBefore)).to.be.greaterThan(Number(accSharesPerStakedToken * 0.99 * (toDeposit / 1e18))); //0.99 = 1% withdral rewards fee

        expect(Number(bananaBalanceAfter)).to.be.greaterThan(Number(bananaBalanceBefore));

      });

      it('multiple wallets should do everything', async () => {
        const wantBalanceBefore = await wantToken.balanceOf(testerAddress);
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })
        let userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).equal(0)

        await advanceNumBlocks(blocksToAdvance);
        let checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress2 })
        userInfo = await maximizerVaultApe.userInfo(0, testerAddress2);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).to.be.greaterThan(0)

        await advanceNumBlocks(blocksToAdvance);
        checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const bananaBalanceBefore1 = await bananaToken.balanceOf(testerAddress);
        const bananaBalanceBefore2 = await bananaToken.balanceOf(testerAddress2);
        await maximizerVaultApe.withdrawAll(0, { from: testerAddress })
        await maximizerVaultApe.harvestAll(0, { from: testerAddress2 })
        const bananaBalanceAfter1 = await bananaToken.balanceOf(testerAddress);
        const bananaBalanceAfter2 = await bananaToken.balanceOf(testerAddress2);
        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);

        const wantBalanceAfter = await wantToken.balanceOf(testerAddress);
        const withdrawFee = new BN(toDeposit).mul(new BN("25")).div(new BN("10000")); //0.25% withdraw fees
        const shouldBeBalance = wantBalanceBefore.sub(withdrawFee);
        expect(wantBalanceAfter.toString()).equal(shouldBeBalance.toString());

        expect(Number(bananaBalanceAfter1 - bananaBalanceBefore1)).to.be.greaterThan(Number(accSharesPerStakedToken * 0.99 * (toDeposit / 1e18))); //0.99 = 1% withdral rewards fee
        expect(Number(bananaBalanceAfter1)).to.be.greaterThan(Number(bananaBalanceBefore1));
        expect(Number(bananaBalanceAfter2)).to.be.greaterThan(Number(bananaBalanceBefore2));

        expect(Number(bananaBalanceAfter1 - bananaBalanceBefore1)).to.be.greaterThan(Number(bananaBalanceAfter2 - bananaBalanceBefore2));
      });

      it('should harvest properly', async () => {
        const bananaAccountSnapshotBefore = await getAccountTokenBalances(bananaToken, [testerAddress, adminAddress]);
        // Deposit tokens
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress });
        // Snapshot Before
        const strategySnapshotBefore = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);
        const bananaVaultSnapshotBefore = await getBananaVaultSnapshot(bananaVault, [strategyMaximizerMasterApe.address]);
        const userInfo = await maximizerVaultApe.userInfo(0, testerAddress);

        expect(strategySnapshotBefore.accountSnapshots[testerAddress].userInfo.autoBananaShares.toString())
          .equal('0', 'user autoBananaShares not at 0 before deposit');

        expect(userInfo.stake.toString()).equal(toDeposit, 'user stake is not accurate');

        await advanceNumBlocks(blocksToAdvance);
        await maximizerVaultApe.earn(0);
        const bananaVaultSnapshotInBetween = await getBananaVaultSnapshot(bananaVault, [strategyMaximizerMasterApe.address]);
        const strategySnapshotInBetween = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);
        // NOTE: Only testing for value increases
        // balanceOf evaluates the current banana value, while userInfo stores the most recent state update (will be behind)
        expect(
          new BN(strategySnapshotInBetween.accountSnapshots[testerAddress].balanceOf.banana).gt(
            new BN(strategySnapshotBefore.accountSnapshots[testerAddress].balanceOf.banana))
        ).equal(true, 'auto banana shares did not increase after earn');
        // NOTE: Only testing for value increases
        expect(
          new BN(strategySnapshotInBetween.contractSnapshot.accSharesPerStakedToken).gt(
            new BN(strategySnapshotBefore.contractSnapshot.accSharesPerStakedToken))
        ).equal(true, 'accSharesPerStakedToken did not increase after earn');
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaVaultSnapshotInBetween.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares).gt(
            new BN(bananaVaultSnapshotBefore.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares))
        ).equal(true, 'banana vault shares did not increase after earn');

        // Harvest all harvestable tokens from pid
        await maximizerVaultApe.harvestAll(0, { from: testerAddress });

        const strategySnapshotAfter = await getStrategyMaximizerSnapshot(strategyMaximizerMasterApe, [testerAddress, testerAddress2]);
        const bananaVaultSnapshotAfter = await getBananaVaultSnapshot(bananaVault, [strategyMaximizerMasterApe.address]);
        const bananaAccountSnapshotAfter = await getAccountTokenBalances(bananaToken, [testerAddress, adminAddress]);

        // NOTE: Only testing for value decreases
        expect(
          new BN(bananaVaultSnapshotAfter.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares).lt(
            new BN(bananaVaultSnapshotInBetween.accountSnapshots[strategyMaximizerMasterApe.address].userInfo.shares))
        ).equal(true, 'banana vault shares did not decrease after harvest');
        // NOTE: Only testing for value increases
        expect(
          new BN(strategySnapshotAfter.accountSnapshots[testerAddress].userInfo.rewardDebt).gt(
            new BN(strategySnapshotInBetween.accountSnapshots[testerAddress].userInfo.rewardDebt))
        ).equal(true, 'userDebt was not increased after harvest');
        expect(strategySnapshotAfter.accountSnapshots[testerAddress].balanceOf.autoBananaShares.toString())
          .equal('0', 'user autoBananaShares not at 0 after harvest');
        // Assert BANANA reward token balances
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaAccountSnapshotAfter[testerAddress])
            .gt(new BN(bananaAccountSnapshotBefore[testerAddress])))
          .equal(true, 'banana tokens did not increase for tester address after earn/withdraw');
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaAccountSnapshotAfter[adminAddress])
            .gt(new BN(bananaAccountSnapshotBefore[adminAddress])))
          .equal(true, 'banana tokens did not increase for treasury address after earn/reward withdraw fee');
        // NOTE: Only testing for value increases
        expect(
          new BN(bananaAccountSnapshotAfter[adminAddress])
            .gt(new BN(bananaAccountSnapshotBefore[adminAddress])))
          .equal(true, 'banana tokens did not increase for treasury address after earn/reward withdraw fee');
      });

      // One pass tests
      if (farmIndex == 0) {
        // TODO: Test enable/disable vaults
        // TODO: Test add vaults
        
        it('should update values via onlyOwner properly', async () => {
          const notOwner = testerAddress;
          const updateAddress = accounts[0];
          const updateValue = '12345';

          expectRevert(
            maximizerVaultApe.setDefaultTreasury(updateAddress, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultTreasury(updateAddress, { from: adminAddress });
          expect(await maximizerVaultApe.defaultTreasury()).equal(updateAddress, 'default treasury update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultKeeperFee(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultKeeperFee(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaultKeeperFee()).toString()).equal(updateValue, 'default keeper fee update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultPlatform(updateAddress, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultPlatform(updateAddress, { from: adminAddress });
          expect(await maximizerVaultApe.defaultPlatform()).equal(updateAddress, 'default platform update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultPlatformFee(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultPlatformFee(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaultPlatformFee()).toString()).equal(updateValue, 'default platform fee update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultBuyBackRate(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultBuyBackRate(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaultBuyBackRate()).toString()).equal(updateValue, 'default buy back rate update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultWithdrawFee(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultWithdrawFee(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaultWithdrawFee()).toString()).equal(updateValue, 'default buy withdraw fee update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaultWithdrawFeePeriod(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaultWithdrawFeePeriod(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaultWithdrawFeePeriod()).toString()).equal(updateValue, 'default buy withdraw fee period update not accurate')

          expectRevert(
            maximizerVaultApe.setDefaulWithdrawRewardsFee(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setDefaulWithdrawRewardsFee(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.defaulWithdrawRewardsFee()).toString()).equal(updateValue, 'default buy withdraw rewards fee update not accurate');

          expectRevert(
            maximizerVaultApe.setModerator(updateAddress, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setModerator(updateAddress, { from: adminAddress });
          expect(await maximizerVaultApe.moderator()).equal(updateAddress, 'moderator update not accurate');

          expectRevert(
            maximizerVaultApe.setMaxDelay(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setMaxDelay(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.maxDelay()).toString()).equal(updateValue, 'max delay update not accurate');

          expectRevert(
            maximizerVaultApe.setMinKeeperFee(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setMinKeeperFee(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.minKeeperFee()).toString()).equal(updateValue, 'min keeper fee update not accurate');

          expectRevert(
            maximizerVaultApe.setSlippageFactor(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setSlippageFactor(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.slippageFactor()).toString()).equal(updateValue, 'slippage factor update not accurate');

          expectRevert(
            maximizerVaultApe.setMaxVaults(updateValue, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.setMaxVaults(updateValue, { from: adminAddress });
          expect((await maximizerVaultApe.maxVaults()).toString()).equal(updateValue, 'max vaults update not accurate');

          expectRevert(
            maximizerVaultApe.disableVault(strategyMaximizerMasterApe.address, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.disableVault(strategyMaximizerMasterApe.address, { from: adminAddress });
          expect((await maximizerVaultApe.vaultInfos(strategyMaximizerMasterApe.address)).enabled).equal(false, 'vault disable did not work');

          expectRevert(
            maximizerVaultApe.enableVault(strategyMaximizerMasterApe.address, { from: notOwner }),
            "Ownable: caller is not the owner"
          )
          await maximizerVaultApe.enableVault(strategyMaximizerMasterApe.address, { from: adminAddress });
          expect((await maximizerVaultApe.vaultInfos(strategyMaximizerMasterApe.address)).enabled).equal(true, 'vault enable did not work');
        });
      }
    });
  });
});
