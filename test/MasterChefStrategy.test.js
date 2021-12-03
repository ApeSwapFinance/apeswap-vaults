const { expectRevert, time, ether } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { accounts, contract } = require('@openzeppelin/test-environment');
const { MasterChefVaults } = require('../configs/vaults');

// Load compiled artifacts
const VaultApe = contract.fromArtifact('VaultApe');
const StrategyMasterChef = contract.fromArtifact('StrategyMasterChef');

const config = {
adminAddress: "0x0341242Eb1995A9407F1bf632E8dA206858fBB3a",
  routerAddress: "0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7",
  vaultAddress: "0x5711a833C943AD1e8312A9c7E5403d48c717e1aa",
  usdAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  bananaAddress: "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95",
  autoFarm: "0x0895196562C7868C5Be92459FaE7f877ED450452",
  masterBelt: "0xd4bbc80b9b102b77b21a06cb77e954049605e6c1",
}

describe('MasterChefStrategy', function () {
  beforeEach(async () => {
    this.vaultApe = await VaultApe.new();
    const vault = MasterChefVaults.bsc[0];
    this.strategy = await StrategyMasterChef.new()
    await this.strategy.initialize(
      [this.vaultApe.address, vault.configAddresses[0], config.routerAddress, vault.configAddresses[1], vault.configAddresses[2], config.usdAddress, config.bananaAddress], 
      vault.pid, 
      vault.earnedToWnativePath, 
      vault.earnedToUsdPath, 
      vault.earnedToBananaPath, 
      vault.earnedToToken0Path, 
      vault.earnedToToken1Path, 
      vault.token0ToEarnedPath, 
      vault.token1ToEarnedPath);
    
    this.vaultApe.addPool(this.strategy.address);
  });

  it('should have accurate supply', async () => {
  });

  it('should not transfer more than balance', async () => {
    // await expectRevert(
    // );
  });
});
