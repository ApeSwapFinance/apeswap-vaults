// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../StrategyKoalaChefSingle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StrategyKoalaChefSingleFactory is Ownable {
  address public defaultGov;
  address public defaultVaultChef;
  address public defaultRouter;
  address public defaultBananaAddress;
  address public defaultUsdAddress;

  event DeployedKoalaChefSingleStrategy(
    address indexed _vaultChefAddress,
    address _masterchefAddress,
    address _routerAddress,
    uint256 _pid,
    address _wantAddress,
    address _earnedAddress,
    address[] _earnedToWnativePath,
    address[] _earnedToUsdPath,
    address[] _earnedToBananaPath,
    address[] _earnedToWantPath
  );

  constructor (address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress) {
    defaultGov = _defaultGov;
    defaultVaultChef = _defaultVault;
    defaultRouter = _defaultRouter;
    defaultBananaAddress = _defaultBananaAddress;
    defaultUsdAddress = _defaultUsdAddress;
  }

  /**
    address[3] _configAddress,
    _configAddress[0] _masterchefAddress,
    _configAddress[1] _wantAddress,
    _configAddress[2] _earnedAddress,
   */
  function deployDefaultKoalaChefSingleStrategy(
        address[3] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath
    ) public {
    deployKoalaChefSingleStrategy([defaultVaultChef, _configAddresses[0], defaultRouter, _configAddresses[1], _configAddresses[2], defaultUsdAddress, defaultBananaAddress, defaultGov], _pid, _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _earnedToWantPath);
  }

    /**
    address[8] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _masterchefAddress,
    _configAddress[2] _uniRouterAddress,
    _configAddress[3] _wantAddress,
    _configAddress[4]  _earnedAddress,
    _configAddress[5]  _usdAddress,
    _configAddress[6]  _bananaAddress,
    _configAddress[7]  _gov
   */
  function deployKoalaChefSingleStrategy(
        address[8] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath
    ) public {
      StrategyKoalaChefSingle strategy = new StrategyKoalaChefSingle();

      /**
        address[0] _vaultChefAddress,
        address[1] _masterchefAddress,
        address[2] _uniRouterAddress,
        address[3]  _wantAddress,
        address[4]  _earnedAddress
      */
      strategy.initialize([_configAddresses[0], _configAddresses[1], _configAddresses[2], _configAddresses[3], _configAddresses[4], _configAddresses[5], _configAddresses[6]], _pid, _earnedToWnativePath, _earnedToUsdPath, _earnedToBananaPath, _earnedToWantPath);

      strategy.setGov(_configAddresses[7]);

      emit DeployedKoalaChefSingleStrategy(
        _configAddresses[0],
        _configAddresses[1],
        _configAddresses[2],
        _pid,
        _configAddresses[3],
        _configAddresses[4],
        _earnedToWnativePath,
        _earnedToUsdPath,
        _earnedToBananaPath,
        _earnedToWantPath
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