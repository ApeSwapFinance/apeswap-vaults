// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../StrategyBeltToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyBeltTokenFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultMasterBelt;
  address public defaultRouter;
  address public defaultBananaAddress;
  address public defaultUsdAddress;

  event DeployedBeltTokenStrategy(
    address indexed _vaultChefAddress,
    address _routerAddress,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWnativePath,
    address[] _earnedToUsdPath,
    address[] _earnedToBananaPath
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultMasterBelt) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
    defaultBananaAddress = _defaultBananaAddress;
    defaultUsdAddress = _defaultUsdAddress;
    defaultMasterBelt = _defaultUsdAddress;
  }

  /**
    address[2] _configAddress,
    _configAddress[0] _wantAddress,
    _configAddress[1] _earnedAddress,
    _configAddress[2] _oToken,
   */
  function deployDefaultBeltTokenStrategy(
        address[3] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath,
        uint256 _pid
    ) public {
    deployBeltTokenStrategy([defaultVaultChef, defaultRouter, _configAddresses[0], _configAddresses[1], defaultUsdAddress, defaultBananaAddress, defaultMasterBelt, _configAddresses[2], defaultGov], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _earnedToWantPath, _pid);
  }

    /**
    address[8] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _uniRouterAddress,
    _configAddress[2] _wantAddress,
    _configAddress[3]  _earnedAddress,
    _configAddress[4]  _usdAddress,
    _configAddress[5]  _bananaAddress,
    _configAddress[6]  _masterBelt,
    _configAddress[7]  _oToken,
    _configAddress[8]  _gov
   */
  function deployBeltTokenStrategy(
        address[9] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath,
        uint256 _pid
    ) public {
      StrategyBeltToken strategy = new StrategyBeltToken();

       /**
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _uniRouterAddress,
        _configAddresses[2]  _wantAddress,
        _configAddress[3]  _earnedAddress
        _configAddress[4]  _usdAddress
        _configAddress[5]  _bananaAddress
        _configAddress[6]  _masterBelt
        _configAddress[7]  _oToken
    */
      strategy.initialize([_configAddresses[0], _configAddresses[1], _configAddresses[2], _configAddresses[3], _configAddresses[4], _configAddresses[5], _configAddresses[6], _configAddresses[7]], _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _earnedToWantPath, _pid);

      strategy.setGov(_configAddresses[8]);

      emit DeployedBeltTokenStrategy(
        _configAddresses[0],
        _configAddresses[1],
        _configAddresses[2],
        _configAddresses[3],
        _earnedToWnativePath,
        _earnedToUsdPath,
        _earnedToBananaPath
      );
    }

    function updateDefaults (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultMasterBelt) external onlyOwner {
      defaultGov = _defaultGov;
      defaultVaultChef = _defaultVault;
      defaultRouter = _defaultRouter;
      defaultBananaAddress = _defaultBananaAddress;
      defaultUsdAddress = _defaultUsdAddress;
      defaultMasterBelt = _defaultMasterBelt;
    }

}