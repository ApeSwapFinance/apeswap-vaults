// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

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

import "./MaximizerVaultApe.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

// TODO: Add getting the expected outputs with a twap
/// @title Keeper Maximizer VaultApe
/// @author ApeSwapFinance
/// @notice Chainlink keeper compatible MaximizerVaultApe
contract KeeperMaximizerVaultApe is
    MaximizerVaultApe,
    KeeperCompatibleInterface
{
    address public keeper;

    constructor(
        address _keeper,
        address _owner,
        address _bananaVault,
        address _defaultTreasury,
        address _defaultPlatform
    )
        MaximizerVaultApe(
            _owner,
            _bananaVault,
            _defaultTreasury,
            _defaultPlatform
        )
    {
        keeper = _keeper;
    }

    modifier onlyKeeper() {
        require(
            msg.sender == keeper,
            "MaximizerVaultApe: onlyKeeper: Not keeper"
        );
        _;
    }

    /// @notice Chainlink keeper checkUpkeep
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

    /// @notice Chainlink keeper performUpkeep
    /// @param performData response from checkUpkeep
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

        uint256 timestamp = block.timestamp;
        uint256 length = _vaults.length;

        for (uint256 index = 0; index < length; ++index) {
            _compoundVault(
                _vaults[index],
                _minPlatformOutputs[index],
                _minKeeperOutputs[index],
                _minBurnOutputs[index],
                _minBananaOutputs[index],
                timestamp,
                true
            );
        }

        BANANA_VAULT.earn();
    }

    function setKeeper(address _keeper) public onlyOwner {
        keeper = _keeper;
    }
}
