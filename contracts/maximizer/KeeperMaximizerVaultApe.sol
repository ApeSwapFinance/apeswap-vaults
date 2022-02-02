pragma solidity ^0.8.6;

import "./MaximizerVaultApe.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract KeeperMaximizerVaultApe is
    MaximizerVaultApe,
    KeeperCompatibleInterface
{
    address public keeper;

    constructor(
        address _keeper,
        address _owner,
        address _bananaVault
    ) MaximizerVaultApe(_owner, _bananaVault) {
        keeper = _keeper;
    }

    modifier onlyKeeper() {
        require(
            msg.sender == keeper,
            "MaximizerVaultApe: onlyKeeper: Not keeper"
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

        BANANA_VAULT.earn();
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

    function setKeeper(address _keeper) public onlyOwner {
        keeper = _keeper;
    }
}
