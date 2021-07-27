// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IMiniChefStake {
    function deposit(uint256 pid, uint256 amount, address to) external;

    function withdraw(uint256 pid, uint256 amount, address to) external;

    function emergencyWithdraw(uint256 pid, address to) external;

    function harvest(uint256 pid, address to) external;
    
    function userInfo(uint256 _pid, address _user) external view returns (uint256, uint256);
}