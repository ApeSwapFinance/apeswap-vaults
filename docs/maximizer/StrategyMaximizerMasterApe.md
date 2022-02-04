## `StrategyMaximizerMasterApe`

aked $BANANA user had at his last action
        uint256 autoBananaShares;
        // Banana shares not entitled to the us



### `onlyVaultApe()`

/ @notice compound of vault





### `constructor(address _masterApe, uint256 _farmPid, bool _isCakeStaking, address _stakedToken, address _farmRewardToken, address _bananaVault, address _router, address[] _pathToBanana, address[] _pathToWbnb, address _owner, address _vaultApe)` (public)





### `earn(uint256 _minPlatformOutput, uint256 _minKeeperOutput, uint256 _minBurnOutput, uint256 _minBananaOutput, bool _takeKeeperFee)` (external)

uint256 _minBurnOutput,
        uint256 _minBananaOutput,
        bool _takeKeeperFee
    ) external override onlyVaultApe {
        if (IS_CAKE_STAKING) {
            STAKED_TOKEN_FARM.leaveStaking(0);
        } else {
            STAKED_TOKEN_FARM.withdraw(FARM_PID, 0);
        }

        uint256 rewardTokenB



### `deposit(address _userAddress)` (external)

e user = userInfo[_userAddress];

        _approveTokenIfNeeded(



### `withdraw(address _userAddress, uint256 _amount)` (external)

zero"
        );
        _amount = user.stake < _amount ? user.stake : _amount;

        if (IS_CAKE_STAKING) {



### `claimRewards(address _userAddress, uint256 _shares)` (external)

te {
        UserInfo storage user = userInfo[_userAddress];

        if (_update) {
            user.auto



### `getExpectedOutputs() → uint256 platformOutput, uint256 keeperOutput, uint256 burnOutput, uint256 bananaOutput` (external)

tputs()
        external
        view
        override
        returns (
            uint256 platformOutput,
            uint256 keeperOutput,
            uint256 burnOutput,
            uint256 bananaOutput
        )
    {
        // Find the expected WBNB value of the current harvestable rewards
        uint256 wbnbOutput = _getExpectedOutput(pathToWbnb);
        // Find the exp



### `balanceOf(address _userAddress) → uint256 stake, uint256 banana, uint256 autoBananaShares` (external)

(accSharesPerStakedToken)
            .div(1e18)
            .sub(user.rewardD



### `totalStake() → uint256` (public)

es, , , ) = BANANA_VAULT.userInfo(address(this))



### `totalAutoBananaShares() → uint256` (public)

balance = _bananaBalance();

        if (_amount > bal



### `setPathToBanana(address[] _path)` (external)





### `setPathToWbnb(address[] _path)` (external)





### `setTreasury(address _treasury)` (external)





### `setVaultApe(address _vaultApe)` (external)





### `setKeeperFee(uint256 _keeperFee)` (external)





### `setPlatform(address _platform)` (external)





### `setPlatformFee(uint256 _platformFee)` (external)





### `setBuyBackRate(uint256 _buyBackRate)` (external)





### `setWithdrawFee(uint256 _withdrawFee)` (external)





### `setWithdrawFeePeriod(uint256 _withdrawFeePeriod)` (external)





### `setWithdrawRewardsFee(uint256 _withdrawRewardsFee)` (external)






### `Deposit(address user, uint256 amount)`





### `Withdraw(address user, uint256 amount)`





### `EarlyWithdraw(address user, uint256 amount, uint256 fee)`





### `ClaimRewards(address user, uint256 shares, uint256 amount)`





### `SetPathToBanana(address[] oldPath, address[] newPath)`





### `SetPathToWbnb(address[] oldPath, address[] newPath)`





### `SetBuyBackRate(uint256 oldBuyBackRate, uint256 newBuyBackRate)`





### `SetTreasury(address oldTreasury, address newTreasury)`





### `SetVaultApe(address oldVaultApe, address newVaultApe)`





### `SetKeeperFee(uint256 oldKeeperFee, uint256 newKeeperFee)`





### `SetPlatform(address oldPlatform, address newPlatform)`





### `SetPlatformFee(uint256 oldPlatformFee, uint256 newPlatformFee)`





### `SetWithdrawRewardsFee(uint256 oldWithdrawRewardsFee, uint256 newWithdrawRewardsFee)`





### `SetWithdrawFee(uint256 oldEarlyWithdrawFee, uint256 newEarlyWithdrawFee)`





