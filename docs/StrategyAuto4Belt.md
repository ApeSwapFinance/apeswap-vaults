## `StrategyAuto4Belt`






### `initialize(address[8] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, uint256 _pid)` (external)

address[8] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _autoFarm,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress
        _configAddress[7]  _beltLp



### `_vaultDeposit(uint256 _amount)` (internal)





### `_vaultWithdraw(uint256 _amount)` (internal)





### `_vaultHarvest()` (internal)





### `earn()` (external)





### `earn(address _to)` (external)





### `_earn(address _to)` (internal)





### `_addLiquidity()` (internal)





### `wantLockedTotal() → uint256` (public)





### `balanceOfWant() → uint256` (public)





### `vaultSharesTotal() → uint256` (public)





### `_emergencyVaultWithdraw()` (internal)





### `_resetAllowances()` (internal)





### `_removeAllowances()` (internal)





### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)






