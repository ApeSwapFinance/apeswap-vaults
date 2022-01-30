interface IMasterBelt {
    function owner() external view returns (address);

    function BELT() external returns (address);

    function burnAddress() external returns (address);

    function ownerBELTReward() external returns (uint256);

    function BELTPerBlock() external returns (uint256);

    function startBlock() external returns (uint256);

    function poolInfo(uint256)
        external
        returns (
            address want,
            uint256 allocPoint,
            uint256 lastRewardBlock,
            uint256 accBELTPerShare,
            address strat
        );

    function userInfo(uint256, address)
        external
        view
        returns (uint256 shares, uint256 rewardDebt);

    function totalAllocPoint() external returns (uint256);

    function poolLength() external view returns (uint256);

    function add(
        uint256 _allocPoint,
        address _want,
        bool _withUpdate,
        address _strat
    ) external;

    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) external;

    function getMultiplier(uint256 _from, uint256 _to)
        external
        view
        returns (uint256);

    function pendingBELT(uint256 _pid, address _user)
        external
        view
        returns (uint256);

    function stakedWantTokens(uint256 _pid, address _user)
        external
        view
        returns (uint256);

    function massUpdatePools() external;

    function updatePool(uint256 _pid) external;

    function deposit(uint256 _pid, uint256 _wantAmt) external;

    function withdraw(uint256 _pid, uint256 _wantAmt) external;

    function withdrawAll(uint256 _pid) external;

    function emergencyWithdraw(uint256 _pid) external;

    function inCaseTokensGetStuck(address _token, uint256 _amount) external;
}
