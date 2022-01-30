// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "../libs/IVaultApeMaximizer.sol";
import "../libs/IStrategyMaximizer.sol";
import "../libs/IBananaVault.sol";

contract VaultApeMaximizerKeeper is Ownable, KeeperCompatibleInterface {
    using SafeMath for uint256;

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

    address public keeper;
    address public moderator;

    uint256 public maxDelay;
    uint256 public minKeeperFee;
    uint256 public slippageFactor;
    uint16 public maxVaults;

    event Compound(address indexed vault, uint256 timestamp);

    constructor(address _keeper, address _owner) Ownable() {
        keeper = _keeper;

        transferOwnership(_owner);

        maxDelay = 1 days;
        minKeeperFee = 10000000000000000;
        slippageFactor = 9500;
        maxVaults = 2;
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
                uint256 pacocaOutput
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
                tempCompoundInfo.minBananaOutputs[actualLength] = pacocaOutput
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

    function vaultsLength() external view returns (uint256) {
        return vaults.length;
    }

    function addVault(address _vault) public onlyOwner {
        require(
            vaultInfos[_vault].lastCompound == 0,
            "VaultApeMaximizerKeeper: addVault: Vault already exists"
        );

        vaultInfos[_vault] = VaultInfo(block.timestamp, true);

        vaults.push(_vault);
    }

    function addVaults(address[] memory _vaults) public onlyOwner {
        for (uint256 index = 0; index < _vaults.length; ++index) {
            addVault(_vaults[index]);
        }
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
