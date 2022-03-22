## `StrategyMaximizerMasterApe`

uint256 _farmPid,
        bool _isBananaStaking,
        address _stakedToken,
        address _farmRewardToken,




### `constructor(address _masterApe, uint256 _farmPid, bool _isBananaStaking, address _stakedToken, address _farmRewardToken, address _bananaVault, address _router, address[] _pathToBanana, address[] _pathToWbnb, address[] _addresses)` (public)





### `totalStake() → uint256` (public)

n _vaultDeposit(uint256 _amount) internal override {
        _approveTokenIfNeeded(
            STAKE



### `_vaultDeposit(uint256 _amount)` (internal)

RM_PID, _amount);
        }
    }
    
Handle withdraw of this strategy
    /



### `_vaultWithdraw(uint256 _amount)` (internal)

nternal override {
        if(IS_BANANA_STAKING) {
            STAKE_TOKEN_FARM.enterStaking(0);



### `_vaultHarvest()` (internal)

m index 0 to n




### `_getExpectedOutput(address[] _path) → uint256` (internal)

_FARM.pendingCake(FARM_PID, address(this)));

        if (_path.length <= 1 || rewards == 0) {
            return rewards;
        } else {
            uint256[] memory amounts = router.getAmountsOut(rewards, _path);



### `_beforeDeposit(address _to)` (internal)





### `_beforeWithdraw(address _to)` (internal)








