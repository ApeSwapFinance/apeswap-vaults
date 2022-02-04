## `StrategyBeltToken`






### `initialize(address[8] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToWantPath, uint256 _pid)` (external)

address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _uniRouterAddress,
        _configAddresses[2]  _wantAddress, // 0xa8bb71facdd46445644c277f9499dd22f6f0a30c BeltBNB
        _configAddress[3]  _earnedAddress
        _configAddress[4]  _usdAddress
        _configAddress[5]  _bananaAddress
        _configAddress[6]  _masterBelt
        _configAddress[7]  _oToken



### `earn()` (external)





### `earn(address _to)` (external)





### `_earn(address _to)` (internal)





### `vaultSharesTotal() → uint256` (public)





### `wantLockedTotal() → uint256` (public)





### `_wrapBNB()` (internal)





### `_vaultHarvest()` (internal)





### `_vaultDeposit(uint256 _amount)` (internal)





### `_vaultWithdraw(uint256 _amount)` (internal)





### `_resetAllowances()` (internal)





### `_emergencyVaultWithdraw()` (internal)





### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)






