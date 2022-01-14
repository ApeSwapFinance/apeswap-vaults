// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


import "../libs/IVaultApeMaximizer.sol";
import "../libs/IStrategyMaximizer.sol";

contract VaultApeMaximizer is IVaultApeMaximizer, ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 shares; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.

        // We do some fancy math here. Basically, any point in time, the amount of BANANA
        // entitled to a user but is pending to be distributed is:
        //
        //   amount = user.shares / sharesTotal * wantLockedTotal
        //   pending reward = (amount * pool.accRewardPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws want tokens to a pool. Here's what happens:
        //   1. The pool's `accRewardPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // TOOD: This poolInfo looks like it's from the MasterApe. Will we use a different structure?
    // struct PoolInfo {
    //     IERC20 want; // Address of the want token.
    //     address strat; // Strategy address that will BANANA compound want tokens
    //     uint256 allocPoint; // How many allocation points assigned to this pool. BANANA to distribute per block.
    //     uint256 lastRewardBlock; // Last block number that BANANA distribution occurs.
    //     uint256 accRewardPerShare; // Accumulated BANANA per share, times 1e12. See below.
    // }

    address public BANANA;

    address public constant burnAddress =
        0x000000000000000000000000000000000000dEaD;

    uint256 public constant ownerBANANAReward = 200; // 15% Dev + 5% MKT

    uint256 public maxSupply = 100000000e18;
    uint256 public BANANAPerBlock = 2e18; // BANANA tokens created per block
    uint256 public startBlock = 0; // https://bscscan.com/block/countdown/7862758

    PoolInfo[] public poolInfo; // Info of each pool.
    mapping(uint256 => mapping(address => UserInfo)) public override userInfo; // Info of each user that stakes LP tokens.
    mapping(address => bool) public strats; // Info of each pool.

    event AddPool(address indexed strat);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(address _banana, uint256 _startBlock) {
        BANANA = _banana;
        startBlock = _startBlock;
    }

    function poolLength() external override view returns (uint256) {
        return poolInfo.length;
    }

    // View function to see staked Want tokens on frontend.
    function stakedWantTokens(uint256 _pid, address _user)
        external
        override
        view
        returns (uint256)
    {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 sharesTotal = IStrategy(pool.strat).sharesTotal();
        uint256 wantLockedTotal = IStrategy(poolInfo[_pid].strat)
            .wantLockedTotal();
        if (sharesTotal == 0) {
            return 0;
        }
        return user.shares.mul(wantLockedTotal).div(sharesTotal);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        if (
            _pid >= poolInfo.length || IStrategy(poolInfo[_pid].strat).paused()
        ) {
            return;
        }

        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 sharesTotal = IStrategy(pool.strat).sharesTotal();
        if (sharesTotal == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        IStrategy(poolInfo[_pid].strat).updatePool(_msgSender());

        // uint256 BANANAReward = multiplier
        //     .mul(BANANAPerBlock)
        //     .mul(pool.allocPoint)
        //     .div(totalAllocPoint);

        // BANANAToken(BANANA).mint(
        //     owner(),
        //     BANANAReward.mul(ownerBANANAReward).div(1000)
        // );
        // BANANAToken(BANANA).mint(address(this), BANANAReward);

        // pool.accRewardPerShare = pool.accRewardPerShare.add(
        //     BANANAReward.mul(1e12).div(sharesTotal)
        // );

        pool.lastRewardBlock = block.number;
    }

    // Want tokens moved from user -> this -> Strat (compounding)
    function deposit(uint256 _pid, uint256 _wantAmt) external override nonReentrant {
        _deposit(_pid, _wantAmt, msg.sender);
    }

    // For depositing for other users
    function deposit(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) external override nonReentrant {
        _deposit(_pid, _wantAmt, _to);
    }

    // Want tokens moved from user -> BANANAFarm (BANANA allocation) -> Strat (compounding)
    function _deposit(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) internal {
        updatePool(_pid);
        PoolInfo storage pool = poolInfo[_pid];
        require(pool.strat != address(0), "That strategy does not exist");
        UserInfo storage user = userInfo[_pid][_to];

        //Transfer built up banana rewards
        if (user.shares > 0) {
            uint256 pending = user
                .shares
                .mul(pool.accRewardPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                safeBANANATransfer(_to, pending);
            }
        }

        if (_wantAmt > 0) {
            pool.want.safeTransferFrom(
                address(msg.sender),
                address(this),
                _wantAmt
            );

            pool.want.safeIncreaseAllowance(pool.strat, _wantAmt);
            uint256 sharesAdded = IStrategy(poolInfo[_pid].strat).deposit(
                _to,
                _wantAmt
            );
            user.shares = user.shares.add(sharesAdded);
        }
        user.rewardDebt = user.shares.mul(pool.accRewardPerShare).div(1e12);
        emit Deposit(_to, _pid, _wantAmt);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _wantAmt) external override nonReentrant {
        _withdraw(_pid, _wantAmt, msg.sender);
    }

    // For withdrawing to other address
    function withdraw(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) external override nonReentrant {
        _withdraw(_pid, _wantAmt, _to);
    }

    // Withdraw LP tokens from MasterChef.
    function _withdraw(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) internal {
        updatePool(_pid);

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 wantLockedTotal = IStrategy(poolInfo[_pid].strat)
            .wantLockedTotal();
        uint256 sharesTotal = IStrategy(poolInfo[_pid].strat).sharesTotal();

        require(user.shares > 0, "user.shares is 0");
        require(sharesTotal > 0, "sharesTotal is 0");

        uint256 pending = user.shares.mul(pool.accRewardPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            safeBANANATransfer(msg.sender, pending);
        }

        // Withdraw want tokens
        uint256 amount = user.shares.mul(wantLockedTotal).div(sharesTotal);
        if (_wantAmt > amount) {
            _wantAmt = amount;
        }
        if (_wantAmt > 0) {
            uint256 sharesRemoved = IStrategy(poolInfo[_pid].strat).withdraw(
                msg.sender,
                _wantAmt
            );

            if (sharesRemoved > user.shares) {
                user.shares = 0;
            } else {
                user.shares = user.shares.sub(sharesRemoved);
            }

            uint256 wantBal = IERC20(pool.want).balanceOf(address(this));
            if (wantBal < _wantAmt) {
                _wantAmt = wantBal;
            }
            pool.want.safeTransfer(address(_to), _wantAmt);
        }
        user.rewardDebt = user.shares.mul(pool.accRewardPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _wantAmt);
    }

    function withdrawAll(uint256 _pid) external override nonReentrant {
        _withdraw(_pid, type(uint256).max, msg.sender);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 wantLockedTotal = IStrategy(poolInfo[_pid].strat)
            .wantLockedTotal();
        uint256 sharesTotal = IStrategy(poolInfo[_pid].strat).sharesTotal();
        uint256 amount = user.shares.mul(wantLockedTotal).div(sharesTotal);

        IStrategy(poolInfo[_pid].strat).withdraw(msg.sender, amount);

        pool.want.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
        user.shares = 0;
        user.rewardDebt = 0;
    }

    // Safe BANANA transfer function, just in case if rounding error causes pool to not have enough
    function safeBANANATransfer(address _to, uint256 _bananaAmount) internal {
        uint256 BananaBalance = IERC20(BANANA).balanceOf(address(this));
        if (_bananaAmount > BananaBalance) {
            IERC20(BANANA).transfer(_to, BananaBalance);
        } else {
            IERC20(BANANA).transfer(_to, _bananaAmount);
        }
    }

    /*
        ------------------------------------
                Governance functions
        ------------------------------------
    */

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do. (Only if want tokens are stored here.)
    function addPool(IERC20 _want, address _strat) external onlyOwner {
        require(!strats[_strat], "Existing strategy");
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        poolInfo.push(
            PoolInfo({
                want: _want,
                allocPoint: 0,
                lastRewardBlock: lastRewardBlock,
                accRewardPerShare: 0,
                strat: _strat
            })
        );
        strats[_strat] = true;

        emit AddPool(_strat);
    }

    // // Update the given pool's BANANA allocation point. Can only be called by the owner.
    // function set(
    //     uint256 _pid,
    //     uint256 _allocPoint,
    //     bool _withUpdate
    // ) external onlyOwner {
    //     if (_withUpdate) {
    //         massUpdatePools();
    //     }
    //     totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
    //         _allocPoint
    //     );
    //     poolInfo[_pid].allocPoint = _allocPoint;
    // }

    function inCaseTokensGetStuck(address _token, uint256 _amount)
        external
        onlyOwner
    {
        require(_token != BANANA, "!safe");
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }
}
