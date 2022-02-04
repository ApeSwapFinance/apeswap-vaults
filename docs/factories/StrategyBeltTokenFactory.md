## `StrategyBeltTokenFactory`






### `constructor(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultMasterBelt)` (public)





### `deployDefaultBeltTokenStrategy(address[3] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToWantPath, uint256 _pid)` (public)

address[2] _configAddress,
    _configAddress[0] _wantAddress,
    _configAddress[1] _earnedAddress,
    _configAddress[2] _oToken,



### `deployBeltTokenStrategy(address[9] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToWantPath, uint256 _pid)` (public)

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



### `updateDefaults(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress, address _defaultMasterBelt)` (external)






### `DeployedBeltTokenStrategy(address _vaultChefAddress, address _routerAddress, address _wantAddress, address _earnedAddress, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath)`





