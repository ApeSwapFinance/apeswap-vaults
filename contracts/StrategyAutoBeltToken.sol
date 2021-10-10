// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IAutoFarmV2.sol";
import "./libs/IBeltMultiStrategyToken.sol";
import "./BaseStrategySingle.sol";

contract StrategyAutoBeltToken is BaseStrategySingle, Initializable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Third party contracts
    address public autoFarm; // address(0x0895196562C7868C5Be92459FaE7f877ED450452);
    address public oToken;   // address(0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c);
    uint256 public pid; // 341
    address[] public earnedToWantPath;

    /**
        address[8] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _autoFarm,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress
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
        autoFarm = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];
        oToken = _configAddresses[7];

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
        
        _resetAllowances();
    }

    // puts the funds to work
    function _vaultDeposit(uint256 _amount) internal override {
        IAutoFarmV2(autoFarm).deposit(pid, _amount);
    }

    function _vaultWithdraw(uint256 _amount) internal override {
        IAutoFarmV2(autoFarm).withdraw(pid, _amount);
    }

    function _vaultHarvest() internal override {
        IAutoFarmV2(autoFarm).deposit(pid, 0);
    }

    function earn() external override nonReentrant whenNotPaused { 
        _earn(_msgSender());
    }

    function earn(address _to) external override nonReentrant whenNotPaused {
        _earn(_to);
    }

    function _earn(address _to) internal { 
        _vaultHarvest();
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {
            earnedAmt = distributeFees(earnedAmt, _to);
            earnedAmt = distributeRewards(earnedAmt);
            earnedAmt = buyBack(earnedAmt);

            // Converts farm tokens into want tokens and farms
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

            _farm();

            lastEarnBlock = block.number;
        }
    }

    // calculate the total underlaying 'want' held by the strat.
    function wantLockedTotal() public override view returns (uint256) {
        return balanceOfWant().add(vaultSharesTotal());
    }

    // it calculates how much 'want' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(wantAddress).balanceOf(address(this));
    }

    // it calculates how much 'want' the strategy has working in the farm.
    function vaultSharesTotal() public override view returns (uint256) {
        return IAutoFarmV2(autoFarm).stakedWantTokens(pid, address(this));
    }

    // pauses deposits and withdraws all funds from third party systems.
    function _emergencyVaultWithdraw() internal override {
        IAutoFarmV2(autoFarm).emergencyWithdraw(pid);
    }

    function _resetAllowances() internal override {
        IERC20(wantAddress).safeApprove(autoFarm, type(uint256).max);
        IERC20(earnedAddress).safeApprove(uniRouterAddress, type(uint256).max);
        IERC20(usdAddress).safeApprove(oToken, type(uint256).max);
    }

    function _removeAllowances() internal {
        IERC20(wantAddress).safeApprove(autoFarm, 0);
        IERC20(earnedAddress).safeApprove(uniRouterAddress, 0);
        IERC20(usdAddress).safeApprove(oToken, 0);
    }

    function _beforeDeposit(address _to) internal override {

    }

    function _beforeWithdraw(address _to) internal override {

    }
}