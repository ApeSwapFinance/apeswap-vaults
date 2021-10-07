// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IBeltMultiStrategyToken {
    function deposit(uint256 _amount, uint256 _minShares) external;

    function depositBNB(uint256 _minShares) external;
}
