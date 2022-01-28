// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IVaultApe.sol";

interface IVaultApeMaximizer is IVaultApe {
    function userInfo2(uint256 _pid, address _user)
        external
        view
        returns (
            uint256 stake,
            uint256 autoBananaShares,
            uint256 rewardDebt,
            uint256 lastDepositedTime
        );

    function harvest(uint256 _pid, uint256 _wantAmt) external;

    function harvestAll(uint256 _pid) external;
}
