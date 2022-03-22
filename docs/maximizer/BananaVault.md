## `BananaVault`

tUserAction; // keeps track of banana deposited at the last user action
        uint256 lastUserActionTime; // keeps track of the




### `constructor(contract IERC20 _bananaToken, address _masterApe, address _admin)` (public)

DMIN_ROLE, _admin);
        _setupRole(MANAGER_ROLE, _admin);
        // A manager can be a vault contract which can add sub strategies to the deposit role
        _setRoleAdmin



### `deposit(uint256 _amount)` (external)

uint256 totalBananaTokens = underlyingTokenBalance();
        bananaToken.safeTransferFrom(msg.sender, address(this), _amoun



### `withdrawAll()` (external)





### `earn()` (external)

s (uint256)
    {
        uint256 amount = masterApe.pendingCake(



### `calculateTotalPendingBananaRewards() → uint256` (external)

function getPricePerFullShare() external view returns (uint256) {
        return totalShares == 0 ? 1e18 : (underlyingTokenBalance() *



### `getPricePerFullShare() → uint256` (external)

Info storage user = userInfo[msg.sender];

        requir



### `withdraw(uint256 _shares)` (public)

draw = (underlyingTokenBalance() * currentShares) / totalShares;
        user.shares -= currentShares;
        totalShare



### `available() → uint256` (public)

ingTokenBalance() public view returns (uint256) {
        (uint256 amount, ) = masterApe.userInfo(0, address(this));

        return bananaTok



### `underlyingTokenBalance() → uint256` (public)

/
    function _earn() internal {
        uint256 balance = available();

        if (balance > 0) {
            if (



### `_earn()` (internal)

erApe.enterStaking(balance);
        }
    }
}




### `Deposit(address sender, uint256 amount, uint256 shares, uint256 lastDepositedTime)`





### `Withdraw(address sender, uint256 amount, uint256 shares)`





### `Earn(address sender)`






### `UserInfo`


uint256 shares


uint256 lastDepositedTime


uint256 bananaAtLastUserAction


uint256 lastUserActionTime



