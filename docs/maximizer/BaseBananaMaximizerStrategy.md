## `BaseBananaMaximizerStrategy`

ares;
        // Banana shares not entitled to the user
        uint256 rewardDebt;
        // Timestamp of last user dep



### `onlyVaultApe()`

anaShares
    function balanceOf(address _userAddress)
        external




### `totalStake() → uint256` (public)





### `_vaultDeposit(uint256 _amount)` (internal)





### `_vaultWithdraw(uint256 _amount)` (internal)





### `_vaultHarvest()` (internal)





### `_beforeDeposit(address _from)` (internal)





### `_beforeWithdraw(address _from)` (internal)





### `_getExpectedOutput(address[] _path) → uint256` (internal)





### `constructor(address _stakeToken, address _farmRewardToken, address _bananaVault, address _router, address[] _pathToBanana, address[] _pathToWbnb, address[] _addresses)` (internal)





### `balanceOf(address _userAddress) → uint256 stake, uint256 banana, uint256 autoBananaShares` (external)

();

        UserInfo memory user = userInfo[_userAddress];

        uint256 pendingShares = ((user.stake * accSharesPerStakedToken) / 1e18) - user.rewardDeb



### `getExpectedOutputs() → uint256 platformOutput, uint256 keeperOutput, uint256 burnOutput, uint256 bananaOutput` (external)

()
        external
        view
        returns (
            uint256 platformOutput,
            uint256 keeperOutput,
            uint256 burnOutput,
            uint256 bananaOutput
        )
    {
        IMaximizerVaultApe.Settings memory settings = getSettings();

        // Find the expected WBNB value of the current harvestable rewards
        uint256 wbnbOutput = _getExpectedOutp



### `deposit(address _userAddress, uint256 _amount)` (external)

rInfo[_userAddress];
        // Update autoBananaShares
        user.



### `withdraw(address _userAddress, uint256 _amount)` (external)

UserInfo storage user = userInfo[_userAddress];
        uint256 currentAmount = user.stake < _amount ? user.stake



### `claimRewards(address _userAddress, uint256 _shares)` (external)

mpound vault
compound of vault




### `earn(uint256 _minPlatformOutput, uint256 _minKeeperOutput, uint256 _minBurnOutput, uint256 _minBananaOutput, bool _takeKeeperFee)` (public)

nt256 _minBurnOutput,
        uint256 _minBananaOutput,
        bool _takeKeeperFee
    ) public {
        _vaultHarvest();

        IMaximizerVaultApe.Settings memory settings = getSettings();
        uint256 rewardTokenBalance = _rewardTokenBalance();

        // Collect platform fees
        if (settings.platformFee > 0



### `getSettings() → struct IMaximizerVaultApe.Settings` (public)

nt256 keeperFee = useDefaultSettings.keeperFee
            ? defa



### `_farm() → uint256` (internal)





### `_bananaVaultWithdraw(address _userAddress, uint256 _shares, bool _update)` (internal)





### `_bananaVaultDeposit(bool _takeFee)` (internal)





### `_rewardTokenBalance() → uint256` (internal)





### `_bananaBalance() → uint256` (internal)





### `totalAutoBananaShares() → uint256` (public)

d banana shares in banana vault
    function totalBanana() public view returns (uint256) {
        uint256 autoBanana = (total



### `totalBanana() → uint256` (public)

unding error causes pool to not have enough
    function _safeBANANATransfer(address _to, uint256 _amount) internal {
        uint256 balance = _bananaBal



### `_safeBANANATransfer(address _to, uint256 _amount)` (internal)





### `_swap(uint256 _inputAmount, uint256 _minOutputAmount, address[] _path, address _to)` (internal)





### `_approveTokenIfNeeded(contract IERC20 _token, uint256 _amount, address _spender)` (internal)





### `setPathToBanana(address[] _path)` (external)

thToBanana, _path);
        pathToBanana = _path;
    }

set path from reward token to wbnb



### `setPathToWbnb(address[] _path)` (external)

pathToWbnb = _path;
    }

set platform address




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
        strategySetting



### `setPlatformFee(uint256 _platformFee, bool _useDefault)` (external)

);
        useDefaultSettings.platformFee = _useDefault;
        emit SetPlatformFee(
            strategySettings.platformFee,
            _platfor



### `setBuyBackRate(uint256 _buyBackRate, bool _useDefault)` (external)

o high"
        );
        useDefaultSettings.buyBackRate = _useDefault;
        emit SetBuyBackRate(
            strategySettings.buyBackRate,
            _buyBac



### `setWithdrawFee(uint256 _withdrawFee, bool _useDefault)` (external)

igh"
        );
        useDefaultSettings.withdrawFee = _useDefault;
        emit SetWithdrawFee(
            strategySettings.withdrawFee,
            _w



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





### `Withdraw(address user, uint256 amount, uint256 withdrawFee)`





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



