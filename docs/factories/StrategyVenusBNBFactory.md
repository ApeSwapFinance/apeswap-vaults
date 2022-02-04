## `StrategyVenusBNBFactory`






### `constructor(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress)` (public)





### `deployDefaultVenusBNBStrategy(address[2] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _markets)` (public)

address[2] _configAddress,
    _configAddress[0] _wantAddress,
    _configAddress[1] _earnedAddress,



### `deployVenusBNBStrategy(address[7] _configAddresses, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _markets)` (public)

address[8] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _uniRouterAddress,
    _configAddress[2] _wantAddress,
    _configAddress[3]  _earnedAddress,
    _configAddress[4]  _usdAddress,
    _configAddress[5]  _bananaAddress,
    _configAddress[6]  _gov



### `updateDefaults(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress)` (external)






### `DeployedVenusBNBStrategy(address _vaultChefAddress, address _routerAddress, address _wantAddress, address _earnedAddress, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath)`





