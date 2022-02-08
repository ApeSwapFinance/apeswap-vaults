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
const { getAccountTokenBalances } = require('./helpers/contractHelper');
const { subBNStr, addBNStr } = require('./helpers/bnHelper');
const { advanceNumBlocks } = require('./helpers/openzeppelinExtensions');

// Load compiled artifacts
const KeeperMaximizerVaultApe = contract.fromArtifact('KeeperMaximizerVaultApe');
const StrategyMaximizerMasterApe = contract.fromArtifact("StrategyMaximizerMasterApe");
const BananaVault = contract.fromArtifact("BananaVault");


describe('StrategyMaximizer', function () {
  this.timeout(9960000);

  //0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69
  const depositorAddress = testConfig.testAccount;
  const notDepositorAddress = testConfig.testAccount2;
  const rewardAddress = testConfig.rewardAddress;
  const buyBackAddress = testConfig.buyBackAddress;
  const adminAddress = testConfig.adminAddress;
  let strategyMaximizer, bananaVault, router;
  let usdToken, bananaToken, wantToken;

  const blocksToAdvance = 10;

  beforeEach(async () => {
    // Deploy new vault
    masterApe = contract.fromArtifact('IMasterApe', testConfig.masterApe);
    bananaVault = await BananaVault.new(testConfig.bananaAddress, testConfig.masterApe, adminAddress);
  });

  farms.forEach(farm => {
    const farmInfo = farm;

    let toDeposit = "1000000000000000000";
    let tokensToLPAmount = farm.tokensToLPAmount ? farm.tokensToLPAmount : "1000000000000000000";

    describe(farm.name, function () {

      before(async () => {
        router = contract.fromArtifact("IUniRouter02", farmInfo.router);
        usdToken = contract.fromArtifact('ERC20', testConfig.usdAddress);
        bananaToken = contract.fromArtifact('ERC20', testConfig.bananaAddress);
        wantToken = contract.fromArtifact('ERC20', farmInfo.wantAddress);
        await usdToken.approve(farmInfo.router, MAX_UINT256, { from: depositorAddress });

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
          await tokenContract0.approve(router.address, MAX_UINT256, { from: depositorAddress });
          await tokenContract1.approve(router.address, MAX_UINT256, { from: depositorAddress });

          if (token0 == testConfig.wrappedNative) {
            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
            }
            await router.addLiquidityETH(token1, tokensToLPAmount, 0, 0, depositorAddress, await time.latestBlock() + 600, { from: depositorAddress, value: 1e18 });
            const LPTokens = await pair.balanceOf(depositorAddress);
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            await pair.transfer(notDepositorAddress, (Number(toDeposit)).toString(), { from: depositorAddress });
          } else if (token1 == testConfig.wrappedNative) {
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
            }
            await router.addLiquidityETH(token0, tokensToLPAmount, 0, 0, depositorAddress, await time.latestBlock() + 600, { from: depositorAddress, value: 1e18 });
            const LPTokens = await pair.balanceOf(depositorAddress);
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            await pair.transfer(notDepositorAddress, (Number(toDeposit)).toString(), { from: depositorAddress });
          } else {

            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
            }
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
            }

            await router.addLiquidity(token0, token1, tokensToLPAmount, tokensToLPAmount, 0, 0, depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
            const LPTokens = await pair.balanceOf(depositorAddress);
            console.log(LPTokens.toString());
            toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
            console.log(toDeposit.toString());
          }
        } else {
          //single token
          if (farmInfo.wantAddress != testConfig.usdAddress) {
            const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, farmInfo.wantAddress]);
            await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, farmInfo.wantAddress], depositorAddress, await time.latestBlock() + 600, { from: depositorAddress });
          }
          toDeposit = (Math.floor(Number(tokensToLPAmount) * 0.05)).toString();
        }

        await wantToken.transfer(notDepositorAddress, (Number(toDeposit) * 2).toString(), { from: depositorAddress });
      });

      beforeEach(async () => {
        // Add Strategy
        strategyMaximizer = await StrategyMaximizerMasterApe.new(
          farmInfo.masterchef,
          farmInfo.pid,
          farmInfo.pid == 0,
          farmInfo.wantAddress,
          farmInfo.rewardAddress,
          bananaVault.address,
          testConfig.routerAddress,
          farmInfo.earnedToBananaPath,
          farmInfo.earnedToWnativePath,
          [
            adminAddress, // owner
            "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2", // treasury
            depositorAddress, // keeper
            "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2" // platform
          ],
          [
            0,
            0
          ]);

        // TODO: Setuo 
        // Define roles and grant roles
        this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
        // await bananaVault.grantRole(this.MANAGER_ROLE, maximizerVaultApe.address, { from: adminAddress });
        this.DEPOSIT_ROLE = await bananaVault.DEPOSIT_ROLE();
        await bananaVault.grantRole(this.DEPOSIT_ROLE, strategyMaximizer.address, { from: adminAddress });
      });

      it('should deposit and have shares and withdraw', async () => {
        await wantToken.transfer(strategyMaximizer.address, toDeposit, { from: depositorAddress });
        await strategyMaximizer.deposit(depositorAddress, { from: depositorAddress })
        let userInfo = await strategyMaximizer.userInfo(depositorAddress);
        expect(userInfo.stake.toString()).equal(toDeposit);

        await expectRevert(
          strategyMaximizer.withdraw(depositorAddress, constants.MAX_INT256, { from: notDepositorAddress }),
          'StrategyMaximizerMasterApe: caller is not the VaultApe'
        )

        await strategyMaximizer.withdraw(depositorAddress, constants.MAX_INT256, { from: depositorAddress })
        userInfo = await strategyMaximizer.userInfo(depositorAddress);
        expect(userInfo.stake.toString()).equal('0');
      });


      it('should earn properly', async () => {
        const depositAmount = ether('1').toString();
        // Snapshot0
        const strategySnapshot0 = await getStrategyMaximizerSnapshot(strategyMaximizer, [depositorAddress, notDepositorAddress]);
        const accountSnapshot0 = await getAccountTokenBalances(wantToken, [depositorAddress, notDepositorAddress]);
        await wantToken.transfer(strategyMaximizer.address, depositAmount, { from: depositorAddress });
        await strategyMaximizer.deposit(depositorAddress, { from: depositorAddress });
        // Snapshot1
        const strategySnapshot1 = await getStrategyMaximizerSnapshot(strategyMaximizer, [depositorAddress, notDepositorAddress]);
        const accountSnapshot1 = await getAccountTokenBalances(wantToken, [depositorAddress, notDepositorAddress]);
        expect(subBNStr(accountSnapshot0[depositorAddress], accountSnapshot1[depositorAddress])).to.be.equal(depositAmount, 'account difference invalid')
        expect(subBNStr(strategySnapshot1.contractSnapshot.totalStake, strategySnapshot0.contractSnapshot.totalStake)).to.be.equal(depositAmount, 'total stake difference invalid')
        // console.dir(strategySnapshot1, { depth: null})


        await advanceNumBlocks(100);
        // TODO: test with different values
        await strategyMaximizer.earn(0, 0, 0, 0, { from: depositorAddress });

        // Snapshot2
        const strategySnapshot2 = await getStrategyMaximizerSnapshot(strategyMaximizer, [depositorAddress, notDepositorAddress]);
        const accountSnapshot2 = await getAccountTokenBalances(wantToken, [depositorAddress, notDepositorAddress]);
        // console.dir(strategySnapshot2, { depth: null})
      });

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
      });
    });
  });
});
