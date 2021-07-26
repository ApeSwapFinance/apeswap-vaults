// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./StrategyMasterChef.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenVestingFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultRouter;

  event DeployedMasterChefStrategy(
    address _vaultChefAddress,
    address _masterchefAddress,
    address _uniRouterAddress,
    uint256 _pid,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWmaticPath,
    address[] _earnedToUsdcPath,
    address[] _earnedToBananaPath,
    address[] _earnedToToken0Path,
    address[] _earnedToToken1Path,
    address[] _token0ToEarnedPath,
    address[] _token1ToEarnedPath,
    address _gov
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
  }

  function deployDefaultMasterChefStrategy(
        address _masterchefAddress,
        uint256 _pid,
        address _wantAddress,
        address _earnedAddress,
        address[] memory _earnedToWmaticPath,
        address[] memory _earnedToUsdcPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToToken0Path,
        address[] memory _earnedToToken1Path,
        address[] memory _token0ToEarnedPath,
        address[] memory _token1ToEarnedPath
    ) public {
    deployMasterChefStrategy(defaultVaultChef, _masterchefAddress, defaultRouter, _pid, _wantAddress, _earnedAddress, _earnedToWmaticPath, _earnedToUsdcPath, _earnedToBananaPath, _earnedToToken0Path, _earnedToToken1Path, _token0ToEarnedPath, _token1ToEarnedPath, defaultGov);
  }

  function deployMasterChefStrategy(
        address _vaultChefAddress,
        address _masterchefAddress,
        address _uniRouterAddress,
        uint256 _pid,
        address _wantAddress,
        address _earnedAddress,
        address[] memory _earnedToWmaticPath,
        address[] memory _earnedToUsdcPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToToken0Path,
        address[] memory _earnedToToken1Path,
        address[] memory _token0ToEarnedPath,
        address[] memory _token1ToEarnedPath,
        address _gov
    ) public {
      StrategyMasterChef strategy = new StrategyMasterChef();

      strategy.initialize(_vaultChefAddress, _masterchefAddress, _uniRouterAddress, _pid, _wantAddress, _earnedAddress, _earnedToWmaticPath, _earnedToUsdcPath, _earnedToBananaPath, _earnedToToken0Path, _earnedToToken1Path, _token0ToEarnedPath, _token1ToEarnedPath);

      strategy.setGov(_gov);

      emit DeployedMasterChefStrategy(
        _vaultChefAddress,
        _masterchefAddress,
        _uniRouterAddress,
        _pid,
        _wantAddress,
        _earnedAddress,
        _earnedToWmaticPath,
        _earnedToUsdcPath,
        _earnedToBananaPath,
        _earnedToToken0Path,
        _earnedToToken1Path,
        _token0ToEarnedPath,
        _token1ToEarnedPath,
        _gov
      );
    }

    function updateDefaults (address _defaultGov, address _defaultVault, address _defaultRouter) external onlyOwner {
      defaultGov = _defaultGov;
      defaultVaultChef = _defaultVault;
      defaultRouter = _defaultRouter;
    }

}