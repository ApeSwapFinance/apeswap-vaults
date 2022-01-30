// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../libs/IVaultApe.sol";
import "../libs/IBananaVault.sol";
import "../libs/IMasterApe.sol";
import "../libs/IUniRouter02.sol";
import "../libs/IStrategyMaximizer.sol";

contract StrategyMaximizer is IStrategyMaximizer, Ownable, ReentrancyGuard {
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

    // Addresses
    address public constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    IERC20 public constant BANANA =
        IERC20(0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95);

    // Runtime data
    mapping(address => UserInfo) public override userInfo; // Info of users
    uint256 public override accSharesPerStakedToken; // Accumulated BANANA_VAULT shares per staked token, times 1e18.

    // Farm info
    IMasterApe public immutable MASTERAPE;
    address public override STAKED_TOKEN_ADDRESS;
    IERC20 public immutable STAKED_TOKEN;
    IERC20 public immutable FARM_REWARD_TOKEN;
    uint256 public immutable FARM_PID;
    IBananaVault public immutable BANANA_VAULT;

    // Settings
    IUniRouter02 public immutable router;
    address[] public pathToBanana; // Path from staked token to BANANA
    address[] public pathToWbnb; // Path from staked token to WBNB

    address public treasury;
    address public keeper;
    uint256 public keeperFee = 50; // 0.5%
    uint256 public constant KEEPER_FEE_UL = 100; // 1%

    address public platform;
    uint256 public platformFee;
    uint256 public constant PLATFORM_FEE_UL = 500; // 5%

    address public constant BURN_ADDRESS =
        0x000000000000000000000000000000000000dEaD;
    uint256 public buyBackRate;
    uint256 public constant BUYBACK_RATE_UL = 300; // 3%

    uint256 public withdrawFee = 25; // 0.25%
    uint256 public constant WITHDRAW_FEE_UL = 300; // 3%

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EarlyWithdraw(address indexed user, uint256 amount, uint256 fee);
    event ClaimRewards(address indexed user, uint256 shares, uint256 amount);

    // Setting updates
    event SetPathToBanana(address[] oldPath, address[] newPath);
    event SetPathToWbnb(address[] oldPath, address[] newPath);
    event SetBuyBackRate(uint256 oldBuyBackRate, uint256 newBuyBackRate);
    event SetTreasury(address oldTreasury, address newTreasury);
    event SetKeeper(address oldKeeper, address newKeeper);
    event SetKeeperFee(uint256 oldKeeperFee, uint256 newKeeperFee);
    event SetPlatform(address oldPlatform, address newPlatform);
    event SetPlatformFee(uint256 oldPlatformFee, uint256 newPlatformFee);
    event SetWithdrawFee(
        uint256 oldEarlyWithdrawFee,
        uint256 newEarlyWithdrawFee
    );

    constructor(
        address _masterApe,
        uint256 _farmPid,
        address _stakedToken,
        address _farmRewardToken,
        address _bananaVault,
        address _router,
        address[] memory _pathToBanana,
        address[] memory _pathToWbnb,
        //TODO: check these for fees etc
        address[] memory _addresses, //[_owner, _treasury, _keeper ,_platform]
        uint256 _buyBackRate,
        uint256 _platformFee
    ) {
        require(
            _pathToBanana[0] == address(_farmRewardToken) &&
                _pathToBanana[_pathToBanana.length - 1] == address(BANANA),
            "StrategyMaximizer: Incorrect path to BANANA"
        );

        require(
            _pathToWbnb[0] == address(_farmRewardToken) &&
                _pathToWbnb[_pathToWbnb.length - 1] == WBNB,
            "StrategyMaximizer: Incorrect path to WBNB"
        );

        require(
            _buyBackRate <= BUYBACK_RATE_UL,
            "StrategyMaximizer: Buyback rate over upper limit"
        );
        require(
            _platformFee <= PLATFORM_FEE_UL,
            "StrategyMaximizer: platform fee over upper limit"
        );

        STAKED_TOKEN = IERC20(_stakedToken);
        STAKED_TOKEN_ADDRESS = _stakedToken;
        MASTERAPE = IMasterApe(_masterApe);
        FARM_REWARD_TOKEN = IERC20(_farmRewardToken);
        FARM_PID = _farmPid;
        BANANA_VAULT = IBananaVault(_bananaVault);

        router = IUniRouter02(_router);
        pathToBanana = _pathToBanana;
        pathToWbnb = _pathToWbnb;

        buyBackRate = _buyBackRate;
        platformFee = _platformFee;

        transferOwnership(_addresses[0]);
        treasury = _addresses[1];
        keeper = _addresses[2];
        platform = _addresses[3];
    }

    /**
     * @dev Throws if called by any account other than the keeper.
     */
    modifier onlyKeeper() {
        require(
            keeper == msg.sender,
            "StrategyMaximizer: caller is not the keeper"
        );
        _;
    }

    // 1. Harvest rewards
    // 2. Collect fees
    // 3. Convert rewards to $BANANA
    // 4. Stake to banana auto-compound vault
    function earn(
        uint256 _minPlatformOutput,
        uint256 _minKeeperOutput,
        uint256 _minBurnOutput,
        uint256 _minBananaOutput
    ) external override onlyKeeper {
        MASTERAPE.withdraw(FARM_PID, 0);

        uint256 rewardTokenBalance = _rewardTokenBalance();

        // Collect platform fees
        if (platformFee > 0) {
            _swap(
                rewardTokenBalance.mul(platformFee).div(10000),
                _minPlatformOutput,
                pathToWbnb,
                platform
            );
        }

        // Collect keeper fees
        if (keeperFee > 0) {
            _swap(
                rewardTokenBalance.mul(keeperFee).div(10000),
                _minKeeperOutput,
                pathToWbnb,
                treasury
            );
        }

        // Convert remaining rewards to BANANA
        if (address(FARM_REWARD_TOKEN) != address(BANANA)) {
            // Collect Burn fees
            if (buyBackRate > 0) {
                _swap(
                    rewardTokenBalance.mul(buyBackRate).div(10000),
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
        } else {
            //TODO: buyback is now just burn
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

    function deposit(address _userAddress) external override nonReentrant {
        uint256 _amount = STAKED_TOKEN.balanceOf(address(this));
        require(
            _amount > 0,
            "StrategyMaximizer: amount must be greater than zero"
        );
        UserInfo storage user = userInfo[_userAddress];

        _approveTokenIfNeeded(STAKED_TOKEN, _amount, address(MASTERAPE));

        MASTERAPE.deposit(FARM_PID, _amount);

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

    function withdraw(address _userAddress, uint256 _amount)
        external
        override
        nonReentrant
    {
        UserInfo storage user = userInfo[_userAddress];

        require(
            _amount > 0,
            "StrategyMaximizer: amount must be greater than zero"
        );
        _amount = user.stake < _amount ? user.stake : _amount;

        MASTERAPE.withdraw(FARM_PID, _amount);

        uint256 currentAmount = _amount;

        // Take withdraw fees
        uint256 currentWithdrawFee = currentAmount.mul(withdrawFee).div(10000);
        STAKED_TOKEN.safeTransfer(treasury, currentWithdrawFee);
        currentAmount = currentAmount.sub(currentWithdrawFee);

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

    function claimRewards(address _userAddress, uint256 _shares)
        external
        override
        nonReentrant
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

        _safeBANANATransfer(_userAddress, withdrawAmount);

        emit ClaimRewards(_userAddress, _shares, withdrawAmount);
    }

    //TODO
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
        uint256 wbnbOutput = _getExpectedOutput(pathToWbnb);
        uint256 bananaOutputWithoutFees = _getExpectedOutput(pathToBanana);

        platformOutput = wbnbOutput.mul(platformFee).div(10000);
        keeperOutput = wbnbOutput.mul(keeperFee).div(10000);
        burnOutput = bananaOutputWithoutFees.mul(buyBackRate).div(10000);

        bananaOutput = bananaOutputWithoutFees.sub(
            bananaOutputWithoutFees
                .mul(platformFee)
                .div(10000)
                .add(bananaOutputWithoutFees.mul(keeperFee).div(10000))
                .add(bananaOutputWithoutFees.mul(buyBackRate).div(10000))
        );
    }

    function _getExpectedOutput(address[] memory _path)
        private
        view
        returns (uint256)
    {
        uint256 rewards = _rewardTokenBalance().add(
            MASTERAPE.pendingCake(FARM_PID, address(this))
        );

        uint256[] memory amounts = router.getAmountsOut(rewards, _path);

        return amounts[amounts.length.sub(1)];
    }

    function balanceOf(address _user)
        external
        view
        returns (
            uint256 stake,
            uint256 banana,
            uint256 autoBananaShares
        )
    {
        UserInfo memory user = userInfo[_user];

        uint256 pendingShares = user
            .stake
            .mul(accSharesPerStakedToken)
            .div(1e18)
            .sub(user.rewardDebt);

        stake = user.stake;
        autoBananaShares = user.autoBananaShares.add(pendingShares);

        (uint256 amount, ) = MASTERAPE.userInfo(0, address(this));
        uint256 pricePerFullShare = BANANA.balanceOf(address(this)).add(amount);

        banana = autoBananaShares.mul(pricePerFullShare).div(1e18);
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

    function totalStake() public view returns (uint256) {
        (uint256 amount, ) = MASTERAPE.userInfo(FARM_PID, address(this));
        return amount;
    }

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

    function setPathToBanana(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == address(BANANA),
            "StrategyMaximizer: Incorrect path to BANANA"
        );

        address[] memory oldPath = pathToBanana;

        pathToBanana = _path;

        emit SetPathToBanana(oldPath, pathToBanana);
    }

    function setPathToWbnb(address[] memory _path) external onlyOwner {
        require(
            _path[0] == address(FARM_REWARD_TOKEN) &&
                _path[_path.length - 1] == WBNB,
            "StrategyMaximizer: Incorrect path to WBNB"
        );

        address[] memory oldPath = pathToWbnb;

        pathToWbnb = _path;

        emit SetPathToWbnb(oldPath, pathToWbnb);
    }

    function setTreasury(address _treasury) external onlyOwner {
        address oldTreasury = treasury;

        treasury = _treasury;

        emit SetTreasury(oldTreasury, treasury);
    }

    function setKeeper(address _keeper) external onlyOwner {
        address oldKeeper = keeper;

        keeper = _keeper;

        emit SetKeeper(oldKeeper, keeper);
    }

    function setKeeperFee(uint256 _keeperFee) external onlyOwner {
        require(
            _keeperFee <= KEEPER_FEE_UL,
            "StrategyMaximizer: Keeper fee too high"
        );

        uint256 oldKeeperFee = keeperFee;

        keeperFee = _keeperFee;

        emit SetKeeperFee(oldKeeperFee, keeperFee);
    }

    function setPlatform(address _platform) external onlyOwner {
        address oldPlatform = platform;

        platform = _platform;

        emit SetPlatform(oldPlatform, platform);
    }

    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        require(
            _platformFee <= PLATFORM_FEE_UL,
            "StrategyMaximizer: Platform fee too high"
        );

        uint256 oldPlatformFee = platformFee;

        platformFee = _platformFee;

        emit SetPlatformFee(oldPlatformFee, platformFee);
    }

    function setBuyBackRate(uint256 _buyBackRate) external onlyOwner {
        require(
            _buyBackRate <= BUYBACK_RATE_UL,
            "StrategyMaximizer: Buy back rate too high"
        );

        uint256 oldBuyBackRate = buyBackRate;

        buyBackRate = _buyBackRate;

        emit SetBuyBackRate(oldBuyBackRate, buyBackRate);
    }

    function setWithdrawFee(uint256 _withdrawFee) external onlyOwner {
        require(
            _withdrawFee <= WITHDRAW_FEE_UL,
            "StrategyMaximizer: Early withdraw fee too high"
        );

        uint256 oldWithdrawFee = withdrawFee;

        withdrawFee = _withdrawFee;

        emit SetWithdrawFee(oldWithdrawFee, withdrawFee);
    }
}
