## `BananaVault`

ntial penalty
        uint256 bananaAtLastUserAction; // keeps track of banana deposited at the last user action
        uint256 la




### `constructor(contract IERC20 _bananaToken, address _masterApe, address _admin)` (public)

pRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(MANAGER_ROLE, _admin);
        // A manager can be a vault contract which can add sub strategies to the deposit role



### `deposit(uint256 _amount)` (external)

der, address(this), _amount);
        uint256 currentShares = 0;
        if (totalShares != 0) {
            currentShares = (



### `withdrawAll()` (external)

callable by the contract owner.
/
    function set



### `earn()` (external)

quire(_treasury != address(0), "BananaVault: Cannot be zero address



### `setTreasury(address _treasury)` (external)

al pending rewards that can be restaked




### `calculateTotalPendingBananaRewards() → uint256` (external)

ce Calculates the price per share
/
    function getPricePerFullShare() external view returns (uint256) {
        return



### `getPricePerFullShare() → uint256` (external)

n withdraw(uint256 _shares) public nonReentrant {



### `withdraw(uint256 _shares)` (public)

"
        );

        uint256 bananaTokensToWithdraw = (underlyingTokenBalance().mul(_shares))
            .div(totalSha



### `available() → uint256` (public)

tion underlyingTokenBalance() public view returns (uint256) {
        (uint256 amount, ) = masterApe.userInfo(0, address(this));

        retu



### `underlyingTokenBalance() → uint256` (public)

taking rewards
/
    function _earn() internal {
        uint256 balance = available();

        if (balance > 0) {
            if



### `_earn()` (internal)

masterApe.enterStaking(balance);
        }
    }
}




### `Deposit(address sender, uint256 amount, uint256 shares, uint256 lastDepositedTime)`





### `Withdraw(address sender, uint256 amount, uint256 shares)`





### `Earn(address sender)`





### `SetTreasury(address previousTreasury, address newTreasury)`





### `SetWithdrawFee(uint256 previousWithdrawFee, uint256 newWithdrawFee)`





