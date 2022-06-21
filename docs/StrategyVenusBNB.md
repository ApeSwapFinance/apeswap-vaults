## `StrategyVenusBNB`



It maximizes yields doing leveraged lending with BNB on Venus.


### `initialize(address[6] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _markets)` (external)

address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _uniRouterAddress,
        _configAddresses[2]  _wantAddress,
        _configAddress[3]  _earnedAddress
        _configAddress[4]  _usdAddress
        _configAddress[5]  _bananaAddress



### `_vaultDeposit(uint256 _amount)` (internal)



Function that puts the funds to work.
It gets called whenever someone deposits in the strategy's vault. It does {borrowDepth} 
levels of compound lending. It also updates the helper {depositedBalance} variable.

### `_vaultWithdraw(uint256 _amount)` (internal)



Withdraws funds and sends them back to the vault. It deleverages from venus first,
and then deposits again after the withdraw to make sure it mantains the desired ratio. 


### `_vaultHarvest()` (internal)





### `earn()` (external)





### `earn(address _to)` (external)





### `_earn(address _to)` (internal)



Core function of the strat, in charge of collecting and re-investing rewards.
1. It claims {venus} rewards from the Unitroller.
3. It charges the system fee.
4. It swaps the remaining rewards into more {wbnb}.
4. It re-invests the remaining profits.

### `_leverage(uint256 _amount)` (internal)



Repeatedly supplies and borrows bnb following the configured {borrowRate} and {borrowDepth}


### `_deleverage()` (internal)



Incrementally alternates between paying part of the debt and withdrawing part of the supplied 
collateral. Continues to do this until it repays the entire debt and withdraws all the supplied bnb 
from the system

### `deleverageOnce(uint256 _borrowRate)` (external)



Extra safety measure that allows us to manually unwind one level. In case we somehow get into 
as state where the cost of unwinding freezes the system. We can manually unwind a few levels 
with this function and then 'rebalance()' with new {borrowRate} and {borrowConfig} values. 


### `rebalance(uint256 _borrowRate, uint256 _borrowDepth)` (external)



Updates the risk profile and rebalances the vault funds accordingly.


### `_swapRewards()` (internal)



Swaps {venus} rewards earned for more {wbnb}.

### `updateBalance()` (public)



It helps mantain a cached version of the bnb deposited in venus. 
We use it to be able to keep the vault's 'balance()' function and 
'getPricePerFullShare()' with view visibility.

### `_resetAllowances()` (internal)





### `balanceOf() → uint256` (public)



Function to calculate the total underlaying {wbnb} and bnb held by the strat.
It takes into account both the funds at hand, and the funds allocated in the {vbnb} contract.
It uses a cache of the balances stored in {depositedBalance} to enable a few UI helper functions
to exist. Sensitive functions should call 'updateBalance()' first to make sure the data is up to date.


### `balanceOfStrat() → uint256` (public)



It calculates how much BNB the contract holds.


### `vaultSharesTotal() → uint256` (public)





### `wantLockedTotal() → uint256` (public)





### `receive()` (external)





### `_emergencyVaultWithdraw()` (internal)





### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)






### `StratHarvest(address harvester)`



Events that the contract emits

### `StratRebalance(uint256 _borrowRate, uint256 _borrowDepth)`





