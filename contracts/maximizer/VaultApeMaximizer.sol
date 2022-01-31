// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "../libs/IVaultApeMaximizer.sol";
import "../libs/IStrategyMaximizer.sol";
import "../libs/IBananaVault.sol";

contract VaultApeMaximizer is
    IVaultApeMaximizer,
    ReentrancyGuard,
    Ownable,
    KeeperCompatibleInterface
{
    using SafeERC20 for IERC20;

    address[] public vaults;
    mapping(address => bool) public strats;
    IBananaVault public BANANA_VAULT;

    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    event AddVault(address indexed strat);
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    modifier onlyEOA() {
        // only allowing externally owned addresses.
        require(msg.sender == tx.origin, "VaultApeMaximizer: must use EOA");
        _;
    }

    constructor(address _bananaVault, uint256 _updateInterval) {
        BANANA_VAULT = IBananaVault(_bananaVault);
        interval = _updateInterval;
        lastTimeStamp = block.timestamp;
    }

    function userInfo(uint256 _pid, address _user)
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

    function accSharesPerStakedToken(uint256 _pid)
        external
        view
        returns (uint256)
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        return strat.accSharesPerStakedToken();
    }

    function vaultsLength() external view override returns (uint256) {
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

    function earnAll() public {
        for (uint256 i = 0; i < vaults.length; i++) {
            IStrategyMaximizer(vaults[i]).earn(0, 0, 0, 0);
        }

        BANANA_VAULT.harvest();
    }

    function earnSome(uint256[] memory pids) external {
        for (uint256 i = 0; i < pids.length; i++) {
            if (vaults.length >= pids[i]) {
                IStrategyMaximizer(vaults[pids[i]]).earn(0, 0, 0, 0);
            }
        }

        BANANA_VAULT.harvest();
    }

    function deposit(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
        onlyEOA
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        IERC20 wantToken = IERC20(strat.STAKED_TOKEN_ADDRESS());
        wantToken.safeTransferFrom(msg.sender, address(strat), _wantAmt);
        strat.deposit(msg.sender);
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

    // ===== Chainlink Keeper functions =====
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        return (upkeepNeeded, "");
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        lastTimeStamp = block.timestamp;
        earnAll();
    }

    // ===== OWNER functions =====
    function addVault(address _strat) external override onlyOwner {
        require(!strats[_strat], "Existing strategy");
        vaults.push(_strat);
        strats[_strat] = true;

        emit AddVault(_strat);
    }

    function inCaseTokensGetStuck(address _token, uint256 _amount)
        external
        onlyOwner
    {
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }
}
