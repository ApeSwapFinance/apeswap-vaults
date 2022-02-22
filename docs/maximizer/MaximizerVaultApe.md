## `MaximizerVaultApe`

6[] minPlatformOutputs;
        uint256[] minKeeperOutputs;
        uint256[] minBurnOutputs;
        uint256[] minBananaOutp




### `constructor(address _owner, address _bananaVault, uint256 _maxDelay, struct IMaximizerVaultApe.Settings _settings)` (public)





### `getSettings() → struct IMaximizerVaultApe.Settings` (public)





### `checkVaultCompound() → bool upkeepNeeded, bytes performData` (public)

empCompoundInfo = CompoundInfo(
            new address[](totalLength),
            new uint256[](totalLength),
            new uint256[](totalLength),
            new uint256[](totalL



### `earnAll()` (external)

length; index++) {
            _earn(_pids[inde



### `earnSome(uint256[] _pids)` (external)

_earn(_pid, true);
    }

    function _earn(uint256 _pid, bool _revert) private {



### `earn(uint256 _pid)` (external)

aultAddress = vaults[_pid];
        VaultInfo memory vaultInfo = vaultInfos[vaultAddress



### `_compoundVault(address _vault, uint256 _minPlatformOutput, uint256 _minKeeperOutput, uint256 _minBurnOutput, uint256 _minBananaOutput, uint256 timestamp, bool _takeKeeperFee)` (internal)





### `vaultsLength() → uint256` (external)

= IStrategyMaximizerMasterApe(
            vaults[_pid]
        )



### `balanceOf(uint256 _pid, address _user) → uint256 stake, uint256 banana, uint256 autoBananaShares` (external)





### `userInfo(uint256 _pid, address _user) → uint256 stake, uint256 autoBananaShares, uint256 rewardDebt, uint256 lastDepositedTime` (external)

nt256 rewardDebt,
            uint256 lastDepositedTime
        )
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        (stake, autoBananaShares, rewardDebt, l



### `stakedWantTokens(uint256 _pid, address _user) → uint256` (external)

(uint256 stake, , , ) = strat.userInfo(_user);
        return stake;
    }

Get shares per staked token of a specific vault




### `accSharesPerStakedToken(uint256 _pid) → uint256` (external)

User deposit for specific vault




### `deposit(uint256 _pid, uint256 _wantAmt)` (external)

);

        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaultAddress
        );
        IERC20



### `withdraw(uint256 _pid, uint256 _wantAmt)` (external)

User withdraw all for specific vault




### `withdrawAll(uint256 _pid)` (external)

aram _wantAmt amount of reward tokens to claim
    function harvest(uint256 _pid,



### `harvest(uint256 _pid, uint256 _wantAmt)` (external)

User harvest all rewards for specific vault




### `harvestAll(uint256 _pid)` (external)



Only callable by the contract owner

### `addVault(address _vault)` (public)

address(IStrategyMaximizerMasterApe(_vault).vaultApe()) ==
                address(this),
            "strategy vault ape n



### `addVaults(address[] _vaults)` (public)

IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function enableVault(uint256 _vaultPid) external onlyOwn



### `inCaseTokensGetStuck(address _token, uint256 _amount)` (external)





### `enableVault(uint256 _vaultPid)` (external)





### `disableVault(uint256 _vaultPid)` (external)





### `setModerator(address _moderator)` (public)





### `setMaxDelay(uint256 _maxDelay)` (public)





### `setMinKeeperFee(uint256 _minKeeperFee)` (public)





### `setSlippageFactor(uint256 _slippageFactor)` (public)





### `setMaxVaults(uint16 _maxVaults)` (public)





### `setTreasury(address _treasury)` (external)





### `setPlatform(address _platform)` (external)





### `setKeeperFee(uint256 _keeperFee)` (external)





### `setPlatformFee(uint256 _platformFee)` (external)





### `setBuyBackRate(uint256 _buyBackRate)` (external)





### `setWithdrawFee(uint256 _withdrawFee)` (external)





### `setWithdrawFeePeriod(uint256 _withdrawFeePeriod)` (external)





### `setWithdrawRewardsFee(uint256 _withdrawRewardsFee)` (external)






### `Compound(address vault, uint256 timestamp)`





### `ChangedTreasury(address _old, address _new)`





### `ChangedPlatform(address _old, address _new)`





### `ChangedKeeperFee(uint256 _old, uint256 _new)`





### `ChangedPlatformFee(uint256 _old, uint256 _new)`





### `ChangedBuyBackRate(uint256 _old, uint256 _new)`





### `ChangedWithdrawFee(uint256 _old, uint256 _new)`





### `ChangedWithdrawFeePeriod(uint256 _old, uint256 _new)`





### `ChangedWithdrawRewardsFee(uint256 _old, uint256 _new)`





### `VaultAdded(address _vaultAddress)`





### `VaultEnabled(uint256 _vaultPid, address _vaultAddress)`





### `VaultDisabled(uint256 _vaultPid, address _vaultAddress)`





### `ChangedModerator(address _address)`





### `ChangedMaxDelay(uint256 _new)`





### `ChangedMinKeeperFee(uint256 _new)`





### `ChangedSlippageFactor(uint256 _new)`





### `ChangedMaxVaults(uint256 _new)`






### `VaultInfo`


uint256 lastCompound


bool enabled


### `CompoundInfo`


address[] vaults


uint256[] minPlatformOutputs


uint256[] minKeeperOutputs


uint256[] minBurnOutputs


uint256[] minBananaOutputs



