// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../StrategyMasterChefSingle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyMasterChefSingleFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultRouter;

  event DeployedMasterChefSingleStrategy(
    address indexed _vaultChefAddress,
    address _masterchefAddress,
    address _routerAddress,
    uint256 _pid,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWmaticPath,
    address[] _earnedToUsdcPath,
    address[] _earnedToBananaPath
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
  }

  /**
    address[3] _configAddress,
    _configAddress[0] _masterchefAddress,
    _configAddress[1] _wantAddress,
    _configAddress[2] _earnedAddress,
   */
  function deployDefaultMasterChefStrategy(
        address[3] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWmaticPath,
        address[] memory _earnedToUsdcPath,
        address[] memory _earnedToBananaPath
    ) public {
    deployMasterChefSingleStrategy([defaultVaultChef, _configAddresses[0], defaultRouter, _configAddresses[1], _configAddresses[2], defaultGov], _pid, _earnedToWmaticPath, _earnedToUsdcPath, _earnedToBananaPath);
  }

    /**
    address[6] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _masterchefAddress,
    _configAddress[2] _uniRouterAddress,
    _configAddress[3] _wantAddress,
    _configAddress[4]  _earnedAddress,
    _configAddress[5]  _gov
   */
  function deployMasterChefSingleStrategy(
        address[6] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWmaticPath,
        address[] memory _earnedToUsdcPath,
        address[] memory _earnedToBananaPath
    ) public {
      StrategyMasterChefSingle strategy = new StrategyMasterChefSingle();

      /**
        address[0] _vaultChefAddress,
        address[1] _masterchefAddress,
        address[2] _uniRouterAddress,
        address[3]  _wantAddress,
        address[4]  _earnedAddress
      */
      strategy.initialize([_configAddresses[0], _configAddresses[1], _configAddresses[2], _configAddresses[3], _configAddresses[4]], _pid, _earnedToWmaticPath, _earnedToUsdcPath, _earnedToBananaPath);

      strategy.setGov(_configAddresses[5]);

      emit DeployedMasterChefSingleStrategy(
        _configAddresses[0],
        _configAddresses[1],
        _configAddresses[2],
        _pid,
        _configAddresses[3],
        _configAddresses[4],
        _earnedToWmaticPath,
        _earnedToUsdcPath,
        _earnedToBananaPath
      );
    }

    function updateDefaults (address _defaultGov, address _defaultVault, address _defaultRouter) external onlyOwner {
      defaultGov = _defaultGov;
      defaultVaultChef = _defaultVault;
      defaultRouter = _defaultRouter;
    }

}