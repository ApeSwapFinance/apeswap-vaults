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

import "./BaseBananaMaximizerStrategy.sol";
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
    BaseBananaMaximizerStrategy
{
    using SafeERC20 for IERC20;

    uint256 public override accSharesPerStakedToken; // Accumulated BANANA_VAULT shares per staked token, times 1e18.

    // Farm info
    IMasterApe public immutable STAKED_TOKEN_FARM;
    address public override STAKED_TOKEN_ADDRESS;
    uint256 public immutable FARM_PID;
    bool public immutable IS_BANANA_STAKING;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EarlyWithdraw(address indexed user, uint256 amount, uint256 fee);
    event ClaimRewards(address indexed user, uint256 shares, uint256 amount);

    // Setting updates
    constructor(
        address _masterApe,
        uint256 _farmPid,
        bool _isBananaStaking,
        address _stakedToken,
        address _farmRewardToken,
        address _bananaVault,
        address _router,
        address[] memory _pathToBanana,
        address[] memory _pathToWbnb,
        address[] memory _addresses //[_owner, _vaultApe]
    ) BaseBananaMaximizerStrategy(
        _stakedToken,
        _farmRewardToken,
        _bananaVault,
        _router,
        _pathToBanana,
        _pathToWbnb,
        _addresses
    ) {
        STAKED_TOKEN_FARM = IMasterApe(_masterApe);
        FARM_PID = _farmPid;
        IS_BANANA_STAKING = _isBananaStaking;
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
    ) external override nonReentrant onlyVaultApe {
        if (IS_BANANA_STAKING) {
            STAKED_TOKEN_FARM.leaveStaking(0);
        } else {
            STAKED_TOKEN_FARM.withdraw(FARM_PID, 0);
        }

        _earn(_minPlatformOutput, _minKeeperOutput, _minBurnOutput, _minBananaOutput, _takeKeeperFee);
    }

    /// @notice deposit in vault
    /// @param _userAddress user address
    function deposit(address _userAddress, uint256 _amount)
        external
        override
        nonReentrant
        onlyVaultApe
    {
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
        IMaximizerVaultApe.Settings memory settings = getSettings();

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
            settings.withdrawFee > 0 &&
            block.timestamp <
            user.lastDepositedTime.add(settings.withdrawFeePeriod)
        ) {
            // Take withdraw fees
            uint256 currentWithdrawFee = currentAmount
                .mul(settings.withdrawFee)
                .div(10000);
            STAKED_TOKEN.safeTransfer(settings.treasury, currentWithdrawFee);
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

    /// @notice total staked tokens of vault in farm
    /// @return total staked tokens of vault in farm
    function totalStake() public view override returns (uint256) {
        (uint256 amount, ) = STAKED_TOKEN_FARM.userInfo(
            FARM_PID,
            address(this)
        );
        return amount;
    }
}