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
        uint256 _maxDelay,
        Settings memory _settings
    ) MaximizerVaultApe(_owner, _bananaVault, _maxDelay, _settings) {
        keeper = _keeper;
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
    function performUpkeep(bytes calldata performData) external override {
        (
            address _vault,
            uint256 _minPlatformOutput,
            uint256 _minKeeperOutput,
            uint256 _minBurnOutput,
            uint256 _minBananaOutput
        ) = abi.decode(
                performData,
                (address, uint256, uint256, uint256, uint256)
            );

        uint256 timestamp = block.timestamp;

        _compoundVault(
            _vault,
            _minPlatformOutput,
            _minKeeperOutput,
            _minBurnOutput,
            _minBananaOutput,
            timestamp,
            true
        );

        BANANA_VAULT.earn();
    }

    function setKeeper(address _keeper) public onlyOwner {
        keeper = _keeper;
    }
}
