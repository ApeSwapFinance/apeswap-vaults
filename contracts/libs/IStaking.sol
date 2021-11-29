// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IStaking {
    function deposit(uint256 _amount) external;

    function withdraw(uint256 _amount) external;

    function emergencyWithdraw() external;
    
    function userInfo(address _address) external view returns (uint256, uint256);
}