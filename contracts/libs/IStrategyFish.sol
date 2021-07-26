// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IStrategyFish {
    function depositReward(uint256 _depositAmt) external returns (bool);
}