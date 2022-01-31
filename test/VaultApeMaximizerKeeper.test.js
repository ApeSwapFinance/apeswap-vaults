const { expectRevert, time, ether } = require('@openzeppelin/test-helpers');
const chai = require('chai');
const { expect, assert } = chai;
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

// Load compiled artifacts
const VaultApeMaximizerKeeper = contract.fromArtifact('VaultApeMaximizerKeeper');
const StrategyMaximizer = contract.fromArtifact("StrategyMaximizer");
const BananaVault = contract.fromArtifact("BananaVault");

describe('VaultApeMaximizerKeeper', function () {
  this.timeout(9960000);

  //0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69
  const testerAddress = "0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69";//testConfig.testAccount;
  const testerAddress2 = testConfig.testAccount2;
  const rewardAddress = testConfig.rewardAddress;
  const buyBackAddress = testConfig.buyBackAddress;
  const adminAddress = testConfig.adminAddress;
  let vaultApeMaximizerKeeper, bananaVault, router;
  let usdToken, bananaToken, lpToken;

  const blocksToAdvance = 10;

  let toDeposit = "1000000000000000000";
  let tokensToLPAmount = "100000000000000000000";

  const lpTokenAddress = "0x51e6D27FA57373d8d4C256231241053a70Cb1d93";

  before(async () => {
    router = contract.fromArtifact("IUniRouter02", testConfig.routerAddress);
    usdToken = contract.fromArtifact('ERC20', testConfig.bananaAddress);
    bananaToken = contract.fromArtifact('ERC20', testConfig.bananaAddress);
    lpToken = contract.fromArtifact('ERC20', lpTokenAddress);
    masterApe = contract.fromArtifact('IMasterApe', testConfig.masterApe);
    await usdToken.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });

    // let token0 = '0x0000000000000000000000000000000000000000';
    // let token1 = '0x0000000000000000000000000000000000000000';
    // let pair = null;
    // try {
    //   pair = contract.fromArtifact("IUniPair", lpTokenAddress);
    //   token0 = await pair.token0();
    //   token1 = await pair.token1();
    // } catch (e) {
    //   throw Error(lpTokenAddress + ' is not a LP Token');
    // }

    // const tokenContract0 = contract.fromArtifact('ERC20', token0);
    // const tokenContract1 = contract.fromArtifact('ERC20', token1);
    // await tokenContract0.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });
    // await tokenContract1.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });

    // if (token0 == testConfig.wrappedNative) {
    //   if (token1 != testConfig.usdAddress) {
    //     const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
    //     await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
    //   }
    //   await router.addLiquidityETH(token1, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
    //   const LPTokens = await pair.balanceOf(testerAddress);
    //   toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
    //   await pair.transfer(testerAddress2, (Number(toDeposit)).toString(), { from: testerAddress });
    // } else if (token1 == testConfig.wrappedNative) {
    //   if (token0 != testConfig.usdAddress) {
    //     const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
    //     await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
    //   }
    //   await router.addLiquidityETH(token0, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
    //   const LPTokens = await pair.balanceOf(testerAddress);
    //   toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
    //   await pair.transfer(testerAddress2, (Number(toDeposit)).toString(), { from: testerAddress });
    // } else {
    //   if (token1 != testConfig.usdAddress) {
    //     const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token1]);
    //     await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
    //   }
    //   if (token0 != testConfig.usdAddress) {
    //     const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn(tokensToLPAmount, [testConfig.usdAddress, token0]);
    //     await router.swapExactTokensForTokens((Number(tokenInAmount) * 1.1).toString(), 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
    //   }
    //   await router.addLiquidity(token0, token1, tokensToLPAmount, tokensToLPAmount, 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress });
    //   const LPTokens = await pair.balanceOf(testerAddress);
    //   toDeposit = (Math.floor(Number(LPTokens) * 0.1)).toString();
    //   await pair.transfer(testerAddress2, (Number(toDeposit)).toString(), { from: testerAddress });
    // }

    await lpToken.transfer(testerAddress2, "1000000000000000000", { from: testerAddress });
  });

  beforeEach(async () => {
    // Deploy new vault
    bananaVault = await BananaVault.new(testConfig.bananaAddress, testConfig.masterApe, rewardAddress, 0);
    vaultApeMaximizerKeeper = await VaultApeMaximizerKeeper.new(adminAddress, adminAddress, bananaVault.address);
    await bananaVault.transferOwnership(vaultApeMaximizerKeeper.address);

    // Add Strategy
    this.strategy = await StrategyMaximizer.new(testConfig.masterApe, 3, lpTokenAddress, testConfig.bananaAddress, bananaVault.address, testConfig.routerAddress, [testConfig.bananaAddress], [testConfig.bananaAddress, testConfig.wrappedNative], ["0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2", "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2", vaultApeMaximizerKeeper.address, "0x5c7C7246bD8a18DF5f6Ee422f9F8CCDF716A6aD2"], 0, 0);
    await vaultApeMaximizerKeeper.addVault(this.strategy.address, { from: adminAddress });

    // Approve want token
    const erc20Contract = new web3.eth.Contract(IERC20_ABI, lpTokenAddress);
    await erc20Contract.methods.approve(vaultApeMaximizerKeeper.address, MAX_UINT256).send({ from: testerAddress });
    await erc20Contract.methods.approve(vaultApeMaximizerKeeper.address, MAX_UINT256).send({ from: testerAddress2 });
  });

  it('should deposit and have shares', async () => {
    await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })
    const userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
    expect(userInfo.stake.toString()).equal(toDeposit)
  });

  it('should withdraw', async () => {
    const lpBalanceBefore = await lpToken.balanceOf(testerAddress);

    await vaultApeMaximizerKeeper.deposit(0, toDeposit, { from: testerAddress })

    let userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
    expect(userInfo.stake.toString()).equal(toDeposit)

    await vaultApeMaximizerKeeper.withdraw(0, toDeposit, { from: testerAddress })

    userInfo = await vaultApeMaximizerKeeper.userInfo(0, testerAddress);
    expect(Number(userInfo.stake)).equal(0)

    const lpBalanceAfter = await lpToken.balanceOf(testerAddress);
    const withdrawFee = Number(toDeposit) * 0.0025;
    expect(lpBalanceAfter).to.be.a.bignumber.that.equals(lpBalanceBefore.sub(new BN(withdrawFee))); //0.25% withdraw fees
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
    const lpBalanceBefore = await lpToken.balanceOf(testerAddress);
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

    const lpBalanceAfter = await lpToken.balanceOf(testerAddress);
    expect(Number(lpBalanceAfter)).equal(Number(lpBalanceBefore) - (Number(toDeposit) * 0.0025)) //0.25% withdraw fees

    expect(Number(bananaBalanceAfter1) - Number(bananaBalanceBefore1)).to.be.greaterThan(Number(accSharesPerStakedToken * (toDeposit / 1e18)));
    expect(Number(bananaBalanceAfter1)).to.be.greaterThan(Number(bananaBalanceBefore1));
    expect(Number(bananaBalanceAfter2)).to.be.greaterThan(Number(bananaBalanceBefore2));

    expect(Number(bananaBalanceAfter1 - bananaBalanceBefore1)).to.be.greaterThan(Number(bananaBalanceAfter2 - bananaBalanceBefore2));
  });

});
