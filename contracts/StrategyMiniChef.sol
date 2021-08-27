// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IMiniChefStake.sol";
import "./libs/IWETH.sol";

import "./BaseStrategyLP.sol";

contract StrategyMiniChef is BaseStrategyLP, Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public pid;
    address public miniChefAddress;
    address public secondEarnedAddress;

    address[] public secondEarnedToUsdPath;
    address[] public secondEarnedToWnativePath;
    address[] public secondEarnedToBananaPath;
    address[] public secondEarnedToToken0Path;
    address[] public secondEarnedToToken1Path;

    /**
        address[6] _configAddresses,
        _configAddress[0]   vaultChefAddress,
        _configAddresses[1] miniChefAddress,
        _configAddresses[2] uniRouterAddress,
        _configAddress[3]   wantAddress,
        _configAddress[4]   earnedAddress
        _configAddress[5]   secondEarnedAddress
    */

    /**
        address[11][] _paths
        _paths[0]   earnedToWnativePath,
        _paths[1]   earnedToUsdPath,
        _paths[2]   earnedToBananaPath,
        _paths[3]   earnedToToken0Path,
        _paths[4]   earnedToToken1Path,
        _paths[5]   secondEarnedToToken0Path,
        _paths[6]   secondEarnedToToken1Path,
        _paths[7]   token0ToEarnedPath,
        _paths[8]   token1ToEarnedPath
        _paths[9]   secondEarnedToUsdPath
        _paths[10]  secondEarnedToBananaPath
        _paths[11]  secondEarnedToWnativePath
     */
    function initialize(
        address[6] memory _configAddresses,
        uint256 _pid,
        address[11][] memory _paths
    ) public initializer {
        govAddress = msg.sender;
        vaultChefAddress = _configAddresses[0];

        miniChefAddress = _configAddresses[1];
        uniRouterAddress = _configAddresses[2];

        wantAddress = _configAddresses[3];
        token0Address = IUniPair(wantAddress).token0();
        token1Address = IUniPair(wantAddress).token1();

        pid = _pid;
        earnedAddress = _configAddresses[4];

        secondEarnedAddress = _configAddresses[5];

        earnedToWnativePath = _paths[0];
        earnedToUsdPath = _paths[1];
        earnedToBananaPath = _paths[2];
        earnedToToken0Path = _paths[3];
        earnedToToken1Path = _paths[4];
        secondEarnedToToken0Path = _paths[5];
        secondEarnedToToken1Path = _paths[6];
        token0ToEarnedPath = _paths[7];
        token1ToEarnedPath = _paths[8];
        secondEarnedToUsdPath = _paths[9];
        secondEarnedToBananaPath = _paths[10];
        secondEarnedToWnativePath = _paths[11];

        transferOwnership(vaultChefAddress);

        _resetAllowances();
    }

    function _vaultDeposit(uint256 _amount) internal override {
        IMiniChefStake(miniChefAddress).deposit(pid, _amount, address(this));
    }

    function _vaultWithdraw(uint256 _amount) internal override {
        IMiniChefStake(miniChefAddress).withdraw(pid, _amount, address(this));
    }

    function earn() external override nonReentrant whenNotPaused { 
        _earn(_msgSender());
    }

    function earn(address _to) external override nonReentrant whenNotPaused onlyGov {
        _earn(_to);
    }

    function _earn(address _to) internal {
        // Harvest farm tokens
        IMiniChefStake(miniChefAddress).harvest(pid, address(this));

        // Converts farm tokens into want tokens
        uint256 earnedAmt = IERC20(earnedAddress).balanceOf(address(this));
        uint256 secondEarnedAmt = IERC20(secondEarnedAddress).balanceOf(address(this));

        if (earnedAmt > 0) {
            earnedAmt = distributeFees(earnedAmt, earnedAddress, _to);
            earnedAmt = distributeRewards(earnedAmt, earnedAddress);
            earnedAmt = buyBack(earnedAmt, earnedAddress);

            if (earnedAddress != token0Address) {
                // Swap half earned to token0
                _safeSwap(earnedAmt.div(2), earnedToToken0Path, address(this));
            }

            if (earnedAddress != token1Address) {
                // Swap half earned to token1
                _safeSwap(earnedAmt.div(2), earnedToToken1Path, address(this));
            }
        }

        if (secondEarnedAmt > 0) {
            secondEarnedAmt = distributeFees(secondEarnedAmt, secondEarnedAddress, _to);
            secondEarnedAmt = distributeRewards(secondEarnedAmt, secondEarnedAddress);
            secondEarnedAmt = buyBack(secondEarnedAmt, secondEarnedAddress);

            if (secondEarnedAddress != token0Address) {
                // Swap half earned to token0
                _safeSwap(secondEarnedAmt.div(2), secondEarnedToToken0Path, address(this));
            }

            if (secondEarnedAddress != token1Address) {
                // Swap half earned to token1
                _safeSwap(secondEarnedAmt.div(2), secondEarnedToToken1Path, address(this));
            }
        }

        if (earnedAmt > 0 || secondEarnedAmt > 0) {
            // Get want tokens, ie. add liquidity
            uint256 token0Amt = IERC20(token0Address).balanceOf(address(this));
            uint256 token1Amt = IERC20(token1Address).balanceOf(address(this));
            if (token0Amt > 0 && token1Amt > 0) {
                IUniRouter02(uniRouterAddress).addLiquidity(
                    token0Address,
                    token1Address,
                    token0Amt,
                    token1Amt,
                    0,
                    0,
                    address(this),
                    block.timestamp.add(600)
                );
            }

            lastEarnBlock = block.number;

            _farm();
        }
    }

    // To pay for earn function
    function distributeFees(uint256 _earnedAmt, address _earnedAddress, address _to)
        internal
        returns (uint256)
    {
        if (controllerFee > 0) {
            uint256 fee = _earnedAmt.mul(controllerFee).div(FEE_MAX);

            if (_earnedAddress == wNativeAdress) {
                IWETH(wNativeAdress).withdraw(fee);
                safeTransferETH(_to, fee);
            } else if (_earnedAddress == secondEarnedAddress) {
                _safeSwapWnative(fee, secondEarnedToWnativePath, _to);
            } else {
                _safeSwapWnative(fee, earnedToWnativePath, _to);
            }

            _earnedAmt = _earnedAmt.sub(fee);
        }

        return _earnedAmt;
    }

    function distributeRewards(uint256 _earnedAmt, address _earnedAddress)
        internal
        returns (uint256)
    {
        if (rewardRate > 0) {
            uint256 fee = _earnedAmt.mul(rewardRate).div(FEE_MAX);

            uint256 usdBefore = IERC20(usdAddress).balanceOf(address(this));

            _safeSwap(
                fee,
                _earnedAddress == secondEarnedAddress
                    ? secondEarnedToUsdPath
                    : earnedToUsdPath,
                address(this)
            );

            uint256 usdAfter = IERC20(usdAddress)
            .balanceOf(address(this))
            .sub(usdBefore);

            IERC20(usdAddress).safeTransfer(rewardAddress, usdAfter);

            _earnedAmt = _earnedAmt.sub(fee);
        }

        return _earnedAmt;
    }

    function buyBack(uint256 _earnedAmt, address _earnedAddress)
        internal
        returns (uint256)
    {
        if (buyBackRate > 0) {
            uint256 buyBackAmt = _earnedAmt.mul(buyBackRate).div(FEE_MAX);

            _safeSwap(
                buyBackAmt,
                _earnedAddress == secondEarnedAddress
                    ? secondEarnedToBananaPath
                    : earnedToBananaPath,
                buyBackAddress
            );

            _earnedAmt = _earnedAmt.sub(buyBackAmt);
        }

        return _earnedAmt;
    }

    function vaultSharesTotal() public view override returns (uint256) {
        (uint256 balance, ) = IMiniChefStake(miniChefAddress).userInfo(
            pid,
            address(this)
        );
        return balance;
    }

    function wantLockedTotal() public view override returns (uint256) {
        (uint256 balance, ) = IMiniChefStake(miniChefAddress).userInfo(
            pid,
            address(this)
        );
        return IERC20(wantAddress).balanceOf(address(this)).add(balance);
    }

    function _resetAllowances() internal override {
        IERC20(wantAddress).safeApprove(miniChefAddress, uint256(0));
        IERC20(wantAddress).safeIncreaseAllowance(
            miniChefAddress,
            type(uint256).max
        );

        IERC20(earnedAddress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(earnedAddress).safeIncreaseAllowance(
            uniRouterAddress,
            type(uint256).max
        );

        IERC20(secondEarnedAddress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(secondEarnedAddress).safeIncreaseAllowance(
            uniRouterAddress,
            type(uint256).max
        );

        IERC20(wNativeAdress).safeApprove(uniRouterAddress, uint256(0));
        IERC20(wNativeAdress).safeIncreaseAllowance(
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
        IMiniChefStake(miniChefAddress).withdraw(
            pid,
            vaultSharesTotal(),
            address(this)
        );
    }

    function emergencyPanic() external onlyGov {
        _pause();
        IMiniChefStake(miniChefAddress).emergencyWithdraw(pid, address(this));
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(
            success,
            "TransferHelper::safeTransferETH: ETH transfer failed"
        );
    }

    receive() external payable { }
}
