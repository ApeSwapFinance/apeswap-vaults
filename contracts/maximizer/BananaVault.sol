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
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "../libs/IMasterApe.sol";

/// @title Banana Vault
/// @author ApeSwapFinance
/// @notice Banana vault without fees. Usage only for ApeSwap maximizer vaults
contract BananaVault is AccessControlEnumerable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct UserInfo {
        uint256 shares; // number of shares for a user
        uint256 lastDepositedTime; // keeps track of deposited time for potential penalty
        uint256 bananaAtLastUserAction; // keeps track of banana deposited at the last user action
        uint256 lastUserActionTime; // keeps track of the last user action time
    }

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER");
    bytes32 public constant DEPOSIT_ROLE = keccak256("DEPOSIT");

    IERC20 public immutable bananaToken;
    IMasterApe public immutable masterApe;

    mapping(address => UserInfo) public userInfo;

    uint256 public totalShares;
    uint256 public lastHarvestedTime;
    address public treasury;

    event Deposit(
        address indexed sender,
        uint256 amount,
        uint256 shares,
        uint256 lastDepositedTime
    );
    event Withdraw(address indexed sender, uint256 amount, uint256 shares);
    event Earn(address indexed sender);
    event SetTreasury(
        address indexed previousTreasury,
        address indexed newTreasury
    );
    event SetWithdrawFee(uint256 previousWithdrawFee, uint256 newWithdrawFee);

    /**
     * @notice Constructor
     * @param _bananaToken: Banana token contract
     * @param _masterApe: Master Ape contract
     * @param _admin: address of the owner
     */
    constructor(
        IERC20 _bananaToken,
        address _masterApe,
        address _admin
    ) {
        bananaToken = _bananaToken;
        masterApe = IMasterApe(_masterApe);

        // Setup access control
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(MANAGER_ROLE, _admin);
        // A manager can be a vault contract which can add sub strategies to the deposit role
        _setRoleAdmin(MANAGER_ROLE, DEFAULT_ADMIN_ROLE);
        // Allow managers to grant/revoke deposit roles
        _setRoleAdmin(DEPOSIT_ROLE, MANAGER_ROLE);
    }

    /**
     * @notice Deposits funds into the Banana Vault
     * @param _amount: number of tokens to deposit (in BANANA)
     */
    function deposit(uint256 _amount)
        external
        nonReentrant
        onlyRole(DEPOSIT_ROLE)
    {
        require(_amount > 0, "BananaVault: Nothing to deposit");

        uint256 totalBananaTokens = underlyingTokenBalance();
        bananaToken.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 currentShares = 0;
        if (totalShares != 0) {
            currentShares = (_amount.mul(totalShares)).div(totalBananaTokens);
        } else {
            currentShares = _amount;
        }
        UserInfo storage user = userInfo[msg.sender];

        user.shares = user.shares.add(currentShares);
        user.lastDepositedTime = block.timestamp;

        totalShares = totalShares.add(currentShares);

        user.bananaAtLastUserAction = user
            .shares
            .mul(underlyingTokenBalance())
            .div(totalShares);
        user.lastUserActionTime = block.timestamp;

        _earn();

        emit Deposit(msg.sender, _amount, currentShares, block.timestamp);
    }

    /**
     * @notice Withdraws all funds for a user
     */
    function withdrawAll() external {
        withdraw(userInfo[msg.sender].shares);
    }

    /**
     * @notice Reinvests BANANA tokens into MasterApe
     */
    function earn() external {
        masterApe.leaveStaking(0);

        _earn();

        emit Earn(msg.sender);
    }

    /**
     * @notice Sets treasury address
     * @dev Only callable by the contract owner.
     */
    function setTreasury(address _treasury)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_treasury != address(0), "BananaVault: Cannot be zero address");

        emit SetTreasury(treasury, _treasury);
        treasury = _treasury;
    }

    /**
     * @notice Calculates the total pending rewards that can be restaked
     * @return Returns total pending Banana rewards
     */
    function calculateTotalPendingBananaRewards()
        external
        view
        returns (uint256)
    {
        uint256 amount = masterApe.pendingCake(0, address(this));
        amount = amount.add(available());

        return amount;
    }

    /**
     * @notice Calculates the price per share
     */
    function getPricePerFullShare() external view returns (uint256) {
        return
            totalShares == 0
                ? 1e18
                : underlyingTokenBalance().mul(1e18).div(totalShares);
    }

    /**
     * @notice Withdraws from funds from the Banana Vault
     * @param _shares: Number of shares to withdraw
     */
    function withdraw(uint256 _shares) public nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        require(_shares > 0, "BananaVault: Nothing to withdraw");
        require(
            _shares <= user.shares,
            "BananaVault: Withdraw amount exceeds balance"
        );

        uint256 bananaTokensToWithdraw = (underlyingTokenBalance().mul(_shares))
            .div(totalShares);
        user.shares = user.shares.sub(_shares);
        totalShares = totalShares.sub(_shares);

        uint256 bal = available();
        if (bal < bananaTokensToWithdraw) {
            uint256 balWithdraw = bananaTokensToWithdraw.sub(bal);
            masterApe.leaveStaking(balWithdraw);
            // Check if the withdraw deposited enough tokens into this contract
            uint256 balAfter = available();
            if (balAfter < bananaTokensToWithdraw) {
                bananaTokensToWithdraw = balAfter;
            }
        }

        if (user.shares > 0) {
            user.bananaAtLastUserAction = user
                .shares
                .mul(underlyingTokenBalance())
                .div(totalShares);
        } else {
            user.bananaAtLastUserAction = 0;
        }

        user.lastUserActionTime = block.timestamp;

        bananaToken.safeTransfer(msg.sender, bananaTokensToWithdraw);

        emit Withdraw(msg.sender, bananaTokensToWithdraw, _shares);
    }

    /**
     * @notice Custom logic for how much the vault allows to be borrowed
     * @dev The contract puts 100% of the tokens to work.
     */
    function available() public view returns (uint256) {
        return bananaToken.balanceOf(address(this));
    }

    /**
     * @notice Calculates the total underlying tokens
     * @dev It includes tokens held by the contract and held in MasterApe
     */
    function underlyingTokenBalance() public view returns (uint256) {
        (uint256 amount, ) = masterApe.userInfo(0, address(this));

        return bananaToken.balanceOf(address(this)).add(amount);
    }

    /**
     * @notice Deposits tokens into MasterApe to earn staking rewards
     */
    function _earn() internal {
        uint256 balance = available();

        if (balance > 0) {
            if (
                bananaToken.allowance(address(this), address(masterApe)) <
                balance
            ) {
                bananaToken.safeApprove(address(masterApe), type(uint256).max);
            }

            masterApe.enterStaking(balance);
        }
    }
}
