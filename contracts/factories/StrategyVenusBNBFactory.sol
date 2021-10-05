// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../StrategyVenusBNB.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyVenusBNBFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultRouter;
  address public defaultBananaAddress;
  address public defaultUsdAddress;

  event DeployedVenusBNBStrategy(
    address indexed _vaultChefAddress,
    address _routerAddress,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWnativePath,
    address[] _earnedToUsdPath,
    address[] _earnedToBananaPath
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
    defaultBananaAddress = _defaultBananaAddress;
    defaultUsdAddress = _defaultUsdAddress;
  }

  /**
    address[2] _configAddress,
    _configAddress[0] _wantAddress,
    _configAddress[1] _earnedAddress,
   */
  function deployDefaultVenusBNBStrategy(
        address[2] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath
    ) public {
    deployVenusBNBStrategy([defaultVaultChef, defaultRouter, _configAddresses[0], _configAddresses[1], defaultUsdAddress, defaultBananaAddress, defaultGov], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath);
  }

    /**
    address[8] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _uniRouterAddress,
    _configAddress[2] _wantAddress,
    _configAddress[3]  _earnedAddress,
    _configAddress[4]  _usdAddress,
    _configAddress[5]  _bananaAddress,
    _configAddress[6]  _gov
   */
  function deployVenusBNBStrategy(
        address[7] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath
    ) public {
      StrategyVenusBNB strategy = new StrategyVenusBNB();

      /**
        _configAddresses[0]     _vaultChefAddress,
        _configAddresses[1]     _uniRouterAddress,
        _configAddresses[2]     _wantAddress,
        _configAddress[3]       _earnedAddress,
        _configAddress[4]       _usdAddress,
        _configAddress[5]       _bananaAddress
      */
      strategy.initialize([_configAddresses[0], _configAddresses[1], _configAddresses[2], _configAddresses[3], _configAddresses[4], _configAddresses[5]], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath);

      strategy.setGov(_configAddresses[6]);

      emit DeployedVenusBNBStrategy(
        _configAddresses[0],
        _configAddresses[1],
        _configAddresses[2],
        _configAddresses[3],
        _earnedToWnativePath,
        _earnedToUsdPath,
        _earnedToBananaPath
      );
    }

    function updateDefaults (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress) external onlyOwner {
      defaultGov = _defaultGov;
      defaultVaultChef = _defaultVault;
      defaultRouter = _defaultRouter;
      defaultBananaAddress = _defaultBananaAddress;
      defaultUsdAddress = _defaultUsdAddress;
    }

}