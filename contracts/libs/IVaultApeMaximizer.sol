// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IVaultApeMaximizer {
    function userInfo(uint256 _pid, address _user)
        external
        view
        returns (
            uint256 stake,
            uint256 autoBananaShares,
            uint256 rewardDebt,
            uint256 lastDepositedTime
        );

    function vaultsLength() external view returns (uint256);

    function addVault(address _strat) external;

    function stakedWantTokens(uint256 _pid, address _user)
        external
        view
        returns (uint256);

    function deposit(uint256 _pid, uint256 _wantAmt) external;

    function withdraw(uint256 _pid, uint256 _wantAmt) external;

    function withdrawAll(uint256 _pid) external;

    // function earnAll() external;

    // function earnSome(uint256[] memory pids) external;

    function harvest(uint256 _pid, uint256 _wantAmt) external;

    function harvestAll(uint256 _pid) external;
}