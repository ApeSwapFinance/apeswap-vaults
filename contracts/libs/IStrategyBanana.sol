// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IStrategyBanana {
    function depositReward(uint256 _depositAmt) external returns (bool);
}