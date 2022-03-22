## `IMaximizerVaultApe`






### `KEEPER_FEE_UL() → uint256` (external)





### `PLATFORM_FEE_UL() → uint256` (external)





### `BUYBACK_RATE_UL() → uint256` (external)





### `WITHDRAW_FEE_UL() → uint256` (external)





### `WITHDRAW_REWARDS_FEE_UL() → uint256` (external)





### `getSettings() → struct IMaximizerVaultApe.Settings` (external)





### `userInfo(uint256 _pid, address _user) → uint256 stake, uint256 autoBananaShares, uint256 rewardDebt, uint256 lastDepositedTime` (external)





### `vaultsLength() → uint256` (external)





### `addVault(address _strat)` (external)





### `stakedWantTokens(uint256 _pid, address _user) → uint256` (external)





### `deposit(uint256 _pid, uint256 _wantAmt)` (external)





### `withdraw(uint256 _pid, uint256 _wantAmt)` (external)





### `withdrawAll(uint256 _pid)` (external)





### `earnAll()` (external)





### `earnSome(uint256[] pids)` (external)





### `harvest(uint256 _pid, uint256 _wantAmt)` (external)





### `harvestAll(uint256 _pid)` (external)







### `Settings`


address treasury


uint256 keeperFee


address platform


uint256 platformFee


uint256 buyBackRate


uint256 withdrawFee


uint256 withdrawFeePeriod


uint256 withdrawRewardsFee



