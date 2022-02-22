## `StrategyMaximizerMasterApe`

ser had at his last action
        uint256 autoBananaShares;
        // Banana shares not entitled to the user
        ui



### `onlyVaultApe()`

und of vault





### `constructor(address _masterApe, uint256 _farmPid, bool _isBananaStaking, address _stakedToken, address _farmRewardToken, address _bananaVault, address _router, address[] _pathToBanana, address[] _pathToWbnb, address[] _addresses)` (public)





### `earn(uint256 _minPlatformOutput, uint256 _minKeeperOutput, uint256 _minBurnOutput, uint256 _minBananaOutput, bool _takeKeeperFee)` (external)

nt256 _minBurnOutput,
        uint256 _minBananaOutput,
        bool _takeKeeperFee
    ) external override onlyVaultApe {
        IMaximizerVaultApe.Settings memory settings = getSettings();

        if (IS_BANANA_STAKING) {
            STAKED_TOKEN_FARM.leaveStaking(0);
        } else {
            STAKED_TOKEN_FARM.with



### `deposit(address _userAddress, uint256 _amount)` (external)

ed(
            STAKED_TOKEN,
            _amount,
            addres



### `withdraw(address _userAddress, uint256 _amount)` (external)

ount > 0,
            "StrategyMaximizerMasterApe: amount must be greater than zero"
        );
        _amount = user.st



### `claimRewards(address _userAddress, uint256 _shares)` (external)

private {
        IMaximizerVaultApe.Settings memory settings = getSettings();

        UserInfo storage us



### `getExpectedOutputs() → uint256 platformOutput, uint256 keeperOutput, uint256 burnOutput, uint256 bananaOutput` (external)

()
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
        IMaximizerVaultApe.Settings memory settings = getSettings();

        // Find the expected WBNB value of the current harvestable rewards
        uint256 wbnbOutput =



### `balanceOf(address _userAddress) → uint256 stake, uint256 banana, uint256 autoBananaShares` (external)

ngs = getSettings();

        UserInfo memory user = userInfo[_userAddress];

        uint256 pendingShares = user
            .stake
            .mul(accSha



### `totalStake() → uint256` (public)

banana vault
    function totalAutoBananaShares() public view returns (uint256) {
        (uint256 sh



### `totalAutoBananaShares() → uint256` (public)

ress _to, uint256 _amount) private {
        uint256 balance = _bananaBalance();

        if (_amount > balance) {



### `getSettings() → struct IMaximizerVaultApe.Settings` (public)

nt256 keeperFee = useDefaultSettings.keeperFee
            ? defa



### `setPathToBanana(address[] _path)` (external)

h = pathToBanana;

        pathToBanana = _path;

        emit SetPathToBanana(oldPath, pathToBanana);
    }



### `setPathToWbnb(address[] _path)` (external)

pathToWbnb = _path;

        emit SetPathToWbnb(oldPath, pathToWbnb);
    }

set p



### `setPlatform(address _platform, bool _useDefault)` (external)

m = _platform;
    }

set treasury address




### `setTreasury(address _treasury, bool _useDefault)` (external)

y = _treasury;
    }

set keeper fee




### `setKeeperFee(uint256 _keeperFee, bool _useDefault)` (external)

useDefaultSettings.keeperFee = _useDefault;
        emit SetKeeperFee(strategySettings.keeperFee, _keeperFee, _useDefault);
        strategySettings



### `setPlatformFee(uint256 _platformFee, bool _useDefault)` (external)

);
        useDefaultSettings.platformFee = _useDefault;
        emit SetPlatformFee(
            strategySettings.platformFee,
            _platform



### `setBuyBackRate(uint256 _buyBackRate, bool _useDefault)` (external)

high"
        );
        useDefaultSettings.buyBackRate = _useDefault;
        emit SetBuyBackRate(
            strategySettings.buyBackRate,
            _buyBack



### `setWithdrawFee(uint256 _withdrawFee, bool _useDefault)` (external)

gh"
        );
        useDefaultSettings.withdrawFee = _useDefault;
        emit SetWithdrawFee(
            strategySettings.withdrawFee,
            _wi



### `setWithdrawFeePeriod(uint256 _withdrawFeePeriod, bool _useDefault)` (external)

eePeriod,
            _withdrawFeePeriod,
            _useDefault
        );
        strategySettings.withdrawFeePeriod = _withdrawFeePeriod;
    }

set withdr



### `setWithdrawRewardsFee(uint256 _withdrawRewardsFee, bool _useDefault)` (external)

tings.withdrawRewardsFee,
            _withdrawRewardsFee,
            _useDefault
        );
        strategySettings.withdrawRewardsFee = _withdrawRewardsFee;
    }
}




### `Deposit(address user, uint256 amount)`





### `Withdraw(address user, uint256 amount)`





### `EarlyWithdraw(address user, uint256 amount, uint256 fee)`





### `ClaimRewards(address user, uint256 shares, uint256 amount)`





### `SetPathToBanana(address[] oldPath, address[] newPath)`





### `SetPathToWbnb(address[] oldPath, address[] newPath)`





### `SetTreasury(address oldTreasury, address newTreasury, bool useDefaultFee)`





### `SetPlatform(address oldPlatform, address newPlatform, bool useDefaultFee)`





### `SetBuyBackRate(uint256 oldBuyBackRate, uint256 newBuyBackRate, bool useDefaultFee)`





### `SetKeeperFee(uint256 oldKeeperFee, uint256 newKeeperFee, bool useDefaultFee)`





### `SetPlatformFee(uint256 oldPlatformFee, uint256 newPlatformFee, bool useDefaultFee)`





### `SetWithdrawRewardsFee(uint256 oldWithdrawRewardsFee, uint256 newWithdrawRewardsFee, bool useDefaultFee)`





### `SetWithdrawFee(uint256 oldEarlyWithdrawFee, uint256 newEarlyWithdrawFee, bool useDefaultFee)`






### `UserInfo`


uint256 stake


uint256 autoBananaShares


uint256 rewardDebt


uint256 lastDepositedTime


### `UseDefaultSettings`


bool treasury


bool keeperFee


bool platform


bool platformFee


bool buyBackRate


bool withdrawFee


bool withdrawFeePeriod


bool withdrawRewardsFee



