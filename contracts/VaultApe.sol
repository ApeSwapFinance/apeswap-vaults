// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/Utils/SafeERC20.sol";
import "@openzeppelin/contracts/Utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/Security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/Utils/Math/SafeMath.sol";

import "./libs/IStrategy.sol";
import "./Operators.sol";

contract VaultApe is ReentrancyGuard, Operators {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 shares; // How many LP tokens the user has provided.
    }

    struct PoolInfo {
        IERC20 want; // Address of the want token.
        address strat; // Strategy address that will auto compound want tokens
    }

    PoolInfo[] public poolInfo; // Info of each pool.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo; // Info of each user that stakes LP tokens.
    mapping(address => bool) private strats;

    event AddPool(address indexed strat);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    /**
     * @dev Add a new want to the pool. Can only be called by the owner.
     */
    function addPool(address _strat) external onlyOwner nonReentrant {
        require(!strats[_strat], "Existing strategy");
        poolInfo.push(
            PoolInfo({
                want: IERC20(IStrategy(_strat).wantAddress()),
                strat: _strat
            })
        );
        strats[_strat] = true;
        resetSingleAllowance(poolInfo.length.sub(1));
        emit AddPool(_strat);
    }

    // View function to see staked Want tokens on frontend.
    function stakedWantTokens(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 sharesTotal = IStrategy(pool.strat).sharesTotal();
        uint256 wantLockedTotal = IStrategy(poolInfo[_pid].strat).wantLockedTotal();
        if (sharesTotal == 0) {
            return 0;
        }
        return user.shares.mul(wantLockedTotal).div(sharesTotal);
    }

    // Want tokens moved from user -> this -> Strat (compounding)
    function deposit(uint256 _pid, uint256 _wantAmt) external nonReentrant {
        _deposit(_pid, _wantAmt, msg.sender);
    }

    // For unique contract calls
    function deposit(uint256 _pid, uint256 _wantAmt, address _to) external nonReentrant onlyOperator {
        _deposit(_pid, _wantAmt, _to);
    }
    
    function _deposit(uint256 _pid, uint256 _wantAmt, address _to) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_to];

        if (_wantAmt > 0) {
            pool.want.safeTransferFrom(msg.sender, address(this), _wantAmt);

            uint256 sharesAdded = IStrategy(poolInfo[_pid].strat).deposit(_to, _wantAmt);
            user.shares = user.shares.add(sharesAdded);
        }
        emit Deposit(_to, _pid, _wantAmt);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _wantAmt) external nonReentrant {
        _withdraw(_pid, _wantAmt, msg.sender);
    }

    // For unique contract calls
    function withdraw(uint256 _pid, uint256 _wantAmt, address _to) external nonReentrant onlyOperator {
        _withdraw(_pid, _wantAmt, _to);
    }

    function _withdraw(uint256 _pid, uint256 _wantAmt, address _to) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 wantLockedTotal = IStrategy(poolInfo[_pid].strat).wantLockedTotal();
        uint256 sharesTotal = IStrategy(poolInfo[_pid].strat).sharesTotal();

        require(user.shares > 0, "user.shares is 0");
        require(sharesTotal > 0, "sharesTotal is 0");

        // Withdraw want tokens
        uint256 amount = user.shares.mul(wantLockedTotal).div(sharesTotal);
        if (_wantAmt > amount) {
            _wantAmt = amount;
        }
        if (_wantAmt > 0) {
            uint256 sharesRemoved = IStrategy(poolInfo[_pid].strat).withdraw(msg.sender, _wantAmt);

            if (sharesRemoved > user.shares) {
                user.shares = 0;
            } else {
                user.shares = user.shares.sub(sharesRemoved);
            }

            uint256 wantBal = IERC20(pool.want).balanceOf(address(this));
            if (wantBal < _wantAmt) {
                _wantAmt = wantBal;
            }
            pool.want.safeTransfer(_to, _wantAmt);
        }
        emit Withdraw(msg.sender, _pid, _wantAmt);
    }

    // Withdraw everything from pool for yourself
    function withdrawAll(uint256 _pid) external {
        _withdraw(_pid, type(uint256).max, msg.sender);
    }

    function resetAllowances() external onlyOwner {
        for (uint256 i=0; i<poolInfo.length; i++) {
            PoolInfo storage pool = poolInfo[i];
            pool.want.safeApprove(pool.strat, uint256(0));
            pool.want.safeIncreaseAllowance(pool.strat, type(uint256).max);
        }
    }

    function earnAll() external {
        for (uint256 i=0; i<poolInfo.length; i++) {
            IStrategy(poolInfo[i].strat).earn(_msgSender());
        }
    }

    function resetSingleAllowance(uint256 _pid) public onlyOwner {
        PoolInfo storage pool = poolInfo[_pid];
        pool.want.safeApprove(pool.strat, uint256(0));
        pool.want.safeIncreaseAllowance(pool.strat, type(uint256).max);
    }
}