// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IKoalaFarm.sol";
import "./BaseStrategyLPSingle.sol";

contract StrategyKoalaFarm is BaseStrategyLPSingle, Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public masterchefAddress;
    uint256 public pid;

    /**
        address[7] _configAddresses,
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
        address[] memory _earnedToToken0Path,
        address[] memory _earnedToToken1Path,
        address[] memory _token0ToEarnedPath,
        address[] memory _token1ToEarnedPath
    ) external initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        masterchefAddress = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];

        wantAddress = _configAddresses[3];
        token0Address = IUniPair(wantAddress).token0();
        token1Address = IUniPair(wantAddress).token1();

        pid = _pid;
        earnedAddress = _configAddresses[4];
        usdAddress = _configAddresses[5];
        bananaAddress = _configAddresses[6];

        earnedToWnativePath = _earnedToWnativePath;
        earnedToUsdPath = _earnedToUsdPath;
        earnedToBananaPath = _earnedToBananaPath;
        earnedToToken0Path = _earnedToToken0Path;
        earnedToToken1Path = _earnedToToken1Path;
        token0ToEarnedPath = _token0ToEarnedPath;
        token1ToEarnedPath = _token1ToEarnedPath;

        transferOwnership(vaultChefAddress);
        
        _resetAllowances();
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

        IERC20(token0Address).safeApprove(uniRouterAddress, uint256(0));
        IERC20(token0Address).safeIncreaseAllowance(
            uniRouterAddress,
            type(uint256).max
        );

        IERC20(token1Address).safeApprove(uniRouterAddress, uint256(0));
        IERC20(token1Address).safeIncreaseAllowance(
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

    function beforeDeposit(address _to) external override onlyOwner {

    }

    function beforeWithdraw(address _to) external override onlyOwner {

    }
}
