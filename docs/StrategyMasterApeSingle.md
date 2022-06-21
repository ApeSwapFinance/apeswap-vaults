## `StrategyMasterApeSingle`






### `initialize(address[7] _configAddresses, uint256 _pid, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath)` (external)

address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _masterchefAddress,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress



### `earn()` (external)





### `earn(address _to)` (external)





### `_earn(address _to)` (internal)





### `_vaultDeposit(uint256 _amount)` (internal)





### `_vaultWithdraw(uint256 _amount)` (internal)





### `_vaultHarvest()` (internal)





### `vaultSharesTotal() → uint256` (public)





### `wantLockedTotal() → uint256` (public)





### `_resetAllowances()` (internal)





### `_emergencyVaultWithdraw()` (internal)





### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)






