// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IMasterchef.sol";
import "./BaseStrategySingle.sol";

contract StrategyMasterApeSingle is BaseStrategySingle, Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public masterchefAddress;
    uint256 public pid;

    /**
        address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _masterchefAddress,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
    */
    function initialize(
        address[5] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWmaticPath,
        address[] memory _earnedToUsdcPath,
        address[] memory _earnedToBananaPath
    ) external initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        masterchefAddress = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];

        wantAddress = _configAddresses[3];

        pid = _pid;
        earnedAddress = _configAddresses[4];

        earnedToWmaticPath = _earnedToWmaticPath;
        earnedToUsdcPath = _earnedToUsdcPath;
        earnedToBananaPath = _earnedToBananaPath;

        transferOwnership(vaultChefAddress);
        
        _resetAllowances();
    }

    // TODO removed onlyGov modifier - check risks
    function earn() external override nonReentrant whenNotPaused {
        // Harvest farm tokens
        _vaultHarvest();

        // Converts farm tokens into want tokens
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {
            earnedAmt = distributeFees(earnedAmt);
            earnedAmt = distributeRewards(earnedAmt);
            earnedAmt = buyBack(earnedAmt);
    
            _farm();
        }
    }

    function _vaultDeposit(uint256 _amount) internal override {
        // If its same asset it is core and has other method (BANANA and CAKE case)
        if (wantAddress == earnedAddress)
            IMasterchef(masterchefAddress).enterStaking(_amount);
        else
            IMasterchef(masterchefAddress).deposit(pid, _amount);
    }
    
    function _vaultWithdraw(uint256 _amount) internal override {
        // If its same asset it is core and has other method (BANANA and CAKE case)
        if (wantAddress == earnedAddress)
            IMasterchef(masterchefAddress).leaveStaking(_amount);
        else
            IMasterchef(masterchefAddress).deposit(pid, _amount);
    }
    
    function _vaultHarvest() internal override {
        // If its same asset it is core and has other method (BANANA and CAKE case)
        if (wantAddress == earnedAddress)
            IMasterchef(masterchefAddress).leaveStaking(0);
        else
            IMasterchef(masterchefAddress).deposit(pid, 0);
    }
    
    function vaultSharesTotal() public override view returns (uint256) {
        (uint256 amount,) = IMasterchef(masterchefAddress).userInfo(pid, address(this));
        return amount;
    }
    
    function wantLockedTotal() public override view returns (uint256) {
        return IERC20(wantAddress).balanceOf(address(this))
            .add(vaultSharesTotal());
    }

    function _resetAllowances() internal override {
        IERC20(wantAddress).safeApprove(masterchefAddress, uint256(0));
        IERC20(wantAddress).safeIncreaseAllowance(
            masterchefAddress,
            type(uint256).max
        );

        IERC20(earnedAddress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(earnedAddress).safeIncreaseAllowance(
            uniRouterAddress,
            type(uint256).max
        );

        IERC20(usdcAddress).safeApprove(rewardAddress, uint256(0));
        IERC20(usdcAddress).safeIncreaseAllowance(
            rewardAddress,
            type(uint256).max
        );
    }
    
    function _emergencyVaultWithdraw() internal override {
        IMasterchef(masterchefAddress).emergencyWithdraw(pid);
    }
}