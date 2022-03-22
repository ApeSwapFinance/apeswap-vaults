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
import "@openzeppelin/contracts/access/Ownable.sol";

import "../libs/IVaultApe.sol";
import "../libs/IBananaVault.sol";
import "../libs/IMasterApe.sol";
import "../libs/IUniRouter02.sol";
import "../libs/IStrategyMaximizerMasterApe.sol";
import "../libs/IMaximizerVaultApe.sol";

/// @title Base BANANA Maximizer Strategy
/// @author ApeSwapFinance
/// @notice MasterApe strategy for maximizer vaults
abstract contract BaseBananaMaximizerStrategy is
    Ownable,
    ReentrancyGuard
{
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

    IMaximizerVaultApe.Settings public strategySettings;

    UseDefaultSettings public useDefaultSettings =
        UseDefaultSettings(true, true, true, true, true, true, true, true);

    // Addresses
    address public immutable WBNB;
    IERC20 public immutable BANANA;
    address public constant BURN_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    // Runtime data
    mapping(address => UserInfo) public userInfo; // Info of users
    uint256 public accSharesPerStakedToken; // Accumulated BANANA_VAULT shares per staked token, times 1e18.
    uint256 private unallocatedShares;

    // Vault info
    address public immutable STAKE_TOKEN_ADDRESS;
    IERC20 public immutable STAKE_TOKEN;
    IERC20 public immutable FARM_REWARD_TOKEN;
    IBananaVault public immutable BANANA_VAULT;

    // Settings
    IUniRouter02 public immutable router;
    address[] public pathToBanana; // Path from staked token to BANANA
    address[] public pathToWbnb; // Path from staked token to WBNB

    IMaximizerVaultApe public immutable vaultApe;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount, uint256 withdrawFee);
    event ClaimRewards(address indexed user, uint256 shares, uint256 amount);

    // Setting updates
    event SetPathToBanana(address[] oldPath, address[] newPath);
    event SetPathToWbnb(address[] oldPath, address[] newPath);
    event SetTreasury(
        address oldTreasury,
        address newTreasury,
        bool useDefaultFee
    );
    event SetPlatform(
        address oldPlatform,
        address newPlatform,
        bool useDefaultFee
    );
    event SetBuyBackRate(
        uint256 oldBuyBackRate,
        uint256 newBuyBackRate,
        bool useDefaultFee
    );
    event SetKeeperFee(
        uint256 oldKeeperFee,
        uint256 newKeeperFee,
        bool useDefaultFee
    );
    event SetPlatformFee(
        uint256 oldPlatformFee,
        uint256 newPlatformFee,
        bool useDefaultFee
    );
    event SetWithdrawRewardsFee(
        uint256 oldWithdrawRewardsFee,
        uint256 newWithdrawRewardsFee,
        bool useDefaultFee
    );
    event SetWithdrawFee(
        uint256 oldEarlyWithdrawFee,
        uint256 newEarlyWithdrawFee,
        bool useDefaultFee
    );

    function totalStake() public virtual view returns (uint256);
    function _vaultDeposit(uint256 _amount) internal virtual;
    function _vaultWithdraw(uint256 _amount) internal virtual;
    function _vaultHarvest() internal virtual;
    function _beforeDeposit(address _from) internal virtual;
    function _beforeWithdraw(address _from) internal virtual;
    function _getExpectedOutput(address[] memory _path) internal virtual view returns (uint256);

    constructor(
        address _stakeToken,
        address _farmRewardToken,
        address _bananaVault,
        address _router,
        address[] memory _pathToBanana,
        address[] memory _pathToWbnb,
        address[] memory _addresses //[_owner, _vaultApe]
    ) {
        IBananaVault bananaVault = IBananaVault(_bananaVault);
        address bananaTokenAddress = bananaVault.bananaToken();
        IUniRouter02 uniRouter = IUniRouter02(_router);
        address wbnbAddress = uniRouter.WETH();
        require(
            _pathToBanana[0] == address(_farmRewardToken) &&
                _pathToBanana[_pathToBanana.length - 1] == bananaTokenAddress,
            "BaseBananaMaximizerStrategy: Incorrect path to BANANA"
        );

        require(
            _pathToWbnb[0] == address(_farmRewardToken) &&
                _pathToWbnb[_pathToWbnb.length - 1] == wbnbAddress,
            "BaseBananaMaximizerStrategy: Incorrect path to WBNB"
        );

        STAKE_TOKEN = IERC20(_stakeToken);
        STAKE_TOKEN_ADDRESS = _stakeToken;
        FARM_REWARD_TOKEN = IERC20(_farmRewardToken);
        BANANA_VAULT = bananaVault;
        BANANA = IERC20(bananaTokenAddress);
        WBNB = wbnbAddress;

        router = uniRouter;
        pathToBanana = _pathToBanana;
        pathToWbnb = _pathToWbnb;

        _transferOwnership(_addresses[0]);
        vaultApe = IMaximizerVaultApe(_addresses[1]);
        // Can't access immutable variables in constructor
        strategySettings = IMaximizerVaultApe(_addresses[1]).getSettings();
    }

    /**
     * @dev Throws if called by any account other than the VaultApe.
     */
    modifier onlyVaultApe() {
        require(
            address(vaultApe) == msg.sender,
            "BaseBananaMaximizerStrategy: caller is not the VaultApe"
        );
        _;
    }

    /// @notice deposit in vault
    /// @param _userAddress user address
    function deposit(address _userAddress, uint256 _amount)
        external
        nonReentrant
        onlyVaultApe
    {
        require(
            _amount > 0,
            "BaseBananaMaximizerStrategy: amount must be greater than zero"
        );
        _beforeDeposit(_userAddress);
    
        uint256 deposited = _farm();
        // Update userInfo
        UserInfo storage user = userInfo[_userAddress];
        user.stake += deposited;
        user.lastDepositedTime = block.timestamp;
        // Update autoBananaShares
        user.autoBananaShares += ((user.stake * accSharesPerStakedToken) /  1e18) - user.rewardDebt;
        user.rewardDebt = (user.stake * accSharesPerStakedToken) /  1e18;

        emit Deposit(_userAddress, deposited);
    }

    function _farm() internal returns (uint256) {
        uint256 stakeTokenBalance = IERC20(STAKE_TOKEN).balanceOf(address(this));
        if (stakeTokenBalance == 0) return 0;
        
        uint256 stakeBefore = totalStake();
        _vaultDeposit(stakeTokenBalance);
        _bananaVaultDeposit();
        uint256 stakeAfter = totalStake();
        
        return stakeAfter - stakeBefore;
    }

    /// @notice withdraw tokens from vault
    /// @param _userAddress user address
    /// @param _amount amount to withdraw
    function withdraw(address _userAddress, uint256 _amount)
        external
        nonReentrant
        onlyVaultApe
    {
        require(
            _amount > 0,
            "BaseBananaMaximizerStrategy: amount must be greater than zero"
        );
        _beforeWithdraw(_userAddress);        
        UserInfo storage user = userInfo[_userAddress];
        uint256 currentAmount = user.stake < _amount ? user.stake : _amount;

        uint256 stakeTokenBalance = IERC20(STAKE_TOKEN).balanceOf(address(this));

        if (currentAmount > stakeTokenBalance) {
            _vaultWithdraw(currentAmount - stakeTokenBalance);
            stakeTokenBalance = IERC20(STAKE_TOKEN).balanceOf(address(this));
        }

        IMaximizerVaultApe.Settings memory settings = getSettings();
        // Handle stake token
        uint256 withdrawFee = 0;
        if (
            settings.withdrawFee > 0 &&
            block.timestamp <
            (user.lastDepositedTime + settings.withdrawFeePeriod)
        ) {
            // Take withdraw fees
            withdrawFee = (currentAmount * settings.withdrawFee) / 10000;
            STAKE_TOKEN.safeTransfer(settings.treasury, withdrawFee);
        }
        STAKE_TOKEN.safeTransfer(_userAddress, currentAmount - withdrawFee);

        user.autoBananaShares += ((user.stake * accSharesPerStakedToken) /  1e18) - user.rewardDebt;
        // Setting order so that rewardDebt is zero when withdrawing all 
        user.stake -= currentAmount;
        user.rewardDebt = (user.stake * accSharesPerStakedToken) / 1e18;
        // Withdraw banana rewards if user leaves
        if (user.stake == 0 && user.autoBananaShares > 0) {
            // Not updating in the withdraw as it's accomplished above
            _bananaVaultWithdraw(_userAddress, user.autoBananaShares, false);
        }

        emit Withdraw(_userAddress, currentAmount - withdrawFee, withdrawFee);
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
    ) public {
        _vaultHarvest();

        IMaximizerVaultApe.Settings memory settings = getSettings();
        uint256 rewardTokenBalance = _rewardTokenBalance();

        // Collect platform fees
        if (settings.platformFee > 0) {
            _swap(
                (rewardTokenBalance * settings.platformFee) / 10000,
                _minPlatformOutput,
                pathToWbnb,
                settings.platform
            );
        }

        // Collect keeper fees
        if (_takeKeeperFee && settings.keeperFee > 0) {
            _swap(
                (rewardTokenBalance * settings.keeperFee) / 10000,
                _minKeeperOutput,
                pathToWbnb,
                settings.treasury
            );
        }

        // Convert remaining rewards to BANANA
        if (address(FARM_REWARD_TOKEN) != address(BANANA)) {
            // Collect Burn fees
            if (settings.buyBackRate > 0) {
                _swap(
                    (rewardTokenBalance * settings.buyBackRate) / 10000,
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
        } else if (settings.buyBackRate > 0) {
            BANANA.transfer(
                BURN_ADDRESS,
                (rewardTokenBalance * settings.buyBackRate) / 10000
            );
        }
        // Earns on deposits
        _bananaVaultDeposit();
    }

    /// @notice claim rewards
    /// @param _userAddress user address
    /// @param _shares shares to withdraw
    function claimRewards(address _userAddress, uint256 _shares)
        external
        nonReentrant
        onlyVaultApe
    {
        _bananaVaultWithdraw(_userAddress, _shares, true);
    }

    function _bananaVaultWithdraw(
        address _userAddress,
        uint256 _shares,
        bool _update
    ) internal {
        IMaximizerVaultApe.Settings memory settings = getSettings();
        UserInfo storage user = userInfo[_userAddress];

        if (_update) {
            // Add claimable Banana to user state and update debt
            user.autoBananaShares += ((user.stake * accSharesPerStakedToken) / 1e18) - user.rewardDebt;
            user.rewardDebt = (user.stake * accSharesPerStakedToken) / 1e18;
        }

        uint256 currentShares = user.autoBananaShares < _shares
            ? user.autoBananaShares
            : _shares;
        user.autoBananaShares -= currentShares;

        uint256 pricePerFullShare = BANANA_VAULT.getPricePerFullShare();
        uint256 bananaToWithdraw = (currentShares * pricePerFullShare) / 1e18;
        uint256 bananaBalance = _bananaBalance();
        uint256 bananaShareBalance = (bananaBalance * 1e18) / pricePerFullShare;
        uint256 totalStrategyBanana = totalBanana();

        if (bananaToWithdraw > totalStrategyBanana) {
            bananaToWithdraw = totalStrategyBanana;
            currentShares = (bananaToWithdraw * 1e18) / pricePerFullShare;
        }

        if (currentShares > bananaShareBalance) {
            BANANA_VAULT.withdraw(currentShares - bananaShareBalance);
            bananaBalance = _bananaBalance();
        }

        if (bananaToWithdraw > bananaBalance) {
            bananaToWithdraw = bananaBalance;
        }

        if (settings.withdrawRewardsFee > 0) {
            uint256 bananaFee = (bananaToWithdraw * settings.withdrawRewardsFee) / 10000;
            _safeBANANATransfer(settings.treasury, bananaFee);
            bananaToWithdraw -= bananaFee;
        }

        _safeBANANATransfer(_userAddress, bananaToWithdraw);

        emit ClaimRewards(_userAddress, currentShares, bananaToWithdraw);
    }

    function _bananaVaultDeposit() internal {
        uint256 previousShares = totalAutoBananaShares();
        uint256 bananaBalance = _bananaBalance();

        _approveTokenIfNeeded(BANANA, bananaBalance, address(BANANA_VAULT));
        // earns on deposit
        BANANA_VAULT.deposit(bananaBalance);

        uint256 currentShares = totalAutoBananaShares();
        uint256 shareIncrease = currentShares - previousShares;

        uint256 increaseAccSharesPerStakedToken = ((shareIncrease + unallocatedShares) * 1e18) / totalStake();
        accSharesPerStakedToken += increaseAccSharesPerStakedToken;

        // Not all shares are allocated because it's divided by totalStake() and can have rounding issue.
        // Example: 12345/100 shares = 123.45 which is 123 as uint
        // This calculates the unallocated shares which can then will be allocated later.
        // From example: 45 missing shares still to be allocated
        unallocatedShares = (shareIncrease + unallocatedShares) - ((increaseAccSharesPerStakedToken * totalStake()) / 1e18);
    }

    /// @notice Using total harvestable rewards as the input, find the outputs for each respective output
    /// @return platformOutput WBNB output amount which goes to the platform
    /// @return keeperOutput WBNB output amount which goes to the keeper
    /// @return burnOutput BANANA amount which goes to the burn address
    /// @return bananaOutput BANANA amount which goes to compounding
    function getExpectedOutputs()
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
        uint256 wbnbOutput = _getExpectedOutput(pathToWbnb);
        // Find the expected BANANA value of the current harvestable rewards
        uint256 bananaOutputWithoutFees = _getExpectedOutput(pathToBanana);
        // Calculate the WBNB values
        platformOutput = (wbnbOutput * settings.platformFee) / 10000;
        keeperOutput = (wbnbOutput * settings.keeperFee) / 10000;
        // Calculate the BANANA values
        burnOutput = (bananaOutputWithoutFees * settings.buyBackRate) / 10000;
        uint256 bananaFees = 
            ((bananaOutputWithoutFees * settings.platformFee) / 10000) 
            + ((bananaOutputWithoutFees * settings.keeperFee) / 10000) 
            + burnOutput;
        bananaOutput = bananaOutputWithoutFees - bananaFees;
    }

    /// @notice Get all balances of a user
    /// @param _userAddress user address
    /// @return stake
    /// @return banana
    /// @return autoBananaShares
    function balanceOf(address _userAddress)
        external
        view
        returns (
            uint256 stake,
            uint256 banana,
            uint256 autoBananaShares
        )
    {
        IMaximizerVaultApe.Settings memory settings = getSettings();

        UserInfo memory user = userInfo[_userAddress];

        uint256 pendingShares = ((user.stake * accSharesPerStakedToken) / 1e18) - user.rewardDebt;

        stake = user.stake;
        autoBananaShares = (user.autoBananaShares + pendingShares);
        banana = (autoBananaShares * BANANA_VAULT.getPricePerFullShare()) / 1e18;
        if (settings.withdrawRewardsFee > 0) {
            uint256 rewardFee = (banana * settings.withdrawRewardsFee) / 10000;
            banana -= rewardFee;
        }
    }

    function _approveTokenIfNeeded(
        IERC20 _token,
        uint256 _amount,
        address _spender
    ) internal {
        if (_token.allowance(address(this), _spender) < _amount) {
            _token.safeIncreaseAllowance(_spender, _amount);
        }
    }

    function _rewardTokenBalance() internal view returns (uint256) {
        return FARM_REWARD_TOKEN.balanceOf(address(this));
    }

    function _bananaBalance() internal view returns (uint256) {
        return BANANA.balanceOf(address(this));
    }

    /// @notice total strategy shares in banana vault
    /// @return totalAutoBananaShares rewarded banana shares in banana vault
    function totalAutoBananaShares() public view returns (uint256) {
        (uint256 shares, , , ) = BANANA_VAULT.userInfo(address(this));
        return shares;
    }

    /// @notice Returns the total amount of BANANA stored in the vault + the strategy
    /// @return totalBananaShares rewarded banana shares in banana vault
    function totalBanana() public view returns (uint256) {
        uint256 autoBanana = (totalAutoBananaShares() * BANANA_VAULT.getPricePerFullShare()) / 1e18;
        return autoBanana + _bananaBalance();
    }

    // Safe BANANA transfer function, just in case if rounding error causes pool to not have enough
    function _safeBANANATransfer(address _to, uint256 _amount) internal {
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
    ) internal {
        _approveTokenIfNeeded(FARM_REWARD_TOKEN, _inputAmount, address(router));

        router.swapExactTokensForTokens(
            _inputAmount,
            _minOutputAmount,
            _path,
            _to,
            block.timestamp
        );
    }

    /// @notice getter function for settings
    /// @return settings
    function getSettings()
        public
        view
        returns (IMaximizerVaultApe.Settings memory)
    {
        IMaximizerVaultApe.Settings memory defaultSettings = vaultApe
            .getSettings();

        address treasury = useDefaultSettings.treasury
            ? defaultSettings.treasury
            : strategySettings.treasury;
        uint256 keeperFee = useDefaultSettings.keeperFee
            ? defaultSettings.keeperFee
            : strategySettings.keeperFee;
        address platform = useDefaultSettings.platform
            ? defaultSettings.platform
            : strategySettings.platform;
        uint256 platformFee = useDefaultSettings.platformFee
            ? defaultSettings.platformFee
            : strategySettings.platformFee;
        uint256 buyBackRate = useDefaultSettings.buyBackRate
            ? defaultSettings.buyBackRate
            : strategySettings.buyBackRate;
        uint256 withdrawFee = useDefaultSettings.withdrawFee
            ? defaultSettings.withdrawFee
            : strategySettings.withdrawFee;
        uint256 withdrawFeePeriod = useDefaultSettings.withdrawFeePeriod
            ? defaultSettings.withdrawFeePeriod
            : strategySettings.withdrawFeePeriod;
        uint256 withdrawRewardsFee = useDefaultSettings.withdrawRewardsFee
            ? defaultSettings.withdrawRewardsFee
            : strategySettings.withdrawRewardsFee;

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

    /// @notice set path from reward token to banana
    /// @param _path path to banana
    /// @dev only owner
    function setPathToBanana(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == address(BANANA),
            "BaseBananaMaximizerStrategy: Incorrect path to BANANA"
        );
        emit SetPathToBanana(pathToBanana, _path);
        pathToBanana = _path;
    }

    /// @notice set path from reward token to wbnb
    /// @param _path path to wbnb
    /// @dev only owner
    function setPathToWbnb(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == WBNB,
            "BaseBananaMaximizerStrategy: Incorrect path to WBNB"
        );
        emit SetPathToWbnb(pathToWbnb, _path);
        pathToWbnb = _path;
    }

    /// @notice set platform address
    /// @param _platform platform address
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setPlatform(address _platform, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.platform = _useDefault;
        emit SetPlatform(strategySettings.platform, _platform, _useDefault);
        strategySettings.platform = _platform;
    }

    /// @notice set treasury address
    /// @param _treasury treasury address
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setTreasury(address _treasury, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.treasury = _useDefault;
        emit SetTreasury(strategySettings.treasury, _treasury, _useDefault);
        strategySettings.treasury = _treasury;
    }

    /// @notice set keeper fee
    /// @param _keeperFee keeper fee
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setKeeperFee(uint256 _keeperFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _keeperFee <= IMaximizerVaultApe(vaultApe).KEEPER_FEE_UL(),
            "BaseBananaMaximizerStrategy: Keeper fee too high"
        );
        useDefaultSettings.keeperFee = _useDefault;
        emit SetKeeperFee(strategySettings.keeperFee, _keeperFee, _useDefault);
        strategySettings.keeperFee = _keeperFee;
    }

    /// @notice set platform fee
    /// @param _platformFee platform fee
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setPlatformFee(uint256 _platformFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _platformFee <= IMaximizerVaultApe(vaultApe).PLATFORM_FEE_UL(),
            "BaseBananaMaximizerStrategy: Platform fee too high"
        );
        useDefaultSettings.platformFee = _useDefault;
        emit SetPlatformFee(
            strategySettings.platformFee,
            _platformFee,
            _useDefault
        );
        strategySettings.platformFee = _platformFee;
    }

    /// @notice set buyback rate fee
    /// @param _buyBackRate buyback rate fee
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setBuyBackRate(uint256 _buyBackRate, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _buyBackRate <= IMaximizerVaultApe(vaultApe).BUYBACK_RATE_UL(),
            "BaseBananaMaximizerStrategy: Buy back rate too high"
        );
        useDefaultSettings.buyBackRate = _useDefault;
        emit SetBuyBackRate(
            strategySettings.buyBackRate,
            _buyBackRate,
            _useDefault
        );
        strategySettings.buyBackRate = _buyBackRate;
    }

    /// @notice set withdraw fee
    /// @param _withdrawFee withdraw fee
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setWithdrawFee(uint256 _withdrawFee, bool _useDefault)
        external
        onlyOwner
    {
        require(
            _withdrawFee <= IMaximizerVaultApe(vaultApe).WITHDRAW_FEE_UL(),
            "BaseBananaMaximizerStrategy: Early withdraw fee too high"
        );
        useDefaultSettings.withdrawFee = _useDefault;
        emit SetWithdrawFee(
            strategySettings.withdrawFee,
            _withdrawFee,
            _useDefault
        );
        strategySettings.withdrawFee = _withdrawFee;
    }

    /// @notice set withdraw fee period
    /// @param _withdrawFeePeriod withdraw fee period
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setWithdrawFeePeriod(uint256 _withdrawFeePeriod, bool _useDefault)
        external
        onlyOwner
    {
        useDefaultSettings.withdrawFeePeriod = _useDefault;
        emit SetWithdrawFee(
            strategySettings.withdrawFeePeriod,
            _withdrawFeePeriod,
            _useDefault
        );
        strategySettings.withdrawFeePeriod = _withdrawFeePeriod;
    }

    /// @notice set withdraw rewards fee
    /// @param _withdrawRewardsFee withdraw rewards fee
    /// @param _useDefault usage of VaultApeMaximizer default
    /// @dev only owner
    function setWithdrawRewardsFee(
        uint256 _withdrawRewardsFee,
        bool _useDefault
    ) external onlyOwner {
        useDefaultSettings.withdrawRewardsFee = _useDefault;
        emit SetWithdrawRewardsFee(
            strategySettings.withdrawRewardsFee,
            _withdrawRewardsFee,
            _useDefault
        );
        strategySettings.withdrawRewardsFee = _withdrawRewardsFee;
    }
}
