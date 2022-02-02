// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/access/IAccessControlEnumerable.sol";

interface IBananaVault is IAccessControlEnumerable {
    function DEPOSIT_ROLE() external view returns (bytes32);

    function userInfo(address _address)
        external
        view
        returns (
            uint256 shares,
            uint256 lastDepositedTime,
            uint256 pacocaAtLastUserAction,
            uint256 lastUserActionTime
        );

    function earn() external;

    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;
}
