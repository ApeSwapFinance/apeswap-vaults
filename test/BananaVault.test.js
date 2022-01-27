const { expectRevert, time, ether, constants } = require('@openzeppelin/test-helpers');
const { farm } = require('@apeswapfinance/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect, assert } = require('chai');
const { addBNStr, subBNStr, mulBNStr, divBNStr, isWithinLimit, formatBNObjectToString } = require('./helpers/bnHelper');


// Load compiled artifacts
const BananaVault = contract.fromArtifact('BananaVault');

describe('BananaVault', function () {
  this.timeout(60000);
  const [feeTo, treasury, admin, manager, alice, bob] = accounts;

  beforeEach(async () => {
    // FIXME: In the test helpers, it seems that the MasterApe is not the owner of the BananaToken
    const {
      bananaToken,
      bananaSplitBar,
      masterApe,
    } = await farm.deployMockFarm([admin, feeTo]); // accounts passed will be used in the deployment
    this.masterApe = masterApe;
    this.bananaToken = bananaToken;
    // Set ownership of tokens to MasterApe
    this.bananaToken.transferOwnership(this.masterApe.address, { from: admin });
    bananaSplitBar.transferOwnership(this.masterApe.address, { from: admin });

    // Admin receives an initial mint of 25000
    // Transfer to users
    await this.bananaToken.transfer(alice, ether('10000'), { from: admin });
    await this.bananaToken.transfer(bob, ether('10000'), { from: admin });
    // Setup the BananaVault
    this.bananaVault = await BananaVault.new(
      this.bananaToken.address,
      this.masterApe.address,
      admin,
      treasury,
      0, // Withdraw Fee
    )
    // Define roles
    this.DEFAULT_ADMIN_ROLE = await this.bananaVault.DEFAULT_ADMIN_ROLE();
    this.MANAGER_ROLE = await this.bananaVault.MANAGER_ROLE();
    this.DEPOSIT_ROLE = await this.bananaVault.DEPOSIT_ROLE();
    // Grant roles
    await this.bananaVault.grantRole(this.MANAGER_ROLE, manager, { from: admin });
    await this.bananaVault.grantRole(this.DEPOSIT_ROLE, alice, { from: manager });
    await this.bananaVault.grantRole(this.DEPOSIT_ROLE, bob, { from: manager });
  });

  it('should setup roles properly', async () => {
    assert.equal(await this.bananaVault.hasRole(this.DEFAULT_ADMIN_ROLE, admin), true, 'admin does not have DEFAULT_ADMIN_ROLE role');
    assert.equal(await this.bananaVault.hasRole(this.MANAGER_ROLE, manager), true, 'manager does not have MANAGER role');
    assert.equal(await this.bananaVault.hasRole(this.DEPOSIT_ROLE, alice), true, 'depositor does not have DEPOSITOR role');
    assert.equal(await this.bananaVault.hasRole(this.DEPOSIT_ROLE, bob), true, 'depositor does not have DEPOSITOR role');
  });

  it('should allow a user to deposit', async () => {
    await this.bananaToken.approve(this.bananaVault.address, constants.MAX_UINT256, { from: alice });
    await this.bananaVault.deposit(ether('10000'), { from: alice });

    const userInfoBananaVault = await this.bananaVault.userInfo(alice);
    console.dir(formatBNObjectToString(userInfoBananaVault));
    const userInfoMasterApe = await this.masterApe.userInfo(0, this.bananaVault.address);
    console.dir(formatBNObjectToString(userInfoMasterApe));

    await time.advanceBlock('10');
    await this.masterApe.updatePool(0);
    console.dir({ pendingBanana: (await this.masterApe.pendingCake(0, this.bananaVault.address)).toString() });
    console.dir({ vaultPendingBanana: (await this.bananaVault.calculateTotalPendingBananaRewards()).toString() });
    console.dir({ vaultAvailableBanana: (await this.bananaVault.available()).toString() });

    await this.bananaToken.approve(this.bananaVault.address, constants.MAX_UINT256, { from: bob });
    console.dir({ vaultBananaValue: (await this.bananaToken.balanceOf(this.bananaVault.address)).toString() });
    await this.masterApe.updatePool(0);
    // FIXME: Returned error: VM Exception while processing transaction: revert
    await this.bananaVault.earn();
    // await this.bananaVault.deposit(ether('10000'), { from: bob });
    // await expectRevert(
    //   this.mock.transfer(bob, ether('11'), { from: alice }), 'ERC20: transfer amount exceeds balance'
    // );
  });
});
