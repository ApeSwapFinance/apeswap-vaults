// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../libs/IMaximizerVaultApe.sol";
import "../libs/IStrategyMaximizerMasterApe.sol";
import "../libs/IBananaVault.sol";

contract MaximizerVaultApe is
    ReentrancyGuard,
    IMaximizerVaultApe,
    Ownable
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

    address public moderator;

    uint256 public maxDelay;
    uint256 public minKeeperFee;
    uint256 public slippageFactor;
    uint16 public maxVaults;

    event Compound(address indexed vault, uint256 timestamp);

    constructor(
        address _owner,
        address _bananaVault
    ) Ownable() {
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
                IStrategyMaximizerMasterApe(vault).totalStake() == 0
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

    function compound(address _vault) public {
        VaultInfo memory vaultInfo = vaultInfos[_vault];
        uint256 timestamp = block.timestamp;

        require(
            vaultInfo.lastCompound < timestamp - 12 hours,
            "MaximizerVaultApe: compound: Too soon"
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
    ) internal {
        IStrategyMaximizerMasterApe(_vault).earn(
            _minPlatformOutput,
            _minKeeperOutput,
            _minBurnOutput,
            _minBananaOutput
        );

        vaultInfos[_vault].lastCompound = timestamp;

        emit Compound(_vault, timestamp);
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
        // try IStrategyMaximizerMasterApe(_vault).getExpectedOutputs() returns (
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
        ) = IStrategyMaximizerMasterApe(_vault).getExpectedOutputs();
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
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        (stake, autoBananaShares, rewardDebt, lastDepositedTime) = strat
            .userInfo(_user);
    }

    function stakedWantTokens(uint256 _pid, address _user)
        external
        view
        override
        returns (uint256)
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        (uint256 stake, , , ) = strat.userInfo(_user);
        return stake;
    }

    function accSharesPerStakedToken(uint256 _pid)
        external
        view
        returns (uint256)
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        return strat.accSharesPerStakedToken();
    }

    function deposit(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
        onlyEOA
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        IERC20 wantToken = IERC20(strat.STAKED_TOKEN_ADDRESS());
        wantToken.safeTransferFrom(msg.sender, address(strat), _wantAmt);
        strat.deposit(msg.sender);
    }

    function withdraw(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        strat.withdraw(msg.sender, _wantAmt);
    }

    function withdrawAll(uint256 _pid) external override nonReentrant {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        strat.withdraw(msg.sender, type(uint256).max);
    }

    function harvest(uint256 _pid, uint256 _wantAmt)
        external
        override
        nonReentrant
    {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        strat.claimRewards(msg.sender, _wantAmt);
    }

    function harvestAll(uint256 _pid) external override nonReentrant {
        IStrategyMaximizerMasterApe strat = IStrategyMaximizerMasterApe(
            vaults[_pid]
        );
        strat.claimRewards(msg.sender, type(uint256).max);
    }

    // ===== OWNER only functions =====
    function addVault(address _vault) public override onlyOwner {
        require(
            vaultInfos[_vault].lastCompound == 0,
            "MaximizerVaultApe: addVault: Vault already exists"
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
