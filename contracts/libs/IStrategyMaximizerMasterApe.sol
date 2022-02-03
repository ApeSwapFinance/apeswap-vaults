// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// For interacting with our own strategy
interface IStrategyMaximizerMasterApe {
    function STAKED_TOKEN_ADDRESS() external returns (address);
    
    function vaultApe() external returns (address);

    function accSharesPerStakedToken() external view returns (uint256);

    function totalStake() external view returns (uint256);

    function getExpectedOutputs()
        external
        view
        returns (
            uint256 platformOutput,
            uint256 keeperOutput,
            uint256 burnOutput,
            uint256 bananaOutput
        );

    function userInfo(address)
        external
        view
        returns (
            uint256 stake,
            uint256 autoBananaShares,
            uint256 rewardDebt,
            uint256 lastDepositedTime
        );

    // Main want token compounding function
    function earn(
        uint256 _minPlatformOutput,
        uint256 _minKeeperOutput,
        uint256 _minBurnOutput,
        uint256 _minBananaOutput
    ) external;

    // Transfer want tokens autoFarm -> strategy
    function deposit(address _userAddress) external;

    // Transfer want tokens strategy -> vaultChef
    function withdraw(address _userAddress, uint256 _wantAmt) external;

    function claimRewards(address _userAddress, uint256 _shares) external;
}
