const { expectRevert, time, ether, BN } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const MasterChef_ABI = require('./utils/abis/MasterChef-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { farms } = require('../configs/farms.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');

// Load compiled artifacts
const VaultApeMaximizerKeeper = contract.fromArtifact('VaultApeMaximizerKeeper');
const StrategyMaximizer = contract.fromArtifact("StrategyMaximizer");
const BananaVault = contract.fromArtifact("BananaVault");

describe('VaultApeMaximizerKeeper', function () {
  this.timeout(9960000);

  //0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69
  const testerAddress = testConfig.testAccount;
  const testerAddress2 = testConfig.testAccount2;
  const rewardAddress = testConfig.rewardAddress;
  const buyBackAddress = testConfig.buyBackAddress;
  const adminAddress = testConfig.adminAddress;
  let vaultApeMaximizerKeeper, bananaVault, router;
  let usdToken, bananaToken, wantToken;

  const blocksToAdvance = 10;

  beforeEach(async () => {
    // Deploy new vault
    masterApe = contract.fromArtifact('IMasterApe', testConfig.masterApe);
    bananaVault = await BananaVault.new(testConfig.bananaAddress, testConfig.masterApe, rewardAddress, 0);
    vaultApeMaximizerKeeper = await VaultApeMaximizerKeeper.new(adminAddress, adminAddress, bananaVault.address);
    await bananaVault.transferOwnership(vaultApeMaximizerKeeper.address);
  });

  // const farms = [
  //   { pid: 1, name: 'ApeSwap BNB-BANANA vault', masterchef: testConfig.masterApe, address: '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713', router: testConfig.farmInfo.router, tokensToLPAmount: "100000000000000000000" },
  //   { pid: 3, name: 'ApeSwap BNB-BUSD vault', masterchef: testConfig.masterApe, address: '0x51e6D27FA57373d8d4C256231241053a70Cb1d93', router: testConfig.farmInfo.router, tokensToLPAmount: "100000000000000000000" },
  //   { pid: 8, name: 'ApeSwap USDC-BUSD vault', masterchef: testConfig.masterApe, address: '0xC087C78AbaC4A0E900a327444193dBF9BA69058E', router: testConfig.farmInfo.router, tokensToLPAmount: "100000000000000000000" },
  //   { pid: 17, name: 'Pacoca BNB-BANANA vault', masterchef: "0x55410D946DFab292196462ca9BE9f3E4E4F337Dd", address: '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713', router: testConfig.farmInfo.router, tokensToLPAmount: "100000000000000000000" },
  //   { pid: 0, name: 'PCS CAKE-BNB vault', masterchef: "0x73feaa1eE314F8c655E354234017bE2193C9E24E", address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", tokensToLPAmount: "100000000000000000000" }
  // ]

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
        this.strategy = await StrategyMaximizer.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2", vaultApeMaximizerKeeper.address, "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2"], [0, 0]);
        await vaultApeMaximizerKeeper.addVault(this.strategy.address, { from: adminAddress });

        // await this.strategy.setWithdrawFee(100, { from: adminAddress });

        // Approve want token
        const erc20Contract = new web3.eth.Contract(IERC20_ABI, farmInfo.wantAddress);
        await erc20Contract.methods.approve(vaultApeMaximizerKeeper.address, MAX_UINT256).send({ from: testerAddress });
        await erc20Contract.methods.approve(vaultApeMaximizerKeeper.address, MAX_UINT256).send({ from: testerAddress2 });

      });

      it('should deposit and have shares', async () => {
        wantToken = contract.fromArtifact('ERC20', farmInfo.wantAddress);
        const balance = await wantToken.balanceOf(testerAddress);
        const approved = await wantToken.allowance(testerAddress, vaultApeMaximizerKeeper.address);
        console.log(toDeposit, balance.toString(), approved.toString());
        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })
        const userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
      });

      it('should withdraw', async () => {
        const wantBalanceBefore = await wantToken.balanceOf(testerAddress);
        console.log(toDeposit);

        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })

        let userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)

        await vaultApeMaximizerKeeper.withdraw(0, toDeposit, { from: testerAddress })

        userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
        expect(Number(userInfo.stake)).equal(0)

        const wantBalanceAfter = await wantToken.balanceOf(testerAddress);
        // const withdrawFee1 = Number(toDeposit) * 0;
        // const withdrawFee = withdrawFee1 + (Number(toDeposit) - withdrawFee1) * 0.0025;
        const withdrawFee = new BN(toDeposit).mul(new BN("25")).div(new BN("10000")); //0.25% withdraw fees
        const shouldBeBalance = wantBalanceBefore.sub(withdrawFee);
        expect(wantBalanceAfter.toString()).equal(shouldBeBalance.toString());
      });

      it('should put banana rewards in vault', async () => {
        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const checkUpkeep = await vaultApeMaximizerKeeper.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await vaultApeMaximizerKeeper.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const accSharesPerStakedToken = await vaultApeMaximizerKeeper.accSharesPerStakedToken(0);
        console.log(accSharesPerStakedToken.toString());
        expect(Number(accSharesPerStakedToken)).to.be.greaterThan(0)

        const share = await masterApe.userInfo(0, bananaVault.address);
        console.log(share.amount.toString())
        expect(Number(share.amount)).to.be.greaterThan(0)
      });

      it('should get all rewards', async () => {
        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })

        const bananaBalanceBefore = await bananaToken.balanceOf(testerAddress);

        let currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        let checkUpkeep = await vaultApeMaximizerKeeper.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await vaultApeMaximizerKeeper.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        //second time performUpkeep to check if bananas in pool also compound and generate more rewards
        currentBlock = await time.latestBlock();
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        checkUpkeep = await vaultApeMaximizerKeeper.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await vaultApeMaximizerKeeper.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
        const accSharesPerStakedToken = await vaultApeMaximizerKeeper.accSharesPerStakedToken(0);
        console.log(accSharesPerStakedToken.toString());
        console.log(userInfo.stake.toString(), userInfo.autoBananaShares.toString());

        await vaultApeMaximizerKeeper.harvestAll(0, { from: testerAddress });

        const bananaBalanceAfter = await bananaToken.balanceOf(testerAddress);
        console.log(bananaBalanceBefore.toString(), bananaBalanceAfter.toString());

        //Check if banana rewards in pool also generate rewards
        expect(Number(bananaBalanceAfter) - Number(bananaBalanceBefore)).to.be.greaterThan(Number(accSharesPerStakedToken * (toDeposit / 1e18)));
        expect(Number(bananaBalanceAfter)).to.be.greaterThan(Number(bananaBalanceBefore));

      });

      it('multiple wallets should do everything', async () => {
        const wantBalanceBefore = await wantToken.balanceOf(testerAddress);
        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })
        let userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).equal(0)

        let currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        let checkUpkeep = await vaultApeMaximizerKeeper.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await vaultApeMaximizerKeeper.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress2 })
        userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress2);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).to.be.greaterThan(0)

        currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        checkUpkeep = await vaultApeMaximizerKeeper.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await vaultApeMaximizerKeeper.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const bananaBalanceBefore1 = await bananaToken.balanceOf(testerAddress);
        const bananaBalanceBefore2 = await bananaToken.balanceOf(testerAddress2);
        await vaultApeMaximizerKeeper.withdrawAll(0, { from: testerAddress })
        await vaultApeMaximizerKeeper.harvestAll(0, { from: testerAddress2 })
        const bananaBalanceAfter1 = await bananaToken.balanceOf(testerAddress);
        const bananaBalanceAfter2 = await bananaToken.balanceOf(testerAddress2);
        const accSharesPerStakedToken = await vaultApeMaximizerKeeper.accSharesPerStakedToken(0);

        const wantBalanceAfter = await wantToken.balanceOf(testerAddress);
        const withdrawFee = new BN(toDeposit).mul(new BN("25")).div(new BN("10000")); //0.25% withdraw fees
        const shouldBeBalance = wantBalanceBefore.sub(withdrawFee);
        expect(wantBalanceAfter.toString()).equal(shouldBeBalance.toString());

        expect(Number(bananaBalanceAfter1 - bananaBalanceBefore1)).to.be.greaterThan(Number(accSharesPerStakedToken * (toDeposit / 1e18)));
        expect(Number(bananaBalanceAfter1)).to.be.greaterThan(Number(bananaBalanceBefore1));
        expect(Number(bananaBalanceAfter2)).to.be.greaterThan(Number(bananaBalanceBefore2));

        expect(Number(bananaBalanceAfter1 - bananaBalanceBefore1)).to.be.greaterThan(Number(bananaBalanceAfter2 - bananaBalanceBefore2));
      });
    });
  });
});