const { expectRevert, time, ether, BN } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const MasterChef_ABI = require('./utils/abis/MasterChef-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { farms } = require('../configs/farms.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');
const { createLessThan, createEmitAndSemanticDiagnosticsBuilderProgram } = require('typescript');

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
  const treasuryAddress = testConfig.treasuryAddress;
  const platformAddress = testConfig.platformAddress;
  let maximizerVaultApe, bananaVault, router;
  let usdToken, bananaToken, wantToken;

  const blocksToAdvance = 10;

  beforeEach(async () => {
    // Deploy new vault
    masterApe = contract.fromArtifact('IMasterApe', testConfig.masterApe);
    bananaVault = await BananaVault.new(testConfig.bananaAddress, testConfig.masterApe, adminAddress);
    maximizerVaultApe = await KeeperMaximizerVaultApe.new(adminAddress, adminAddress, bananaVault.address, [treasuryAddress, 50, platformAddress, 0, 0, 25, 259200, 100]);
  });

  it('Should be able to change settings maximizerVaultApe', async () => {
    const farmInfo = farms[0];
    const strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);

    await maximizerVaultApe.setTreasury(rewardAddress, { from: adminAddress });
    await maximizerVaultApe.setKeeperFee(1, { from: adminAddress });
    await maximizerVaultApe.setPlatform(buyBackAddress, { from: adminAddress });
    await maximizerVaultApe.setPlatformFee(2, { from: adminAddress });
    await maximizerVaultApe.setBuyBackRate(3, { from: adminAddress });
    await maximizerVaultApe.setWithdrawFee(4, { from: adminAddress });
    await maximizerVaultApe.setWithdrawFeePeriod(5, { from: adminAddress });
    await maximizerVaultApe.setWithdrawRewardsFee(6, { from: adminAddress });

    let vaultApeSettings = await maximizerVaultApe.getSettings();
    const treasury = vaultApeSettings.treasury;
    const keeperFee = vaultApeSettings.keeperFee;
    const platform = vaultApeSettings.platform;
    const platformFee = vaultApeSettings.platformFee;
    const buyBackRate = vaultApeSettings.buyBackRate;
    const withdrawFee = vaultApeSettings.withdrawFee;
    const withdrawFeePeriod = vaultApeSettings.withdrawFeePeriod;
    const withdrawRewardsFee = vaultApeSettings.withdrawRewardsFee;

    expect(treasury.toString()).equal(rewardAddress);
    expect(keeperFee.toString()).equal("1");
    expect(platform.toString()).equal(buyBackAddress);
    expect(platformFee.toString()).equal("2");
    expect(buyBackRate.toString()).equal("3");
    expect(withdrawFee.toString()).equal("4");
    expect(withdrawFeePeriod.toString()).equal("5");
    expect(withdrawRewardsFee.toString()).equal("6");
  });

  it('Should be able to change settings StrategyMaximizerMasterApe', async () => {
    const farmInfo = farms[0];
    const strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);

    await strategy.setTreasury(rewardAddress, false, { from: adminAddress });
    await strategy.setKeeperFee(1, false, { from: adminAddress });
    await strategy.setPlatform(buyBackAddress, false, { from: adminAddress });
    await strategy.setPlatformFee(2, false, { from: adminAddress });
    await strategy.setBuyBackRate(3, false, { from: adminAddress });
    await strategy.setWithdrawFee(4, false, { from: adminAddress });
    await strategy.setWithdrawFeePeriod(5, false, { from: adminAddress });
    await strategy.setWithdrawRewardsFee(6, false, { from: adminAddress });

    let vaultApeSettings = await strategy.getSettings();
    const treasury = vaultApeSettings.treasury;
    const keeperFee = vaultApeSettings.keeperFee;
    const platform = vaultApeSettings.platform;
    const platformFee = vaultApeSettings.platformFee;
    const buyBackRate = vaultApeSettings.buyBackRate;
    const withdrawFee = vaultApeSettings.withdrawFee;
    const withdrawFeePeriod = vaultApeSettings.withdrawFeePeriod;
    const withdrawRewardsFee = vaultApeSettings.withdrawRewardsFee;

    expect(treasury.toString()).equal(rewardAddress);
    expect(keeperFee.toString()).equal("1");
    expect(platform.toString()).equal(buyBackAddress);
    expect(platformFee.toString()).equal("2");
    expect(buyBackRate.toString()).equal("3");
    expect(withdrawFee.toString()).equal("4");
    expect(withdrawFeePeriod.toString()).equal("5");
    expect(withdrawRewardsFee.toString()).equal("6");

    let path = [farmInfo.rewardAddress, testConfig.wrappedNative, testConfig.bananaAddress];
    await strategy.setPathToBanana(path, { from: adminAddress });
    let path0 = await strategy.pathToBanana(0);
    let path1 = await strategy.pathToBanana(1);
    let path2 = await strategy.pathToBanana(2);
    expect([path0, path1, path2].toString()).equals(path.toString());

    path = [farmInfo.rewardAddress, testConfig.bananaAddress, testConfig.wrappedNative];
    await strategy.setPathToWbnb(path, { from: adminAddress });
    path0 = await strategy.pathToWbnb(0);
    path1 = await strategy.pathToWbnb(1);
    path2 = await strategy.pathToWbnb(2);
    expect([path0, path1, path2].toString()).equals(path.toString());
  });

  it('Should keep default settings in StrategyMaximizerMasterApe', async () => {
    const farmInfo = farms[0];
    const strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);

    await maximizerVaultApe.setTreasury(rewardAddress, { from: adminAddress });
    await maximizerVaultApe.setKeeperFee(1, { from: adminAddress });
    await maximizerVaultApe.setPlatform(rewardAddress, { from: adminAddress });
    await maximizerVaultApe.setPlatformFee(1, { from: adminAddress });
    await maximizerVaultApe.setBuyBackRate(1, { from: adminAddress });
    await maximizerVaultApe.setWithdrawFee(1, { from: adminAddress });
    await maximizerVaultApe.setWithdrawFeePeriod(1, { from: adminAddress });
    await maximizerVaultApe.setWithdrawRewardsFee(1, { from: adminAddress });
    await strategy.setTreasury(buyBackAddress, true, { from: adminAddress });
    await strategy.setKeeperFee(2, true, { from: adminAddress });
    await strategy.setPlatform(buyBackAddress, true, { from: adminAddress });
    await strategy.setPlatformFee(2, true, { from: adminAddress });
    await strategy.setBuyBackRate(2, true, { from: adminAddress });
    await strategy.setWithdrawFee(2, true, { from: adminAddress });
    await strategy.setWithdrawFeePeriod(2, true, { from: adminAddress });
    await strategy.setWithdrawRewardsFee(2, true, { from: adminAddress });

    let vaultApeSettings = await strategy.getSettings();
    const treasury = vaultApeSettings.treasury;
    const keeperFee = vaultApeSettings.keeperFee;
    const platform = vaultApeSettings.platform;
    const platformFee = vaultApeSettings.platformFee;
    const buyBackRate = vaultApeSettings.buyBackRate;
    const withdrawFee = vaultApeSettings.withdrawFee;
    const withdrawFeePeriod = vaultApeSettings.withdrawFeePeriod;
    const withdrawRewardsFee = vaultApeSettings.withdrawRewardsFee;

    expect(treasury.toString()).equal(rewardAddress);
    expect(keeperFee.toString()).equal("1");
    expect(platform.toString()).equal(rewardAddress);
    expect(platformFee.toString()).equal("1");
    expect(buyBackRate.toString()).equal("1");
    expect(withdrawFee.toString()).equal("1");
    expect(withdrawFeePeriod.toString()).equal("1");
    expect(withdrawRewardsFee.toString()).equal("1");
  });

  it('Should add multiple vaults', async () => {
    this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
    await bananaVault.grantRole(this.MANAGER_ROLE, maximizerVaultApe.address, { from: adminAddress });

    const farmInfo = farms[0];
    let strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);
    await maximizerVaultApe.addVault(strategy.address, { from: adminAddress });

    let vaultLength = await maximizerVaultApe.vaultsLength();
    let vaultAddress = await maximizerVaultApe.vaults(0);
    expect(vaultLength.toString()).equal("1");
    expect(vaultAddress.toString()).equal(strategy.address);

    strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);
    await maximizerVaultApe.addVault(strategy.address, { from: adminAddress });

    vaultLength = await maximizerVaultApe.vaultsLength();
    vaultAddress = await maximizerVaultApe.vaults(1);
    expect(vaultLength.toString()).equal("2");
    expect(vaultAddress.toString()).equal(strategy.address);
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
        this.strategy = await StrategyMaximizerMasterApe.new(farmInfo.masterchef, farmInfo.pid, farmInfo.pid == 0, farmInfo.wantAddress, farmInfo.rewardAddress, bananaVault.address, testConfig.routerAddress, farmInfo.earnedToBananaPath, farmInfo.earnedToWnativePath, [adminAddress, maximizerVaultApe.address]);

        // Define roles and grant roles
        this.MANAGER_ROLE = await bananaVault.MANAGER_ROLE();
        await bananaVault.grantRole(this.MANAGER_ROLE, maximizerVaultApe.address, { from: adminAddress });

        //Add vault
        await maximizerVaultApe.addVault(this.strategy.address, { from: adminAddress });

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

      it('should withdraw', async () => {
        const wantBalanceBefore = await wantToken.balanceOf(testerAddress);

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })

        let userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)

        await maximizerVaultApe.withdraw(0, toDeposit, { from: testerAddress })

        userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(Number(userInfo.stake)).equal(0)

        const wantBalanceAfter = await wantToken.balanceOf(testerAddress);
        // const withdrawFee1 = Number(toDeposit) * 0;
        // const withdrawFee = withdrawFee1 + (Number(toDeposit) - withdrawFee1) * 0.0025;
        const withdrawFee = new BN(toDeposit).mul(new BN("25")).div(new BN("10000")); //0.25% withdraw fees
        const shouldBeBalance = wantBalanceBefore.sub(withdrawFee);
        expect(wantBalanceAfter.toString()).equal(shouldBeBalance.toString());
      });

      it('should put banana rewards in vault', async () => {
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        await maximizerVaultApe.earnAll({ from: adminAddress });

        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);
        expect(Number(accSharesPerStakedToken)).to.be.greaterThan(0)

        const share = await masterApe.userInfo(0, bananaVault.address);
        expect(Number(share.amount)).to.be.greaterThan(0)
      });

      it('should get all rewards', async () => {
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })

        const bananaBalanceBefore = await bananaToken.balanceOf(testerAddress);

        let currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        let checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        //second time performUpkeep to check if bananas in pool also compound and generate more rewards
        const getPricePerFullShare1 = await bananaVault.getPricePerFullShare();

        currentBlock = await time.latestBlock();
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const getPricePerFullShare2 = await bananaVault.getPricePerFullShare();
        expect(Number(getPricePerFullShare2)).to.be.greaterThan(Number(getPricePerFullShare1));

        const userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);

        await maximizerVaultApe.harvestAll(0, { from: testerAddress });

        const bananaBalanceAfter = await bananaToken.balanceOf(testerAddress);

        //Check if banana rewards in pool also generate rewards
        expect(Number(bananaBalanceAfter - bananaBalanceBefore)).to.be.greaterThan(Number(accSharesPerStakedToken * 0.99 * (toDeposit / 1e18))); //0.99 = 1% withdral rewards fee

        expect(Number(bananaBalanceAfter)).to.be.greaterThan(Number(bananaBalanceBefore));

      });

      it('Should take all fees if activated', async () => {
        const wrappedNative = contract.fromArtifact('ERC20', testConfig.wrappedNative);

        await maximizerVaultApe.setKeeperFee("50", { from: adminAddress });
        await maximizerVaultApe.setPlatformFee("100", { from: adminAddress });
        await maximizerVaultApe.setBuyBackRate("100", { from: adminAddress });

        const platformFeeBefore = await wrappedNative.balanceOf(platformAddress);
        const keeperFeeBefore = await wrappedNative.balanceOf(treasuryAddress);
        const buyBackFeeBefore = await bananaToken.balanceOf("0x000000000000000000000000000000000000dEaD");

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        const platformFeeAfter = await wrappedNative.balanceOf(platformAddress);
        const keeperFeeAfter = await wrappedNative.balanceOf(treasuryAddress);
        const buyBackFeeAfter = await bananaToken.balanceOf("0x000000000000000000000000000000000000dEaD");

        const accSharesPerStakedToken = await maximizerVaultApe.accSharesPerStakedToken(0);
        expect(Number(accSharesPerStakedToken)).to.be.greaterThan(0)

        //Note: there is no check on calculating exact fee. just if received any fee.
        expect(Number(platformFeeAfter)).to.be.greaterThan(Number(platformFeeBefore))
        expect(Number(keeperFeeAfter)).to.be.greaterThan(Number(keeperFeeBefore))
        expect(Number(buyBackFeeAfter)).to.be.greaterThan(Number(buyBackFeeBefore))
      });

      it('multiple wallets should do everything', async () => {
        const wantBalanceBefore = await wantToken.balanceOf(testerAddress);
        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress })
        let userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).equal(0)

        let currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
        let checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        expect(checkUpkeep.upkeepNeeded).to.be.true;
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress2 })
        userInfo = await maximizerVaultApe.userInfo(0, testerAddress2);
        expect(userInfo.stake.toString()).equal(toDeposit)
        expect(Number(userInfo.rewardDebt)).to.be.greaterThan(0)

        currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);
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

      it('should be able to disable and enable vault', async () => {
        await maximizerVaultApe.disableVault(0, { from: adminAddress })
        const vaultAddress = await maximizerVaultApe.vaults(0);
        let vaultInfo = await maximizerVaultApe.vaultInfos(vaultAddress);
        expect(vaultInfo.enabled).to.be.false;

        await expectRevert(maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress }), "MaximizerVaultApe: vault is disabled");
        await expectRevert(maximizerVaultApe.earn(0, { from: testerAddress }), "MaximizerVaultApe: vault is disabled");

        await maximizerVaultApe.enableVault(0, { from: adminAddress })
        vaultInfo = await maximizerVaultApe.vaultInfos(vaultAddress);
        expect(vaultInfo.enabled).to.be.true;

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress });
        await maximizerVaultApe.earn(0, { from: testerAddress });

        const userInfo = await maximizerVaultApe.userInfo(0, testerAddress);
        expect(userInfo.stake.toString()).equal(toDeposit)
      });

      it('should have correct values for view functions', async () => {
        let balanceOf = await this.strategy.balanceOf(testerAddress);
        expect(balanceOf.stake.toString()).equal("0");
        expect(balanceOf.banana.toString()).equal("0");
        expect(balanceOf.autoBananaShares.toString()).equal("0");

        await maximizerVaultApe.deposit(0, toDeposit, { from: testerAddress });
        let currentBlock = await time.latestBlock();
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        let checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        balanceOf = await this.strategy.balanceOf(testerAddress);
        const banana1 = balanceOf.banana;
        const autoBananaShares1 = balanceOf.autoBananaShares;
        expect(balanceOf.stake.toString()).equal(toDeposit);
        expect(Number(banana1)).to.be.greaterThan(0);
        expect(Number(autoBananaShares1)).to.be.greaterThan(0);
        expect(Number(autoBananaShares1)).equals(Number(banana1));

        let getPricePerFullShare = await bananaVault.getPricePerFullShare();
        expect(Number(getPricePerFullShare)).equals(1e18);

        currentBlock = await time.latestBlock();
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        checkUpkeep = await maximizerVaultApe.checkUpkeep("0x");
        await maximizerVaultApe.performUpkeep(checkUpkeep.performData, { from: adminAddress });

        balanceOf = await this.strategy.balanceOf(testerAddress);
        expect(balanceOf.stake.toString()).equal(toDeposit);
        expect(Number(balanceOf.banana)).to.be.greaterThan(Number(banana1));
        expect(Number(balanceOf.autoBananaShares)).to.be.greaterThan(Number(autoBananaShares1));

        getPricePerFullShare = await bananaVault.getPricePerFullShare();
        expect(Number(getPricePerFullShare)).to.be.greaterThan(1e18);

        const totalStake = await this.strategy.totalStake();
        expect(totalStake.toString()).equal(toDeposit);

        const totalAutoBananaShares = await this.strategy.totalAutoBananaShares();
        const totalShares = await bananaVault.totalShares();
        expect(totalAutoBananaShares.toString()).equal(totalShares.toString());
      });
    });
  });
});
