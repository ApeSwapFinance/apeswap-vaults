// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./BaseStrategy.sol";
import "./libs/Venus/Interfaces.sol";

/**
 * @title Strategy Venus BNB
 * @author sirbeefalot & superbeefyboy
 * @dev It maximizes yields doing leveraged lending with BNB on Venus.
 */
contract StrategyVenusBNB is BaseStrategy, Initializable {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    /**
     * @dev Tokens Used:
     * {vbnb}  - Venus BNB. We interact with it to mint/redem/borrow/repay BNB.
     */
    address constant public vbnb = address(0xA07c5b74C9B40447a954e1466938b865b6BBea36);

    /**
     * @dev Third Party Contracts:
     * {unirouter}  - Pancakeswap unirouter. Has the most liquidity for {venus}.
     * {unitroller} - Controller contract for the {venus} rewards.
     */
    address constant public unitroller = address(0xfD36E2c2a6789Db23113685031d7F16329158384);

    /**
     * @dev Variables that can be changed to config profitability and risk:
     * {borrowRate}          - What % of our collateral do we borrow per leverage level.
     * {borrowDepth}         - How many levels of leverage do we take. 
     * {BORROW_RATE_MAX}     - A limit on how much we can push borrow risk.
     * {BORROW_DEPTH_MAX}    - A limit on how many steps we can leverage.
     * {MIN_LEVERAGE_AMOUNT} - The minimum amount of collateral required to leverage.
     */
    uint256 public borrowRate = 58;
    uint256 public borrowDepth = 4;
    uint256 constant public BORROW_RATE_MAX = 58;
    uint256 constant public BORROW_DEPTH_MAX = 10;
    uint256 constant public MIN_LEVERAGE_AMOUNT = 1e12;

    /** 
     * @dev We keep and update a cache of the strat's bnb deposited in venus. Contract
     * functions that use this value always update it first. We use it to keep the UI helper
     * functions as view only.  
     */
    uint256 public depositedBalance;

    /**
     * @dev Events that the contract emits
     */
    event StratHarvest(address indexed harvester);
    event StratRebalance(uint256 _borrowRate, uint256 _borrowDepth);

    /**
        address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _uniRouterAddress,
        _configAddresses[2]  _wantAddress,
        _configAddress[3]  _earnedAddress
        _configAddress[4]  _usdAddress
        _configAddress[5]  _bananaAddress
    */
    function initialize(
        address[6] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath
    ) external initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        uniRouterAddress = _configAddresses[1];

        wantAddress = _configAddresses[2];

        earnedAddress = _configAddresses[3];
        usdAddress = _configAddresses[4];
        bananaAddress = _configAddresses[5];

        earnedToWnativePath = _earnedToWnativePath;
        earnedToUsdPath = _earnedToUsdPath;
        earnedToBananaPath = _earnedToBananaPath;

        transferOwnership(vaultChefAddress);
        address[1] memory markets = [vbnb];
        IUnitroller(unitroller).enterMarkets(markets);

        _resetAllowances();
    }

    /**
     * @dev Function that puts the funds to work.
     * It gets called whenever someone deposits in the strategy's vault. It does {borrowDepth} 
     * levels of compound lending. It also updates the helper {depositedBalance} variable.
     */
    function _vaultDeposit(uint256 _amount) internal override {
        uint256 wbnbBal = IERC20(wNativeAdress).balanceOf(address(this));
        require(_amount <= wbnbBal, "Insuficient WBNB deposited");

        if (_amount > 0) {
            IWBNB(wNativeAdress).withdraw(_amount);
            _leverage(_amount);
        }

        updateBalance();
    }

    /**
     * @dev Withdraws funds and sends them back to the vault. It deleverages from venus first,
     * and then deposits again after the withdraw to make sure it mantains the desired ratio. 
     * @param _amount How much {wbnb} to withdraw.
     */
    function _vaultWithdraw(uint256 _amount) internal override {
        uint256 wbnbBal = IERC20(wNativeAdress).balanceOf(address(this));

        if (wbnbBal < _amount) {
            _deleverage();
            IWBNB(wNativeAdress).deposit{value: _amount.sub(wbnbBal)}();
            wbnbBal = IERC20(wNativeAdress).balanceOf(address(this));
        }

        if (wbnbBal > _amount) {
            wbnbBal = _amount;    
        }

        if (!paused()) {
            _leverage(address(this).balance);
        }
        
        updateBalance();
    }

    function _vaultHarvest() internal override {
        IUnitroller(unitroller).claimVenus(address(this));

        emit StratHarvest(msg.sender);
    }

    function earn() external override nonReentrant whenNotPaused { 
        _earn(_msgSender());
    }

    function earn(address _to) external override nonReentrant whenNotPaused {
        _earn(_to);
    }
    /**
     * @dev Core function of the strat, in charge of collecting and re-investing rewards.
     * 1. It claims {venus} rewards from the Unitroller.
     * 3. It charges the system fee.
     * 4. It swaps the remaining rewards into more {wbnb}.
     * 4. It re-invests the remaining profits.
     */
    function _earn(address _to) internal {
        // Harvest farm tokens
        _vaultHarvest();

        // Converts farm tokens into want tokens
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {
            earnedAmt = distributeFees(earnedAmt, _to);
            earnedAmt = distributeRewards(earnedAmt);
            earnedAmt = buyBack(earnedAmt);
            _swapRewards();
    
            _farm();
        }
    }

    /**
     * @dev Repeatedly supplies and borrows bnb following the configured {borrowRate} and {borrowDepth}
     * @param _amount amount of bnb to leverage
     */
    function _leverage(uint256 _amount) internal {
        if (_amount < MIN_LEVERAGE_AMOUNT) { return; }

        for (uint i = 0; i < borrowDepth; i++) {
            IVBNB(vbnb).mint{value: _amount}();
            _amount = _amount.mul(borrowRate).div(100);
            IVBNB(vbnb).borrow(_amount);
        }
    } 

    /**
     * @dev Incrementally alternates between paying part of the debt and withdrawing part of the supplied 
     * collateral. Continues to do this until it repays the entire debt and withdraws all the supplied bnb 
     * from the system
     */
    function _deleverage() internal {
        uint256 bnbBal = address(this).balance;
        uint256 borrowBal = IVBNB(vbnb).borrowBalanceCurrent(address(this));

        while (bnbBal < borrowBal) {
            IVBNB(vbnb).repayBorrow{value: bnbBal}();

            borrowBal = IVBNB(vbnb).borrowBalanceCurrent(address(this));
            uint256 targetUnderlying = borrowBal.mul(100).div(borrowRate);
            uint256 balanceOfUnderlying = IVBNB(vbnb).balanceOfUnderlying(address(this));

            IVBNB(vbnb).redeemUnderlying(balanceOfUnderlying.sub(targetUnderlying));
            bnbBal = address(this).balance;
        }

        IVBNB(vbnb).repayBorrow{value: borrowBal}();

        uint256 vbnbBal = IERC20(vbnb).balanceOf(address(this));
        IVBNB(vbnb).redeem(vbnbBal);
    }

    /**
     * @dev Extra safety measure that allows us to manually unwind one level. In case we somehow get into 
     * as state where the cost of unwinding freezes the system. We can manually unwind a few levels 
     * with this function and then 'rebalance()' with new {borrowRate} and {borrowConfig} values. 
     * @param _borrowRate configurable borrow rate in case it's required to unwind successfully
     */
    function deleverageOnce(uint _borrowRate) external onlyGov {
        require(_borrowRate <= BORROW_RATE_MAX, "!safe");
        
        uint256 bnbBal = address(this).balance;
        IVBNB(vbnb).repayBorrow{value: bnbBal}();

        uint256 borrowBal = IVBNB(vbnb).borrowBalanceCurrent(address(this));
        uint256 targetUnderlying = borrowBal.mul(100).div(_borrowRate);
        uint256 balanceOfUnderlying = IVBNB(vbnb).balanceOfUnderlying(address(this));

        IVBNB(vbnb).redeemUnderlying(balanceOfUnderlying.sub(targetUnderlying));

        updateBalance();
    }

    /**
     * @dev Updates the risk profile and rebalances the vault funds accordingly.
     * @param _borrowRate percent to borrow on each leverage level.
     * @param _borrowDepth how many levels to leverage the funds.
     */
    function rebalance(uint256 _borrowRate, uint256 _borrowDepth) external onlyGov {
        require(_borrowRate <= BORROW_RATE_MAX, "!rate");
        require(_borrowDepth <= BORROW_DEPTH_MAX, "!depth");

        _deleverage();
        borrowRate = _borrowRate;
        borrowDepth = _borrowDepth;
        _leverage(address(this).balance);

        emit StratRebalance(_borrowRate, _borrowDepth);
    }

    /**
     * @dev Swaps {venus} rewards earned for more {wbnb}.
     */
    function _swapRewards() internal {
        uint256 venusBal = IERC20(earnedAddress).balanceOf(address(this));
        IUniRouter02(uniRouterAddress).swapExactTokensForTokens(venusBal, 0, earnedToWnativePath, address(this), block.timestamp.add(600));
    }

    /**
     * @dev It helps mantain a cached version of the bnb deposited in venus. 
     * We use it to be able to keep the vault's 'balance()' function and 
     * 'getPricePerFullShare()' with view visibility. 
     */
    function updateBalance() public {
        uint256 supplyBal = IVBNB(vbnb).balanceOfUnderlying(address(this));
        uint256 borrowBal = IVBNB(vbnb).borrowBalanceCurrent(address(this));
        depositedBalance = supplyBal.sub(borrowBal);
    }

    function _resetAllowances() internal override {
        IERC20(earnedAddress).safeApprove(uniRouterAddress, type(uint256).max);
        IERC20(wNativeAdress).safeApprove(uniRouterAddress, type(uint256).max);
    }

    /**
     * @dev Function to calculate the total underlaying {wbnb} and bnb held by the strat.
     * It takes into account both the funds at hand, and the funds allocated in the {vbnb} contract.
     * It uses a cache of the balances stored in {depositedBalance} to enable a few UI helper functions
     * to exist. Sensitive functions should call 'updateBalance()' first to make sure the data is up to date.
     * @return total {wbnb} and bnb held by the strat.
     */
    function balanceOf() public view returns (uint256) {
        return balanceOfStrat().add(depositedBalance);
    }

    /**
     * @dev It calculates how much BNB the contract holds.
     * @return The sum of {wbnb} and bnb in the contract.
     */
    function balanceOfStrat() public view returns (uint256) {
        uint256 bnbBal = address(this).balance;
        uint256 wbnbBal = IERC20(wNativeAdress).balanceOf(address(this));
        return bnbBal.add(wbnbBal);
    }

    function vaultSharesTotal() public override view returns (uint256) {
        return depositedBalance;
    }
    
    function wantLockedTotal() public override view returns (uint256) {
        return balanceOf();
    }

    receive () external payable {

    }

    function _emergencyVaultWithdraw() internal override {
        _deleverage();
        IWBNB(wNativeAdress).deposit{value: address(this).balance}();
    }

    function _beforeDeposit(address _to) internal override {
        updateBalance();
    }

    function _beforeWithdraw(address _to) internal override {
        updateBalance();
    }
}