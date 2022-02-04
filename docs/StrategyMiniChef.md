## `StrategyMiniChef`






### `initialize(address[8] _configAddresses, uint256 _pid, address[11][] _paths)` (public)

address[11][] _paths
        _paths[0]   earnedToWnativePath,
        _paths[1]   earnedToUsdPath,
        _paths[2]   earnedToBananaPath,
        _paths[3]   earnedToToken0Path,
        _paths[4]   earnedToToken1Path,
        _paths[5]   secondEarnedToToken0Path,
        _paths[6]   secondEarnedToToken1Path,
        _paths[7]   token0ToEarnedPath,
        _paths[8]   token1ToEarnedPath
        _paths[9]   secondEarnedToUsdPath
        _paths[10]  secondEarnedToBananaPath
        _paths[11]  secondEarnedToWnativePath



### `_vaultDeposit(uint256 _amount)` (internal)





### `_vaultWithdraw(uint256 _amount)` (internal)





### `_vaultHarvest()` (internal)





### `earn()` (external)





### `earn(address _to)` (external)





### `_earn(address _to)` (internal)





### `distributeFees(uint256 _earnedAmt, address _earnedAddress, address _to) → uint256` (internal)





### `distributeRewards(uint256 _earnedAmt, address _earnedAddress) → uint256` (internal)





### `buyBack(uint256 _earnedAmt, address _earnedAddress) → uint256` (internal)





### `vaultSharesTotal() → uint256` (public)





### `wantLockedTotal() → uint256` (public)





### `_resetAllowances()` (internal)





### `_emergencyVaultWithdraw()` (internal)





### `emergencyPanic()` (external)





### `safeTransferETH(address to, uint256 value)` (internal)





### `receive()` (external)





### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)






