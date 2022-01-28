// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../libs/IVaultApeMaximizer.sol";
import "../libs/IStrategyMaximizer.sol";
import "../libs/IBananaVault.sol";

contract VaultApeMaximizer is IVaultApeMaximizer, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    address[] public vaults;
    mapping(address => bool) public strats;
    IBananaVault BANANA_VAULT;

    event AddPool(address indexed strat);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(address _bananaVault) {
        BANANA_VAULT = IBananaVault(_bananaVault);
    }

    //TODO fix this interface for userInfo(2)
    function userInfo2(uint256 _pid, address _user)
        external
        view
        override
        returns (
            uint256 stake,
            uint256 autoBananaShares,
            uint256 rewardDebt,
            uint256 lastDepositedTime
        )
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        (stake, autoBananaShares, rewardDebt, lastDepositedTime) = strat
            .userInfo(_user);
    }

    function userInfo(uint256 _pid, address _user)
        external
        view
        override
        returns (uint256 shares)
    {
        uint256 shares = 0;
    }

    function accSharesPerStakedToken(uint256 _pid)
        external
        view
        returns (uint256)
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        return strat.accSharesPerStakedToken();
    }

    function poolLength() external view override returns (uint256) {
        return vaults.length;
    }

    // View function to see staked Want tokens on frontend.
    function stakedWantTokens(uint256 _pid, address _user)
        external
        view
        override
        returns (uint256)
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        (uint256 stake, , , ) = strat.userInfo(_user);
        return stake;
    }

    function earnAll() external override {
        for (uint256 i = 0; i < vaults.length; i++) {
            IStrategyMaximizer(vaults[i]).earn(0, 0, 0, 0);
        }

        BANANA_VAULT.harvest();
    }

    function earnSome(uint256[] memory pids) external override {
        for (uint256 i = 0; i < pids.length; i++) {
            if (vaults.length >= pids[i]) {
                IStrategyMaximizer(vaults[pids[i]]).earn(0, 0, 0, 0);
            }
        }

        BANANA_VAULT.harvest();
    }

    function deposit(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) external override nonReentrant {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        IERC20 wantToken = IERC20(strat.STAKED_TOKEN_ADDRESS());
        wantToken.safeTransferFrom(msg.sender, address(strat), _wantAmt);
        strat.deposit(_to);
    }

    function deposit(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        IERC20 wantToken = IERC20(strat.STAKED_TOKEN_ADDRESS());
        wantToken.safeTransferFrom(msg.sender, address(strat), _wantAmt);
        strat.deposit(msg.sender);
    }

    //This needs to be removed as people can withdraw for others lol
    //interface problem..
    function withdraw(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) external override nonReentrant {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        strat.withdraw(_to, _wantAmt);
    }

    function withdraw(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        strat.withdraw(msg.sender, _wantAmt);
    }

    function withdrawAll(uint256 _pid) external override nonReentrant {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        strat.withdraw(msg.sender, type(uint256).max);
    }

    function harvest(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        strat.claimRewards(msg.sender, _wantAmt);
    }

    function harvestAll(uint256 _pid) external override nonReentrant {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        strat.claimRewards(msg.sender, type(uint256).max);
    }

    function addPool(address _strat) external override onlyOwner {
        require(!strats[_strat], "Existing strategy");
        vaults.push(_strat);
        strats[_strat] = true;

        emit AddPool(_strat);
    }

    function inCaseTokensGetStuck(address _token, uint256 _amount)
        external
        onlyOwner
    {
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    //Unused functions
    //TODO fix these function as tests are now annoying with {from: address} being last param
    function emergencyWithdraw(uint256 _pid) external nonReentrant {}

    function resetAllowances() external override {}

    function resetSingleAllowance(uint256 _pid) external override {}
}
