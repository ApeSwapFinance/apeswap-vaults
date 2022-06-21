// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IBeltLP.sol";
import "./libs/IMasterBelt.sol";
import "./BaseStrategySingle.sol";

// https://bscscan.com/address/0x5df9ce05ea92af1ea324996d12f139847af3dfc7#code
contract Strategy4Belt is BaseStrategySingle, Initializable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Third party contracts
    address public masterBelt; // address(0xD4BbC80b9B102b77B21A06cb77E954049605E6c1);
    address public beltLP;   // address(0x9cb73F20164e399958261c289Eb5F9846f4D1404);
    uint256 public pid; // 3

    /**
        address[8] _configAddresses,
        _configAddresses[0] _vaultChefAddress,
        _configAddresses[1] _masterBelt,
        _configAddresses[2] _uniRouterAddress,
        _configAddresses[3]  _wantAddress,
        _configAddress[4]  _earnedAddress
        _configAddress[5]  _usdAddress
        _configAddress[6]  _bananaAddress
        _configAddress[7]  _beltLp
    */
    function initialize(
        address[8] memory _configAddresses,
        address[] memory _earnedToWnativePath,
        address[] memory _earnedToUsdPath,
        address[] memory _earnedToBananaPath,
        uint256 _pid
    ) external initializer {
        
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];
        masterBelt = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];
        beltLP = _configAddresses[7];

        wantAddress = _configAddresses[3];

        pid = _pid;
        earnedAddress = _configAddresses[4];
        usdAddress = _configAddresses[5];
        bananaAddress = _configAddresses[6];

        earnedToWnativePath = _earnedToWnativePath;
        earnedToUsdPath = _earnedToUsdPath;
        earnedToBananaPath = _earnedToBananaPath;

        transferOwnership(vaultChefAddress);
        
        _resetAllowances();
    }

    // puts the funds to work
    function _vaultDeposit(uint256 _amount) internal override {
        IMasterBelt(masterBelt).deposit(pid, _amount);
    }

    function _vaultWithdraw(uint256 _amount) internal override {
        IMasterBelt(masterBelt).withdraw(pid, _amount);
    }

    function _vaultHarvest() internal override {
        IMasterBelt(masterBelt).deposit(pid, 0);
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
            _addLiquidity();
            _farm();

            lastEarnBlock = block.number;
        }
    }

    // Adds liquidity to AMM and gets more LP tokens.
    function _addLiquidity() internal {
        uint256 autoBal = IERC20(earnedAddress).balanceOf(address(this));
        _safeSwap(
            autoBal,
            earnedToUsdPath,
            address(this)
        );

        uint256 busdBal = IERC20(usdAddress).balanceOf(address(this));
        uint256[4] memory uamounts = [0, 0, 0, busdBal];
        IBeltLP(beltLP).add_liquidity(uamounts, 0);
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
        (uint256 amount,) = IMasterBelt(masterBelt).userInfo(pid, address(this));
        return amount;
        // return IMasterBelt(masterBelt).stakedWantTokens(pid, address(this));
    }

    // pauses deposits and withdraws all funds from third party systems.
    function _emergencyVaultWithdraw() internal override {
        IMasterBelt(masterBelt).emergencyWithdraw(pid);
    }

    function _resetAllowances() internal override {
        IERC20(wantAddress).safeApprove(masterBelt, uint256(0));
        IERC20(wantAddress).safeApprove(masterBelt, type(uint256).max);

        IERC20(earnedAddress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(earnedAddress).safeApprove(uniRouterAddress, type(uint256).max);

        IERC20(usdAddress).safeApprove(beltLP, uint256(0));
        IERC20(usdAddress).safeApprove(beltLP, type(uint256).max);
    }

    function _removeAllowances() internal {
        IERC20(wantAddress).safeApprove(masterBelt, 0);
        IERC20(earnedAddress).safeApprove(uniRouterAddress, 0);
        IERC20(usdAddress).safeApprove(beltLP, 0);
    }

    function _beforeDeposit(address _to) internal override {

    }

    function _beforeWithdraw(address _to) internal override {

    }
}