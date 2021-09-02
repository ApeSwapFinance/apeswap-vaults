// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IKoalaFarm.sol";
import "./BaseStrategySingle.sol";

contract StrategyKoalaChefSingle is BaseStrategySingle, Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public masterchefAddress;
    uint256 public pid;
    address[] public earnedToWantPath;
    bool public earnOnDeposit;

    /**
        address[5] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _masterchefAddress,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress
    */
    function initialize(
        address[7] memory _configAddresses,
        uint256 _pid,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        address[] memory _earnedToWantPath
    ) external initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        masterchefAddress = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];

        wantAddress = _configAddresses[3];

        pid = _pid;
        earnedAddress = _configAddresses[4];
        usdAddress = _configAddresses[5];
        bananaAddress = _configAddresses[6];

        earnedToWnativePath = _earnedToWnativePath;
        earnedToUsdPath = _earnedToUsdPath;
        earnedToBananaPath = _earnedToBananaPath;
        earnedToWantPath = _earnedToWantPath;

        transferOwnership(vaultChefAddress);

        // If wantToken = earnToken we earn dust before any action
        earnOnDeposit = _configAddresses[3] == _configAddresses[4];

        _resetAllowances();
    }

    function earn() external override nonReentrant whenNotPaused { 
        _earn(_msgSender());
    }

    function earn(address _to) external override nonReentrant whenNotPaused {
        _earn(_to);
    }

    function _earn(address _to) internal {
        // Harvest farm tokens
        _vaultHarvest();

        // Converts farm tokens into want tokens
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {

            earnedAmt = distributeFees(earnedAmt, _to);
            earnedAmt = distributeRewards(earnedAmt);
            earnedAmt = buyBack(earnedAmt);

            if (wantAddress != earnedAddress) {
                _safeSwap(
                    earnedAmt,
                    earnedToWantPath,
                    address(this)
                );
            }

            _farm();
        }
    }

    function _vaultDeposit(uint256 _amount) internal override {
        IKoalaFarm(masterchefAddress).deposit(pid, _amount, msg.sender, false);
    }
    
    function _vaultWithdraw(uint256 _amount) internal override {
        IKoalaFarm(masterchefAddress).withdraw(pid, _amount);
    }
    
    function _vaultHarvest() internal override {
        _vaultDeposit(0);
    }
    
    function vaultSharesTotal() public override view returns (uint256) {
        (uint256 amount,) = IKoalaFarm(masterchefAddress).userInfo(pid, address(this));
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

    }
    
    function _emergencyVaultWithdraw() internal override {
        IKoalaFarm(masterchefAddress).emergencyWithdraw(pid);
    }

    function _safeSwap(
        uint256 _amountIn,
        address[] memory _path,
        address _to
    ) internal override {
        uint256[] memory amounts = IUniRouter02(uniRouterAddress).getAmountsOut(_amountIn, _path);
        uint256 amountOut = amounts[amounts.length.sub(1)];

        IUniRouter02(uniRouterAddress).swapExactTokensForTokensSupportingFeeOnTransferTokens(
            _amountIn,
            amountOut.mul(slippageFactor).div(1000),
            _path,
            _to,
            block.timestamp.add(600)
        );
    }
    
    function _safeSwapWnative(
        uint256 _amountIn,
        address[] memory _path,
        address _to
    ) internal override {
        uint256[] memory amounts = IUniRouter02(uniRouterAddress).getAmountsOut(_amountIn, _path);
        uint256 amountOut = amounts[amounts.length.sub(1)];

        IUniRouter02(uniRouterAddress).swapExactTokensForETHSupportingFeeOnTransferTokens(
            _amountIn,
            amountOut.mul(slippageFactor).div(1000),
            _path,
            _to,
            block.timestamp.add(600)
        );
    }

    function _beforeDeposit(address _to) internal override {
        if (earnOnDeposit) {
            _earn(_to);
        }
    }

    function _beforeWithdraw(address _to) internal override {

    }
}