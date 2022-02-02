// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "../libs/IVaultApeMaximizer.sol";
import "../libs/IStrategyMaximizer.sol";
import "../libs/IBananaVault.sol";

contract VaultApeMaximizerKeeper is
    ReentrancyGuard,
    IVaultApeMaximizer,
    Ownable,
    KeeperCompatibleInterface
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct VaultInfo {
        uint256 lastCompound;
        bool enabled;
    }

    struct CompoundInfo {
        address[] vaults;
        uint256[] minPlatformOutputs;
        uint256[] minKeeperOutputs;
        uint256[] minBurnOutputs;
        uint256[] minBananaOutputs;
    }

    address[] public vaults;
    mapping(address => VaultInfo) public vaultInfos;
    IBananaVault public BANANA_VAULT;

    address public keeper;
    address public moderator;

    uint256 public maxDelay;
    uint256 public minKeeperFee;
    uint256 public slippageFactor;
    uint16 public maxVaults;

    event Compound(address indexed vault, uint256 timestamp);

    constructor(
        address _keeper,
        address _owner,
        address _bananaVault
    ) Ownable() {
        keeper = _keeper;

        transferOwnership(_owner);

        BANANA_VAULT = IBananaVault(_bananaVault);

        maxDelay = 1 seconds; //1 days;
        minKeeperFee = 10000000000000000;
        slippageFactor = 9500;
        maxVaults = 2;
    }

    modifier onlyEOA() {
        // only allowing externally owned addresses.
        require(msg.sender == tx.origin, "VaultApeMaximizer: must use EOA");
        _;
    }

    modifier onlyKeeper() {
        require(
            msg.sender == keeper,
            "VaultApeMaximizerKeeper: onlyKeeper: Not keeper"
        );
        _;
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        (upkeepNeeded, performData) = checkVaultCompound();

        if (upkeepNeeded) {
            return (upkeepNeeded, performData);
        }

        return (false, "");
    }

    function checkVaultCompound()
        public
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 totalLength = vaults.length;
        uint256 actualLength = 0;

        CompoundInfo memory tempCompoundInfo = CompoundInfo(
            new address[](totalLength),
            new uint256[](totalLength),
            new uint256[](totalLength),
            new uint256[](totalLength),
            new uint256[](totalLength)
        );

        for (uint16 index = 0; index < totalLength; ++index) {
            if (maxVaults == actualLength) {
                continue;
            }

            address vault = vaults[index];
            VaultInfo memory vaultInfo = vaultInfos[vault];

            if (
                !vaultInfo.enabled ||
                IStrategyMaximizer(vault).totalStake() == 0
            ) {
                continue;
            }

            (
                uint256 platformOutput,
                uint256 keeperOutput,
                uint256 burnOutput,
                uint256 bananaOutput
            ) = _getExpectedOutputs(vault);

            if (
                block.timestamp >= vaultInfo.lastCompound + maxDelay ||
                keeperOutput >= minKeeperFee
            ) {
                tempCompoundInfo.vaults[actualLength] = vault;
                tempCompoundInfo.minPlatformOutputs[
                    actualLength
                ] = platformOutput.mul(slippageFactor).div(10000);
                tempCompoundInfo.minKeeperOutputs[actualLength] = keeperOutput
                    .mul(slippageFactor)
                    .div(10000);
                tempCompoundInfo.minBurnOutputs[actualLength] = burnOutput
                    .mul(slippageFactor)
                    .div(10000);
                tempCompoundInfo.minBananaOutputs[actualLength] = bananaOutput
                    .mul(slippageFactor)
                    .div(10000);

                actualLength = actualLength + 1;
            }
        }

        if (actualLength > 0) {
            CompoundInfo memory compoundInfo = CompoundInfo(
                new address[](actualLength),
                new uint256[](actualLength),
                new uint256[](actualLength),
                new uint256[](actualLength),
                new uint256[](actualLength)
            );

            for (uint16 index = 0; index < actualLength; ++index) {
                compoundInfo.vaults[index] = tempCompoundInfo.vaults[index];
                compoundInfo.minPlatformOutputs[index] = tempCompoundInfo
                    .minPlatformOutputs[index];
                compoundInfo.minKeeperOutputs[index] = tempCompoundInfo
                    .minKeeperOutputs[index];
                compoundInfo.minBurnOutputs[index] = tempCompoundInfo
                    .minBurnOutputs[index];
                compoundInfo.minBananaOutputs[index] = tempCompoundInfo
                    .minBananaOutputs[index];
            }

            return (
                true,
                abi.encode(
                    compoundInfo.vaults,
                    compoundInfo.minPlatformOutputs,
                    compoundInfo.minKeeperOutputs,
                    compoundInfo.minBurnOutputs,
                    compoundInfo.minBananaOutputs
                )
            );
        }

        return (false, "");
    }

    function performUpkeep(bytes calldata performData)
        external
        override
        onlyKeeper
    {
        (
            address[] memory _vaults,
            uint256[] memory _minPlatformOutputs,
            uint256[] memory _minKeeperOutputs,
            uint256[] memory _minBurnOutputs,
            uint256[] memory _minBananaOutputs
        ) = abi.decode(
                performData,
                (address[], uint256[], uint256[], uint256[], uint256[])
            );

        _earn(
            _vaults,
            _minPlatformOutputs,
            _minKeeperOutputs,
            _minBurnOutputs,
            _minBananaOutputs
        );
    }

    function compound(address _vault) public {
        VaultInfo memory vaultInfo = vaultInfos[_vault];
        uint256 timestamp = block.timestamp;

        require(
            vaultInfo.lastCompound < timestamp - 12 hours,
            "VaultApeMaximizerKeeper: compound: Too soon"
        );

        return _compoundVault(_vault, 0, 0, 0, 0, timestamp);
    }

    function _compoundVault(
        address _vault,
        uint256 _minPlatformOutput,
        uint256 _minKeeperOutput,
        uint256 _minBurnOutput,
        uint256 _minBananaOutput,
        uint256 timestamp
    ) private {
        IStrategyMaximizer(_vault).earn(
            _minPlatformOutput,
            _minKeeperOutput,
            _minBurnOutput,
            _minBananaOutput
        );

        vaultInfos[_vault].lastCompound = timestamp;

        emit Compound(_vault, timestamp);
    }

    function _earn(
        address[] memory _vaults,
        uint256[] memory _minPlatformOutputs,
        uint256[] memory _minKeeperOutputs,
        uint256[] memory _minBurnOutputs,
        uint256[] memory _minBananaOutputs
    ) private {
        uint256 timestamp = block.timestamp;
        uint256 length = _vaults.length;

        for (uint256 index = 0; index < length; ++index) {
            _compoundVault(
                _vaults[index],
                _minPlatformOutputs[index],
                _minKeeperOutputs[index],
                _minBurnOutputs[index],
                _minBananaOutputs[index],
                timestamp
            );
        }
    }

    function _getExpectedOutputs(address _vault)
        private
        view
        returns (
            uint256 platformOutput,
            uint256 keeperOutput,
            uint256 burnOutput,
            uint256 bananaOutput
        )
    {
        // try IStrategyMaximizer(_vault).getExpectedOutputs() returns (
        //     uint256,
        //     uint256,
        //     uint256,
        //     uint256
        // ) {
        //     return (platformOutput, keeperOutput, burnOutput, bananaOutput);
        // } catch (bytes memory) {}

        (
            platformOutput,
            keeperOutput,
            burnOutput,
            bananaOutput
        ) = IStrategyMaximizer(_vault).getExpectedOutputs();
    }

    function vaultsLength() external view override returns (uint256) {
        return vaults.length;
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

    function accSharesPerStakedToken(uint256 _pid)
        external
        view
        returns (uint256)
    {
        IStrategyMaximizer strat = IStrategyMaximizer(vaults[_pid]);
        return strat.accSharesPerStakedToken();
    }

    // function earnAll() public override {
    //     for (uint256 i = 0; i < vaults.length; i++) {
    //         IStrategyMaximizer(vaults[i]).earn(0, 0, 0, 0);
    //     }

    //     BANANA_VAULT.harvest();
    // }

    // function earnSome(uint256[] memory pids) external override {
    //     for (uint256 i = 0; i < pids.length; i++) {
    //         if (vaults.length >= pids[i]) {
    //             IStrategyMaximizer(vaults[pids[i]]).earn(0, 0, 0, 0);
    //         }
    //     }

    //     BANANA_VAULT.harvest();
    // }

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

    // ===== OWNER only functions =====
    function addVault(address _vault) public override onlyOwner {
        require(
            vaultInfos[_vault].lastCompound == 0,
            "VaultApeMaximizerKeeper: addVault: Vault already exists"
        );

        vaultInfos[_vault] = VaultInfo(block.timestamp, true);

        bytes32 DEPOSIT_ROLE = BANANA_VAULT.DEPOSIT_ROLE();
        BANANA_VAULT.grantRole(DEPOSIT_ROLE, _vault);

        vaults.push(_vault);
    }

    function addVaults(address[] memory _vaults) public onlyOwner {
        for (uint256 index = 0; index < _vaults.length; ++index) {
            addVault(_vaults[index]);
        }
    }

    function inCaseTokensGetStuck(address _token, uint256 _amount)
        external
        onlyOwner
    {
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function enableVault(address _vault) external onlyOwner {
        vaultInfos[_vault].enabled = true;
    }

    function disableVault(address _vault) external onlyOwner {
        vaultInfos[_vault].enabled = false;
    }

    function setKeeper(address _keeper) public onlyOwner {
        keeper = _keeper;
    }

    function setModerator(address _moderator) public onlyOwner {
        moderator = _moderator;
    }

    function setMaxDelay(uint256 _maxDelay) public onlyOwner {
        maxDelay = _maxDelay;
    }

    function setMinKeeperFee(uint256 _minKeeperFee) public onlyOwner {
        minKeeperFee = _minKeeperFee;
    }

    function setSlippageFactor(uint256 _slippageFactor) public onlyOwner {
        slippageFactor = _slippageFactor;
    }

    function setMaxVaults(uint16 _maxVaults) public onlyOwner {
        maxVaults = _maxVaults;
    }
}
