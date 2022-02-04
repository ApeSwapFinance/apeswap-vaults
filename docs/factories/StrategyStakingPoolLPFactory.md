## `StrategyStakingPoolLPFactory`






### `constructor(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress)` (public)





### `deployDefaultStakingPoolLP(address[3] _configAddresses, uint256 _pid, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToToken0Path, address[] _earnedToToken1Path, address[] _token0ToEarnedPath, address[] _token1ToEarnedPath)` (public)

address[3] _configAddress,
    _configAddress[0] _masterchefAddress,
    _configAddress[1] _wantAddress,
    _configAddress[2] _earnedAddress,



### `deployStakingPoolLP(address[8] _configAddresses, uint256 _pid, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToToken0Path, address[] _earnedToToken1Path, address[] _token0ToEarnedPath, address[] _token1ToEarnedPath)` (public)

address[6] _configAddress,
    _configAddress[0] _vaultChefAddress,
    _configAddress[1] _masterchefAddress,
    _configAddress[2] _uniRouterAddress,
    _configAddress[3] _wantAddress,
    _configAddress[4]  _earnedAddress,
    _configAddress[5]  _usdAddress,
    _configAddress[6]  _bananAddress,
    _configAddress[7]  _gov,



### `updateDefaults(address _defaultGov, address _defaultVault, address _defaultRouter, address _defaultBananaAddress, address _defaultUsdAddress)` (external)






### `DeployedStakingPoolLP(address _vaultChefAddress, address _masterchefAddress, address _routerAddress, uint256 _pid, address _wantAddress, address _earnedAddress, address[] _earnedToWnativePath, address[] _earnedToUsdPath, address[] _earnedToBananaPath, address[] _earnedToToken0Path, address[] _earnedToToken1Path, address[] _token0ToEarnedPath, address[] _token1ToEarnedPath)`





