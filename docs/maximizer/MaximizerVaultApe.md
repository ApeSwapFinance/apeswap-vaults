## `MaximizerVaultApe`

int256[] minPlatformOutputs;
        uint256[] minKeeperOutputs;
        uint256[] minBurnOutputs;
        uint256[] minBanan



### `onlyEOA()`






### `constructor(address _owner, address _bananaVault, address _defaultTreasury, address _defaultPlatform)` (public)





### `checkVaultCompound() → bool upkeepNeeded, bytes performData` (public)

h),
            new uint256[](totalLength),
            new uin



### `earnAll()` (external)

x < _pids.length; index++) {
            _earn



### `earnSome(uint256[] _pids)` (external)

external {
        _earn(_pid, true);
    }

    function _earn(uint256 _pid, bool _revert) priva



### `earn(uint256 _pid)` (external)

address vaultAddress = vaults[_pid];
        VaultInfo memory vaultInfo = vaultInfo



### `_compoundVault(address _vault, uint256 _minPlatformOutput, uint256 _minKeeperOutput, uint256 _minBurnOutput, uint256 _minBananaOutput, uint256 timestamp, bool _takeKeeperFee)` (internal)





### `vaultsLength() → uint256` (external)

uint256 autoBananaShares,



### `userInfo(uint256 _pid, address _user) → uint256 stake, uint256 autoBananaShares, uint256 rewardDebt, uint256 lastDepositedTime` (external)

erApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        (stake, autoBananaShares



### `stakedWantTokens(uint256 _pid, address _user) → uint256` (external)

nfo(_user);
        return stake;
    }

Get shares per staked token of a specific vault
@para



### `accSharesPerStakedToken(uint256 _pid) → uint256` (external)

vault




### `deposit(uint256 _pid, uint256 _wantAmt)` (external)

aultApe: vault is disabled");

        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaultAddres



### `withdraw(uint256 _pid, uint256 _wantAmt)` (external)

User withdraw all for specific vault




### `withdrawAll(uint256 _pid)` (external)





### `harvest(uint256 _pid, uint256 _wantAmt)` (external)

;
    }

User harvest all rewards for specific vault




### `harvestAll(uint256 _pid)` (external)

ss


Only callable by the contrac

### `addVault(address _vault)` (public)

s32 DEPOSIT_ROLE = BANANA_VAULT.DEPOSIT_ROLE();
        BANANA_VAULT.grantRole(DEPOSIT_ROLE, _vault);

        vaults.push(_va



### `addVaults(address[] _vaults)` (public)

{
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function enableVault(address _vault) exter



### `inCaseTokensGetStuck(address _token, uint256 _amount)` (external)





### `enableVault(address _vault)` (external)





### `disableVault(address _vault)` (external)





### `setModerator(address _moderator)` (public)





### `setMaxDelay(uint256 _maxDelay)` (public)





### `setMinKeeperFee(uint256 _minKeeperFee)` (public)





### `setSlippageFactor(uint256 _slippageFactor)` (public)





### `setMaxVaults(uint16 _maxVaults)` (public)





### `setTreasuryAllStrategies(address _treasury)` (external)





### `setKeeperFeeAllStrategies(uint256 _keeperFee)` (external)





### `setPlatformAllStrategies(address _platform)` (external)





### `setPlatformFeeAllStrategies(uint256 _platformFee)` (external)





### `setBuyBackRateAllStrategies(uint256 _buyBackRate)` (external)





### `setWithdrawFeeAllStrategies(uint256 _withdrawFee)` (external)





### `setWithdrawFeePeriodAllStrategies(uint256 _withdrawFeePeriod)` (external)





### `setVaultApeAllStrategies(address _vaultApe)` (external)





### `setWithdrawRewardsFeeAllStrategies(uint256 _withdrawRewardsFee)` (external)





### `setDefaultTreasury(address _defaultTreasury)` (external)





### `setDefaultKeeperFee(uint256 _defaultKeeperFee)` (external)





### `setDefaultPlatform(address _defaultPlatform)` (external)





### `setDefaultPlatformFee(uint256 _defaultPlatformFee)` (external)





### `setDefaultBuyBackRate(uint256 _defaultBuyBackRate)` (external)





### `setDefaultWithdrawFee(uint256 _defaultWithdrawFee)` (external)





### `setDefaultWithdrawFeePeriod(uint256 _defaultWithdrawFeePeriod)` (external)





### `setDefaulWithdrawRewardsFee(uint256 _defaulWithdrawRewardsFee)` (external)






### `Compound(address vault, uint256 timestamp)`





