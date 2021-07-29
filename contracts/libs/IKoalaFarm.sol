// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IKoalaFarm {
    function deposit(uint256 _pid, uint256 _amount, address _referrer, bool _lyptusFee) external;
    function withdraw(uint256 _pid, uint256 _amount) external;
    function emergencyWithdraw(uint256 _pid) external;
    function userInfo(uint256 _pid, address _address) external view returns (uint256, uint256);
}
