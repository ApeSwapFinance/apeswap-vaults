// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IMasterchef.sol";
import "./BaseStrategy.sol";
import "./libs/IWETH.sol";
import "./libs/IBeltMultiStrategyToken.sol";

//  https://bscscan.com/address/0x59c5d8d354d1d25427c6728FdBE7Be2486b9Fa63#readContract
contract StrategyBeltToken is BaseStrategy, Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public masterBelt;
    address public oToken;
    uint256 public pid;
    address[] public earnedToWantPath;

    /**
        address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _uniRouterAddress,
        _configAddresses[2]  _wantAddress,
        _configAddress[3]  _earnedAddress
        _configAddress[4]  _usdAddress
        _configAddress[5]  _bananaAddress
        _configAddress[6]  _masterBelt
        _configAddress[7]  _oToken
    */
    function initialize(
        address[8] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath,
        uint256 _pid
    ) external initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        uniRouterAddress = _configAddresses[1];

        wantAddress = _configAddresses[2];

        earnedAddress = _configAddresses[3];
        usdAddress = _configAddresses[4];
        bananaAddress = _configAddresses[5];
        masterBelt = _configAddresses[6];
        oToken = _configAddresses[7];

        pid = _pid;

        earnedToWnativePath = _earnedToWnativePath;
        earnedToUsdPath = _earnedToUsdPath;
        earnedToBananaPath = _earnedToBananaPath;
        earnedToWantPath = _earnedToWantPath;

        transferOwnership(vaultChefAddress);

        _resetAllowances();
    }

    function earn() external override nonReentrant whenNotPaused { 
        _earn(_msgSender());
    }

    function earn(address _to) external override nonReentrant whenNotPaused {
        _earn(_to);
    }

    function _earn(address _to) internal nonReentrant whenNotPaused {

        // Harvest farm tokens
        _vaultHarvest();

        if (earnedAddress == wNativeAdress) {
            _wrapBNB();
        }

        // Converts farm tokens into want tokens
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {
            earnedAmt = distributeFees(earnedAmt, _to);
            earnedAmt = distributeRewards(earnedAmt);
            earnedAmt = buyBack(earnedAmt);

            if (earnedAddress != oToken) {
                // Swap earned to token0
                _safeSwap(
                    earnedAmt,
                    earnedToWantPath,
                    address(this)
                );
            }
            uint256 token0Amt = IERC20(oToken).balanceOf(address(this));

            IERC20(oToken).safeApprove(wantAddress, 0);
            IERC20(oToken).safeIncreaseAllowance(wantAddress, token0Amt);

            IBeltMultiStrategyToken(wantAddress).deposit(token0Amt, 0);

            lastEarnBlock = block.number;
    
            _farm();
        }
    }

    function vaultSharesTotal() public override view returns (uint256) {
        (uint256 shares,) = IMasterchef(masterBelt).userInfo(pid, address(this));
        return shares;
    }
    
    function wantLockedTotal() public override view returns (uint256) {
        return IERC20(wantAddress).balanceOf(address(this))
            .add(IERC20(oToken).balanceOf(address(this)))
            .add(vaultSharesTotal());
    }

    function _wrapBNB() internal virtual {
        // BNB -> WBNB
        uint256 bnbBal = address(this).balance;
        if (bnbBal > 0) {
            IWETH(wNativeAdress).deposit{value: bnbBal}(); // BNB -> WBNB
        }
    }

    function _vaultHarvest() internal override {
        IMasterchef(masterBelt).withdraw(pid, 0);
    }

    function _vaultDeposit(uint256 _amount) internal override {
        IMasterchef(masterBelt).deposit(pid, _amount);
    }
    
    function _vaultWithdraw(uint256 _amount) internal override {
        IMasterchef(masterBelt).withdraw(pid, _amount);
    }

    function _resetAllowances() internal override {
        IERC20(wantAddress).safeApprove(masterBelt, uint256(0));
        IERC20(wantAddress).safeIncreaseAllowance(
            masterBelt,
            type(uint256).max
        );

        IERC20(earnedAddress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(earnedAddress).safeIncreaseAllowance(
            uniRouterAddress,
            type(uint256).max
        );

    }
    
    function _emergencyVaultWithdraw() internal override {
        IMasterchef(masterBelt).emergencyWithdraw(pid);
    }

    function _beforeDeposit(address _to) internal override {
        
    }

    function _beforeWithdraw(address _to) internal override {

    }
}