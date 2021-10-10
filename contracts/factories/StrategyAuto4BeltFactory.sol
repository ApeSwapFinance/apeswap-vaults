// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../StrategyAuto4Belt.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyAuto4BeltFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultAutoFarm;
  address public defaultRouter;
  address public defaultBananaAddress;
  address public defaultUsdAddress;

  event DeployedAuto4BeltStrategy(
    address indexed _vaultChefAddress,
    address _routerAddress,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWnativePath,
    address[] _earnedToUsdPath,
    address[] _earnedToBananaPath
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultAutoFarm) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
    defaultBananaAddress = _defaultBananaAddress;
    defaultUsdAddress = _defaultUsdAddress;
    defaultAutoFarm = _defaultAutoFarm;
  }

  /**
    address[2] _configAddress,
    _configAddress[0] _wantAddress,
    _configAddress[1] _earnedAddress,
    _configAddress[2] _beltLp,
   */
  function deployDefaultAuto4BeltStrategy(
        address[3] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        uint256 _pid
    ) public {
    deployAuto4BeltStrategy([defaultVaultChef, defaultAutoFarm, defaultRouter, _configAddresses[0], _configAddresses[1], defaultUsdAddress, defaultBananaAddress, _configAddresses[2], defaultGov], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _pid);
  }

    /**
    address[8] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _autoFarm,
    _configAddress[2] _uniRouterAddress,
    _configAddress[3] _wantAddress,
    _configAddress[4]  _earnedAddress,
    _configAddress[5]  _usdAddress,
    _configAddress[6]  _bananaAddress,
    _configAddress[7]  _beltLp,
    _configAddress[8]  _gov
   */
  function deployAuto4BeltStrategy(
        address[9] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        uint256 _pid
    ) public {
      StrategyAuto4Belt strategy = new StrategyAuto4Belt();

    /**
        address[8] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _autoFarm,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress
        _configAddress[7]  _beltLp
    */
      strategy.initialize([_configAddresses[0], _configAddresses[1], _configAddresses[2], _configAddresses[3], _configAddresses[4], _configAddresses[5], _configAddresses[6], _configAddresses[7]], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _pid);

      strategy.setGov(_configAddresses[8]);

      emit DeployedAuto4BeltStrategy(
        _configAddresses[0],
        _configAddresses[1],
        _configAddresses[2],
        _configAddresses[3],
        _earnedToWnativePath,
        _earnedToUsdPath,
        _earnedToBananaPath
      );
    }

    function updateDefaults (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultAutoFarm) external onlyOwner {
      defaultGov = _defaultGov;
      defaultVaultChef = _defaultVault;
      defaultRouter = _defaultRouter;
      defaultBananaAddress = _defaultBananaAddress;
      defaultUsdAddress = _defaultUsdAddress;
      defaultAutoFarm = _defaultAutoFarm;
    }

}