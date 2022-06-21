## `VaultApeWhitelist`






### `initialize(address _stakerRoleAddress, address _adminRoleAddress)` (external)





### `poolLength() → uint256` (external)





### `addPool(address _strat)` (external)



Add a new want to the pool. Can only be called by the owner.

### `stakedWantTokens(uint256 _pid, address _user) → uint256` (external)





### `deposit(uint256 _pid, uint256 _wantAmt)` (external)





### `deposit(uint256 _pid, uint256 _wantAmt, address _to)` (external)





### `_deposit(uint256 _pid, uint256 _wantAmt, address _to)` (internal)





### `withdraw(uint256 _pid, uint256 _wantAmt)` (external)





### `withdraw(uint256 _pid, uint256 _wantAmt, address _to)` (external)





### `_withdraw(uint256 _pid, uint256 _wantAmt, address _to)` (internal)





### `withdrawAll(uint256 _pid)` (external)





### `resetAllowances()` (external)





### `earnAll()` (external)





### `earnSome(uint256[] pids)` (external)





### `resetSingleAllowance(uint256 _pid)` (public)






### `AddPool(address strat)`





### `Deposit(address user, uint256 pid, uint256 amount)`





### `Withdraw(address user, uint256 pid, uint256 amount)`





### `EmergencyWithdraw(address user, uint256 pid, uint256 amount)`





