// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IVaultApe.sol";

interface IVaultApeMaximizer is IVaultApe {

    function harvest(
        uint256 _pid,
        uint256 _wantAmt,
        address _to
    ) external;

    function harvest(uint256 _pid, uint256 _wantAmt) external;
}
