const { expectRevert, time, ether } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const IERC20_ABI = require('./utils/abis/IERC20-ABI.json');
const { testConfig, testStrategies } = require('./utils/config.js');
const { MAX_UINT256 } = require('@openzeppelin/test-helpers/src/constants');

// Load compiled artifacts
const VaultApe = contract.fromArtifact('VaultApe');

describe('VaultApe', function () {
  this.timeout(99960000);

  const testerAddress = testConfig.testAccount;
  const testerAddress2 = testConfig.testAccount2;
  const rewardAddress = testConfig.rewardAddress;
  const buyBackAddress = testConfig.buyBackAddress;
  const govAddress = testConfig.govAddress;
  let vaultApe;
  let usdToken, bananaToken;
  beforeEach(async () => {
    // Deploy new vault
    vaultApe = await VaultApe.new();

    usdToken = contract.fromArtifact('ERC20', testConfig.usdAddress);
    bananaToken = contract.fromArtifact('ERC20', testConfig.bananaAddress);
    router = contract.fromArtifact("IUniRouter02", testConfig.routerAddress);
  });

  for (const strategy of testStrategies) {

    describe(`Testing ${strategy.contractName}`, () => {
      const toDeposit = '1000000000000000'
      const blocksToAdvance = 10;
      const wantToken = contract.fromArtifact('ERC20', strategy.wantToken);

      before(async () => {
        let token0 = '0x0000000000000000000000000000000000000000';
        let token1 = '0x0000000000000000000000000000000000000000';
        let pair = null;
        try {
          pair = contract.fromArtifact("IUniPair", strategy.wantToken);
          token0 = await pair.token0();
          token1 = await pair.token1();
        } catch (e) {
        }

        const router = contract.fromArtifact("IUniRouter02", testConfig.routerAddress);
        const usdToken = contract.fromArtifact('ERC20', testConfig.usdAddress);
        await usdToken.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });

        if (token0 != '0x0000000000000000000000000000000000000000') {
          const tokenContract0 = contract.fromArtifact('ERC20', token0);
          const tokenContract1 = contract.fromArtifact('ERC20', token1);
          await tokenContract0.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });
          await tokenContract1.approve(testConfig.routerAddress, MAX_UINT256, { from: testerAddress });

          console.log("Lets do some swapping");
          if (token0 == testConfig.wrappedNative) {
            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn("12000000000000000000", [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens(tokenInAmount, 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            await router.addLiquidityETH(token1, "10000000000000000000", 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
            await pair.transfer(testerAddress2, toDeposit, { from: testerAddress });
          } else if (token1 == testConfig.wrappedNative) {
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn("12000000000000000000", [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens(tokenInAmount, 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            await router.addLiquidityETH(token0, "10000000000000000000", 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress, value: 1e18 });
            await pair.transfer(testerAddress2, toDeposit, { from: testerAddress });
          } else {
            console.log('same?', token1, testConfig.usdAddress)
            if (token1 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn("12000000000000000000", [testConfig.usdAddress, token1]);
              await router.swapExactTokensForTokens(tokenInAmount, 0, [testConfig.usdAddress, token1], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            if (token0 != testConfig.usdAddress) {
              const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn("12000000000000000000", [testConfig.usdAddress, token0]);
              await router.swapExactTokensForTokens(tokenInAmount, 0, [testConfig.usdAddress, token0], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            }
            await router.addLiquidity(token0, token1, "10000000000000000000", "10000000000000000000", 0, 0, testerAddress, await time.latestBlock() + 600, { from: testerAddress });
            await pair.transfer(testerAddress2, toDeposit, { from: testerAddress });
          }
        } else {
          if (strategy.wantToken != testConfig.usdAddress) {
            const [tokenInAmount, tokenOutAmount] = await router.getAmountsIn("12000000000000000000", [testConfig.usdAddress, strategy.wantToken]);
            await router.swapExactTokensForTokens(tokenInAmount, 0, [testConfig.usdAddress, strategy.wantToken], testerAddress, await time.latestBlock() + 600, { from: testerAddress });
          }
          const wantToken = contract.fromArtifact('ERC20', strategy.wantToken);
          await wantToken.transfer(testerAddress2, toDeposit, { from: testerAddress });
        }
        // const balance = await wantToken.balanceOf(testerAddress);
        // const balance2 = await wantToken.balanceOf(testerAddress2);
        // console.log(balance.toString(), balance2.toString());

        console.log('Before done!');
      });

      beforeEach(async () => {
        // Add Strategy
        const strategyContract = contract.fromArtifact(strategy.contractName);
        this.strategy = await strategyContract.new()
        await this.strategy.initialize(...strategy.initParams(vaultApe.address));
        await vaultApe.addPool(this.strategy.address);

        // Approve want token
        const erc20Contract = new web3.eth.Contract(IERC20_ABI, strategy.wantToken);
        await erc20Contract.methods.approve(vaultApe.address, MAX_UINT256).send({ from: testerAddress });
        await erc20Contract.methods.approve(vaultApe.address, MAX_UINT256).send({ from: testerAddress2 });
      });

      it('should deposit and have shares', async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress })
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit)
        expect(userInfo.toString()).equal(toDeposit)
      });

      it('should deposit and have relative shares from multiple accounts. Also after compound', async () => {
        const toDeposit1 = (Number(toDeposit) * 1.6).toString();
        await vaultApe.deposit(0, toDeposit1, testerAddress, { from: testerAddress })
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit1)
        expect(userInfo.toString()).equal(toDeposit1)

        await vaultApe.deposit(0, toDeposit, testerAddress2, { from: testerAddress2 })
        const userInfo2 = await vaultApe.userInfo(0, testerAddress2);
        const stakedWantTokens2 = await vaultApe.stakedWantTokens(0, testerAddress2);
        expect(Number(stakedWantTokens2)).to.be.within(Number(toDeposit) - 2, Number(toDeposit) + 2);
        expect(userInfo2.toString()).equal(toDeposit)

        expect(Number(stakedWantTokens)).to.be.within(Number(stakedWantTokens2) * 1.6 - 2, Number(stakedWantTokens2) * 1.6 + 2);

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        await vaultApe.earnAll();

        const newUserInfo = await vaultApe.userInfo(0, testerAddress);
        const newStakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(userInfo.toString()).equal(newUserInfo.toString());
        expect(newStakedWantTokens.gt(stakedWantTokens)).to.be.true;

        const newUserInfo2 = await vaultApe.userInfo(0, testerAddress2);
        const newStakedWantTokens2 = await vaultApe.stakedWantTokens(0, testerAddress2);
        expect(userInfo2.toString()).equal(newUserInfo2.toString());
        expect(newStakedWantTokens2.gt(stakedWantTokens2)).to.be.true;

        expect(Number(newStakedWantTokens)).to.be.within(Number(newStakedWantTokens2) * 1.6 - 2, Number(newStakedWantTokens2) * 1.6 + 2);

      });

      it('should increase stakedWantTokens after compound', async () => {

        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit);
        expect(userInfo.toString()).equal(toDeposit);

        const currentBlock = await time.latestBlock()

        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        await vaultApe.earnAll();
        const newUserInfo = await vaultApe.userInfo(0, testerAddress);
        const newStakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(userInfo.toString()).equal(newUserInfo.toString());
        expect(newStakedWantTokens.gt(stakedWantTokens)).to.be.true;
      });

      it('should be able to withdraw all', async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });
        await vaultApe.withdraw(0, toDeposit, testerAddress, { from: testerAddress });

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const userInfo = await vaultApe.userInfo(0, testerAddress);
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(userInfo.toNumber()).equal(0);
        expect(stakedWantTokens.toNumber()).to.equal(0);
      });

      it("should distribute caller reward correctly", async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const testerBalanceBefore = await web3.eth.getBalance(testerAddress);
        const transaction = await vaultApe.earnAll({ from: testerAddress });
        const gasPrice = await web3.eth.getGasPrice();
        const testerBalanceAfter = await web3.eth.getBalance(testerAddress);
        expect(Number(testerBalanceAfter) + (transaction.receipt.gasUsed * gasPrice)).to.be.greaterThan(Number(testerBalanceBefore));
      });

      it("should distribute fees correctly", async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const earnedAddress = await this.strategy.earnedAddress();

        let rewardBalanceBefore = 0;
        let rewardBalanceAfter = 0;

        if (earnedAddress == testConfig.bananaAddress) {
          rewardBalanceBefore = await bananaToken.balanceOf(rewardAddress);
        } else {
          rewardBalanceBefore = await usdToken.balanceOf(rewardAddress);
        }

        await vaultApe.earnAll();

        if (earnedAddress == testConfig.bananaAddress) {
          rewardBalanceAfter = await bananaToken.balanceOf(rewardAddress);
        } else {
          rewardBalanceAfter = await usdToken.balanceOf(rewardAddress);

        }

        expect(Number(rewardBalanceAfter)).to.be.greaterThan(Number(rewardBalanceBefore));
      });

      it("should distribute buyback correctly", async () => {
        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress });

        const currentBlock = await time.latestBlock()
        await time.advanceBlockTo(currentBlock.toNumber() + blocksToAdvance);

        const buyBackBalanceBefore = await bananaToken.balanceOf(buyBackAddress);
        await vaultApe.earnAll();
        const buyBackBalanceAfter = await bananaToken.balanceOf(buyBackAddress);
        expect(Number(buyBackBalanceAfter)).to.be.greaterThan(Number(buyBackBalanceBefore));
      });

      it("should be able to pause and unpause", async () => {
        await this.strategy.pause();
        await expectRevert(vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress }), "Pausable: paused");

        await this.strategy.unpause();

        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress })
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit)
      });

      it("should be able to panic and unpanic", async () => {
        await this.strategy.panic();
        await expectRevert(vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress }), "Pausable: paused");

        let vaultSharesTotal = await this.strategy.vaultSharesTotal();
        expect(vaultSharesTotal.toNumber()).to.equal(0);

        await this.strategy.unpanic();

        await vaultApe.deposit(0, toDeposit, testerAddress, { from: testerAddress })
        const stakedWantTokens = await vaultApe.stakedWantTokens(0, testerAddress);
        expect(stakedWantTokens.toString()).equal(toDeposit)

        vaultSharesTotal = await this.strategy.vaultSharesTotal();
        expect(vaultSharesTotal.toNumber()).to.be.greaterThan(0);
      });

    });
  }

});
