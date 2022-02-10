// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

/*
  ______                     ______                                 
 /      \                   /      \                                
|  ▓▓▓▓▓▓\ ______   ______ |  ▓▓▓▓▓▓\__   __   __  ______   ______  
| ▓▓__| ▓▓/      \ /      \| ▓▓___\▓▓  \ |  \ |  \|      \ /      \ 
| ▓▓    ▓▓  ▓▓▓▓▓▓\  ▓▓▓▓▓▓\\▓▓    \| ▓▓ | ▓▓ | ▓▓ \▓▓▓▓▓▓\  ▓▓▓▓▓▓\
| ▓▓▓▓▓▓▓▓ ▓▓  | ▓▓ ▓▓    ▓▓_\▓▓▓▓▓▓\ ▓▓ | ▓▓ | ▓▓/      ▓▓ ▓▓  | ▓▓
| ▓▓  | ▓▓ ▓▓__/ ▓▓ ▓▓▓▓▓▓▓▓  \__| ▓▓ ▓▓_/ ▓▓_/ ▓▓  ▓▓▓▓▓▓▓ ▓▓__/ ▓▓
| ▓▓  | ▓▓ ▓▓    ▓▓\▓▓     \\▓▓    ▓▓\▓▓   ▓▓   ▓▓\▓▓    ▓▓ ▓▓    ▓▓
 \▓▓   \▓▓ ▓▓▓▓▓▓▓  \▓▓▓▓▓▓▓ \▓▓▓▓▓▓  \▓▓▓▓▓\▓▓▓▓  \▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓ 
         | ▓▓                                             | ▓▓      
         | ▓▓                                             | ▓▓      
          \▓▓                                              \▓▓         

 * App:             https://apeswap.finance
 * Medium:          https://ape-swap.medium.com
 * Twitter:         https://twitter.com/ape_swap
 * Discord:         https://discord.com/invite/apeswap
 * Telegram:        https://t.me/ape_swap
 * Announcements:   https://t.me/ape_swap_news
 * GitHub:          https://github.com/ApeSwapFinance
 */

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../libs/IVaultApe.sol";
import "../libs/IBananaVault.sol";
import "../libs/IMasterApe.sol";
import "../libs/IUniRouter02.sol";
import "../libs/IStrategyMaximizerMasterApe.sol";
import "../libs/IMaximizerVaultApe.sol";

