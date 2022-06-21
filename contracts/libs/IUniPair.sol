// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IUniPair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function transfer(address to, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
}