/// @title Strategy Maximizer - MasterApe
/// @author ApeSwapFinance
/// @notice MasterApe strategy for maximizer vaults
contract StrategyMaximizerMasterApe is
    IStrategyMaximizerMasterApe,
    Ownable,
    ReentrancyGuard
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct UserInfo {
        // How many assets the user has provided.
        uint256 stake;
        // How many staked $BANANA user had at his last action
        uint256 autoBananaShares;
        // Banana shares not entitled to the user
        uint256 rewardDebt;
        // Timestamp of last user deposit
        uint256 lastDepositedTime;
    }

    struct UseDefaultSettings {
        bool treasury;
        bool keeperFee;
        bool platform;
        bool platformFee;
        bool buyBackRate;
        bool withdrawFee;
        bool withdrawFeePeriod;
        bool withdrawRewardsFee;
    }

    IMaximizerVaultApe.Settings public settings;

    UseDefaultSettings public useDefaultSettings =
        UseDefaultSettings(true, true, true, true, true, true, true, true);

    // Addresses
    address public constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    IERC20 public constant BANANA =
        IERC20(0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95);
    address public constant BURN_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    // Runtime data
    mapping(address => UserInfo) public override userInfo; // Info of users
    uint256 public override accSharesPerStakedToken; // Accumulated BANANA_VAULT shares per staked token, times 1e18.

    // Farm info
    IMasterApe public immutable STAKED_TOKEN_FARM;
    address public override STAKED_TOKEN_ADDRESS;
    IERC20 public immutable STAKED_TOKEN;
    IERC20 public immutable FARM_REWARD_TOKEN;
    uint256 public immutable FARM_PID;
    bool public immutable IS_BANANA_STAKING;
    IBananaVault public immutable BANANA_VAULT;

    // Settings
    IUniRouter02 public immutable router;
    address[] public pathToBanana; // Path from staked token to BANANA
    address[] public pathToWbnb; // Path from staked token to WBNB

    IMaximizerVaultApe public override vaultApe;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EarlyWithdraw(address indexed user, uint256 amount, uint256 fee);
    event ClaimRewards(address indexed user, uint256 shares, uint256 amount);

    // Setting updates
    event SetPathToBanana(address[] oldPath, address[] newPath);
    event SetPathToWbnb(address[] oldPath, address[] newPath);
    event SetTreasury(address oldTreasury, address newTreasury);
    event SetPlatform(address oldPlatform, address newPlatform);
    event SetBuyBackRate(uint256 oldBuyBackRate, uint256 newBuyBackRate);
    event SetVaultApe(address oldVaultApe, address newVaultApe);
    event SetKeeperFee(uint256 oldKeeperFee, uint256 newKeeperFee);
    event SetPlatformFee(uint256 oldPlatformFee, uint256 newPlatformFee);
    event SetWithdrawRewardsFee(
        uint256 oldWithdrawRewardsFee,
        uint256 newWithdrawRewardsFee
    );
    event SetWithdrawFee(
        uint256 oldEarlyWithdrawFee,
        uint256 newEarlyWithdrawFee
    );

    constructor(
        address _masterApe,
        uint256 _farmPid,
        bool _isCakeStaking,
        address _stakedToken,
        address _farmRewardToken,
        address _bananaVault,
        address _router,
        address[] memory _pathToBanana,
        address[] memory _pathToWbnb,
        address[] memory _addresses //[_owner, _vaultApe]
    ) {
        require(
            _pathToBanana[0] == address(_farmRewardToken) &&
                _pathToBanana[_pathToBanana.length - 1] == address(BANANA),
            "StrategyMaximizerMasterApe: Incorrect path to BANANA"
        );

        require(
            _pathToWbnb[0] == address(_farmRewardToken) &&
                _pathToWbnb[_pathToWbnb.length - 1] == WBNB,
            "StrategyMaximizerMasterApe: Incorrect path to WBNB"
        );

        STAKED_TOKEN = IERC20(_stakedToken);
        STAKED_TOKEN_ADDRESS = _stakedToken;
        STAKED_TOKEN_FARM = IMasterApe(_masterApe);
        FARM_REWARD_TOKEN = IERC20(_farmRewardToken);
        FARM_PID = _farmPid;
        IS_BANANA_STAKING = _isCakeStaking;
        BANANA_VAULT = IBananaVault(_bananaVault);

        router = IUniRouter02(_router);
        pathToBanana = _pathToBanana;
        pathToWbnb = _pathToWbnb;

        transferOwnership(_addresses[0]);
        vaultApe = IMaximizerVaultApe(_addresses[1]);

        settings = vaultApe.getSettings();
    }

    /**
     * @dev Throws if called by any account other than the VaultApe.
     */
    modifier onlyVaultApe() {
        require(
            address(vaultApe) == msg.sender,
            "StrategyMaximizerMasterApe: caller is not the VaultApe"
        );
        _;
    }

    // 1. Harvest rewards
    // 2. Collect fees
    // 3. Convert rewards to $BANANA
    // 4. Stake to banana auto-compound vault
    /// @notice compound of vault
    /// @param _minPlatformOutput Minimum platform fee output
    /// @param _minKeeperOutput Minimum keeper fee output
    /// @param _minBurnOutput Minimum burn fee output
    /// @param _minBananaOutput Minimum banana output
    /// @param _takeKeeperFee Take keeper fee for chainlink keeper
    function earn(
        uint256 _minPlatformOutput,
        uint256 _minKeeperOutput,
        uint256 _minBurnOutput,
        uint256 _minBananaOutput,
        bool _takeKeeperFee
    ) external override onlyVaultApe {
        if (IS_BANANA_STAKING) {
            STAKED_TOKEN_FARM.leaveStaking(0);
        } else {
            STAKED_TOKEN_FARM.withdraw(FARM_PID, 0);
        }

        uint256 rewardTokenBalance = _rewardTokenBalance();

        // Collect platform fees
        if (getSettings().platformFee > 0) {
            _swap(
                rewardTokenBalance.mul(getSettings().platformFee).div(10000),
                _minPlatformOutput,
                pathToWbnb,
                getSettings().platform
            );
        }

        // Collect keeper fees
        if (_takeKeeperFee && getSettings().keeperFee > 0) {
            _swap(
                rewardTokenBalance.mul(getSettings().keeperFee).div(10000),
                _minKeeperOutput,
                pathToWbnb,
                getSettings().treasury
            );
        }

        // Convert remaining rewards to BANANA
        if (address(FARM_REWARD_TOKEN) != address(BANANA)) {
            // Collect Burn fees
            if (getSettings().buyBackRate > 0) {
                _swap(
                    rewardTokenBalance.mul(getSettings().buyBackRate).div(
                        10000
                    ),
                    _minBurnOutput,
                    pathToBanana,
                    BURN_ADDRESS
                );
            }

            _swap(
                _rewardTokenBalance(),
                _minBananaOutput,
                pathToBanana,
                address(this)
            );
        } else if (getSettings().buyBackRate > 0) {
            BANANA.transfer(
                BURN_ADDRESS,
                rewardTokenBalance.mul(getSettings().buyBackRate).div(10000)
            );
        }

        uint256 previousShares = totalAutoBananaShares();
        uint256 bananaBalance = _bananaBalance();

        _approveTokenIfNeeded(BANANA, bananaBalance, address(BANANA_VAULT));

        BANANA_VAULT.deposit(bananaBalance);

        uint256 currentShares = totalAutoBananaShares();

        accSharesPerStakedToken = accSharesPerStakedToken.add(
            currentShares.sub(previousShares).mul(1e18).div(totalStake())
        );
    }

    /// @notice deposit in vault
    /// @param _userAddress user address
    function deposit(address _userAddress)
        external
        override
        nonReentrant
        onlyVaultApe
    {
        uint256 _amount = STAKED_TOKEN.balanceOf(address(this));
        require(
            _amount > 0,
            "StrategyMaximizerMasterApe: amount must be greater than zero"
        );
        UserInfo storage user = userInfo[_userAddress];

        _approveTokenIfNeeded(
            STAKED_TOKEN,
            _amount,
            address(STAKED_TOKEN_FARM)
        );

        if (IS_BANANA_STAKING) {
            STAKED_TOKEN_FARM.enterStaking(_amount);
        } else {
            STAKED_TOKEN_FARM.deposit(FARM_PID, _amount);
        }

        user.autoBananaShares = user.autoBananaShares.add(
            user.stake.mul(accSharesPerStakedToken).div(1e18).sub(
                user.rewardDebt
            )
        );
        user.stake = user.stake.add(_amount);
        user.rewardDebt = user.stake.mul(accSharesPerStakedToken).div(1e18);
        user.lastDepositedTime = block.timestamp;
        emit Deposit(_userAddress, _amount);
    }

    /// @notice withdraw tokens from vault
    /// @param _userAddress user address
    /// @param _amount amount to withdraw
    function withdraw(address _userAddress, uint256 _amount)
        external
        override
        nonReentrant
        onlyVaultApe
    {
        UserInfo storage user = userInfo[_userAddress];

        require(
            _amount > 0,
            "StrategyMaximizerMasterApe: amount must be greater than zero"
        );
        _amount = user.stake < _amount ? user.stake : _amount;

        if (IS_BANANA_STAKING) {
            STAKED_TOKEN_FARM.leaveStaking(_amount);
        } else {
            STAKED_TOKEN_FARM.withdraw(FARM_PID, _amount);
        }

        uint256 currentAmount = _amount;

        if (
            getSettings().withdrawFee > 0 &&
            block.timestamp <
            user.lastDepositedTime.add(getSettings().withdrawFeePeriod)
        ) {
            // Take withdraw fees
            uint256 currentWithdrawFee = currentAmount
                .mul(getSettings().withdrawFee)
                .div(10000);
            STAKED_TOKEN.safeTransfer(
                getSettings().treasury,
                currentWithdrawFee
            );
            currentAmount = currentAmount.sub(currentWithdrawFee);
        }

        user.autoBananaShares = user.autoBananaShares.add(
            user.stake.mul(accSharesPerStakedToken).div(1e18).sub(
                user.rewardDebt
            )
        );
        user.stake = user.stake.sub(_amount);
        user.rewardDebt = user.stake.mul(accSharesPerStakedToken).div(1e18);

        // Withdraw banana rewards if user leaves
        if (user.stake == 0 && user.autoBananaShares > 0) {
            _claimRewards(_userAddress, user.autoBananaShares, false);
        }

        STAKED_TOKEN.safeTransfer(_userAddress, currentAmount);

        emit Withdraw(_userAddress, currentAmount);
    }

    /// @notice claim rewards
    /// @param _userAddress user address
    /// @param _shares shares to withdraw
    function claimRewards(address _userAddress, uint256 _shares)
        external
        override
        nonReentrant
        onlyVaultApe
    {
        _claimRewards(_userAddress, _shares, true);
    }

    function _claimRewards(
        address _userAddress,
        uint256 _shares,
        bool _update
    ) private {
        UserInfo storage user = userInfo[_userAddress];

        if (_update) {
            // Add claimable Banana to user state and update debt
            user.autoBananaShares = user.autoBananaShares.add(
                user.stake.mul(accSharesPerStakedToken).div(1e18).sub(
                    user.rewardDebt
                )
            );

            user.rewardDebt = user.stake.mul(accSharesPerStakedToken).div(1e18);
        }

        // require(
        //     user.autoBananaShares >= _shares,
        //     "SweetVault: claim amount exceeds balance"
        // );
        _shares = user.autoBananaShares < _shares
            ? user.autoBananaShares
            : _shares;

        user.autoBananaShares = user.autoBananaShares.sub(_shares);

        uint256 bananaBalanceBefore = _bananaBalance();

        BANANA_VAULT.withdraw(_shares);

        uint256 withdrawAmount = _bananaBalance().sub(bananaBalanceBefore);

        if (getSettings().withdrawRewardsFee > 0) {
            uint256 rewardFee = withdrawAmount
                .mul(getSettings().withdrawRewardsFee)
                .div(10000);
            _safeBANANATransfer(getSettings().treasury, rewardFee);
            withdrawAmount = withdrawAmount.sub(rewardFee);
        }

        _safeBANANATransfer(_userAddress, withdrawAmount);

        emit ClaimRewards(_userAddress, _shares, withdrawAmount);
    }

    /// @notice Using total harvestable rewards as the input, find the outputs for each respective output
    /// @return platformOutput WBNB output amount which goes to the platform
    /// @return keeperOutput WBNB output amount which goes to the keeper
    /// @return burnOutput BANANA amount which goes to the burn address
    /// @return bananaOutput BANANA amount which goes to compounding
    function getExpectedOutputs()
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
        // Find the expected BANANA value of the current harvestable rewards
        uint256 bananaOutputWithoutFees = _getExpectedOutput(pathToBanana);
        // Calculate the WBNB values
        platformOutput = wbnbOutput.mul(getSettings().platformFee).div(10000);
        keeperOutput = wbnbOutput.mul(getSettings().keeperFee).div(10000);
        // Calculate the BANANA values
        burnOutput = bananaOutputWithoutFees.mul(getSettings().buyBackRate).div(
                10000
            );
        bananaOutput = bananaOutputWithoutFees.sub(
            bananaOutputWithoutFees
                .mul(getSettings().platformFee)
                .div(10000)
                .add(
                    bananaOutputWithoutFees.mul(getSettings().keeperFee).div(
                        10000
                    )
                )
                .add(
                    bananaOutputWithoutFees.mul(getSettings().buyBackRate).div(
                        10000
                    )
                )
        );
    }

    /// @notice Using total rewards as the input, find the output based on the path provided
    /// @param _path Array of token addresses which compose the path from index 0 to n
    /// @return Reward output amount based on path
    function _getExpectedOutput(address[] memory _path)
        private
        view
        returns (uint256)
    {
        uint256 rewards = _rewardTokenBalance().add(
            STAKED_TOKEN_FARM.pendingCake(FARM_PID, address(this))
        );

        if (_path.length <= 1 || rewards == 0) {
            return rewards;
        } else {
            uint256[] memory amounts = router.getAmountsOut(rewards, _path);
            return amounts[amounts.length.sub(1)];
        }
    }

    /// @notice Get all balances of a user
    /// @param _userAddress user address
    /// @return stake
    /// @return banana
    /// @return autoBananaShares
    //TODO: does this need to be accessible from vaultApe?
    function balanceOf(address _userAddress)
        external
        view
        returns (
            uint256 stake,
            uint256 banana,
            uint256 autoBananaShares
        )
    {
        UserInfo memory user = userInfo[_userAddress];

        uint256 pendingShares = user
            .stake
            .mul(accSharesPerStakedToken)
            .div(1e18)
            .sub(user.rewardDebt);

        stake = user.stake; 
        autoBananaShares = user.autoBananaShares.add(pendingShares);
        banana = autoBananaShares.mul(BANANA_VAULT.getPricePerFullShare()).div(1e18);
    }

    function _approveTokenIfNeeded(
        IERC20 _token,
        uint256 _amount,
        address _spender
    ) private {
        if (_token.allowance(address(this), _spender) < _amount) {
            _token.safeIncreaseAllowance(_spender, _amount);
        }
    }

    function _rewardTokenBalance() private view returns (uint256) {
        return FARM_REWARD_TOKEN.balanceOf(address(this));
    }

    function _bananaBalance() private view returns (uint256) {
        return BANANA.balanceOf(address(this));
    }

    /// @notice total staked tokens of vault in farm
    /// @return total staked tokens of vault in farm
    function totalStake() public view override returns (uint256) {
        (uint256 amount, ) = STAKED_TOKEN_FARM.userInfo(
            FARM_PID,
            address(this)
        );
        return amount;
    }

    /// @notice total rewarded banana shares in banana vault
    /// @return total rewarded banana shares in banana vault
    function totalAutoBananaShares() public view returns (uint256) {
        (uint256 shares, , , ) = BANANA_VAULT.userInfo(address(this));
        return shares;
    }

    // Safe BANANA transfer function, just in case if rounding error causes pool to not have enough
    function _safeBANANATransfer(address _to, uint256 _amount) private {
        uint256 balance = _bananaBalance();

        if (_amount > balance) {
            BANANA.transfer(_to, balance);
        } else {
            BANANA.transfer(_to, _amount);
        }
    }

    function _swap(
        uint256 _inputAmount,
        uint256 _minOutputAmount,
        address[] memory _path,
        address _to
    ) private {
        _approveTokenIfNeeded(FARM_REWARD_TOKEN, _inputAmount, address(router));

        router.swapExactTokensForTokens(
            _inputAmount,
            _minOutputAmount,
            _path,
            _to,
            block.timestamp
        );
    }

    function getSettings()
        public
        view
        returns (IMaximizerVaultApe.Settings memory)
    {
        IMaximizerVaultApe.Settings memory defaultSettings = vaultApe
            .getSettings();

        address treasury = useDefaultSettings.treasury
            ? defaultSettings.treasury
            : settings.treasury;
        uint256 keeperFee = useDefaultSettings.keeperFee
            ? defaultSettings.keeperFee
            : settings.keeperFee;
        address platform = useDefaultSettings.platform
            ? defaultSettings.platform
            : settings.platform;
        uint256 platformFee = useDefaultSettings.platformFee
            ? defaultSettings.platformFee
            : settings.platformFee;
        uint256 buyBackRate = useDefaultSettings.buyBackRate
            ? defaultSettings.buyBackRate
            : settings.buyBackRate;
        uint256 withdrawFee = useDefaultSettings.withdrawFee
            ? defaultSettings.withdrawFee
            : settings.withdrawFee;
        uint256 withdrawFeePeriod = useDefaultSettings.withdrawFeePeriod
            ? defaultSettings.withdrawFeePeriod
            : settings.withdrawFeePeriod;
        uint256 withdrawRewardsFee = useDefaultSettings.withdrawRewardsFee
            ? defaultSettings.withdrawRewardsFee
            : settings.withdrawRewardsFee;

        IMaximizerVaultApe.Settings memory actualSettings = IMaximizerVaultApe
            .Settings(
                treasury,
                keeperFee,
                platform,
                platformFee,
                buyBackRate,
                withdrawFee,
                withdrawFeePeriod,
                withdrawRewardsFee
            );
        return actualSettings;
    }

    function setPathToBanana(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == address(BANANA),
            "StrategyMaximizerMasterApe: Incorrect path to BANANA"
        );

        address[] memory oldPath = pathToBanana;

        pathToBanana = _path;

        emit SetPathToBanana(oldPath, pathToBanana);
    }

    function setPathToWbnb(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == WBNB,
            "StrategyMaximizerMasterApe: Incorrect path to WBNB"
        );

        address[] memory oldPath = pathToWbnb;

        pathToWbnb = _path;

        emit SetPathToWbnb(oldPath, pathToWbnb);
    }

    //TODO: Do we need this?
    function setVaultApe(address _vaultApe) external onlyOwner {
        emit SetVaultApe(address(vaultApe), _vaultApe);
        vaultApe = IMaximizerVaultApe(_vaultApe);
    }

    function setPlatform(address _platform, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.platform = _useDefault;
        emit SetPlatform(settings.platform, _platform);
        settings.platform = _platform;
    }

    function setTreasury(address _treasury, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.treasury = _useDefault;
        emit SetTreasury(settings.treasury, _treasury);
        settings.treasury = _treasury;
    }

    function setKeeperFee(uint256 _keeperFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _keeperFee <= IMaximizerVaultApe(vaultApe).KEEPER_FEE_UL(),
            "StrategyMaximizerMasterApe: Keeper fee too high"
        );
        useDefaultSettings.keeperFee = _useDefault;
        emit SetKeeperFee(settings.keeperFee, _keeperFee);
        settings.keeperFee = _keeperFee;
    }

    function setPlatformFee(uint256 _platformFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _platformFee <= IMaximizerVaultApe(vaultApe).PLATFORM_FEE_UL(),
            "StrategyMaximizerMasterApe: Platform fee too high"
        );
        useDefaultSettings.platformFee = _useDefault;
        emit SetPlatformFee(settings.platformFee, _platformFee);
        settings.platformFee = _platformFee;
    }

    function setBuyBackRate(uint256 _buyBackRate, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _buyBackRate <= IMaximizerVaultApe(vaultApe).BUYBACK_RATE_UL(),
            "StrategyMaximizerMasterApe: Buy back rate too high"
        );
        useDefaultSettings.buyBackRate = _useDefault;
        emit SetBuyBackRate(settings.buyBackRate, _buyBackRate);
        settings.buyBackRate = _buyBackRate;
    }

    function setWithdrawFee(uint256 _withdrawFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _withdrawFee <= IMaximizerVaultApe(vaultApe).WITHDRAW_FEE_UL(),
            "StrategyMaximizerMasterApe: Early withdraw fee too high"
        );
        useDefaultSettings.withdrawFee = _useDefault;
        emit SetWithdrawFee(settings.withdrawFee, _withdrawFee);
        settings.withdrawFee = _withdrawFee;
    }

    function setWithdrawFeePeriod(uint256 _withdrawFeePeriod, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.withdrawFeePeriod = _useDefault;
        emit SetWithdrawFee(settings.withdrawFeePeriod, _withdrawFeePeriod);
        settings.withdrawFeePeriod = _withdrawFeePeriod;
    }

    function setWithdrawRewardsFee(
        uint256 _withdrawRewardsFee,
        bool _useDefault
    ) external onlyOwner {
        useDefaultSettings.withdrawRewardsFee = _useDefault;
        emit SetWithdrawRewardsFee(
            settings.withdrawRewardsFee,
            _withdrawRewardsFee
        );
        settings.withdrawRewardsFee = _withdrawRewardsFee;
    }
}
