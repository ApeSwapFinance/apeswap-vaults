// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./libs/IStrategyBanana.sol";
import "./libs/IUniPair.sol";
import "./libs/IUniRouter02.sol";

abstract contract BaseStrategy is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using Math for uint256;
    using SafeERC20 for IERC20;

    address public wantAddress;
    address public earnedAddress;

    address public uniRouterAddress;
    address public usdAddress;
    address public bananaAddress;
    // Wrapped native token address (WBNB/WMATIC)
    address public wNativeAdress = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;

    address public rewardAddress = 0x4EB6b0A7543508f6EbD81c2E9c7cA7A471475e73;
    address public withdrawFeeAddress = 0x4EB6b0A7543508f6EbD81c2E9c7cA7A471475e73;
    address public vaultChefAddress;
    address public govAddress;

    uint256 public lastEarnBlock = block.number;
    uint256 public sharesTotal;

    // Burning wallet address
    address public buyBackAddress = 0xa22c3fAc4B4a4dfbF6a8F5F8fe85d9478acE2B0C;
    uint256 public controllerFee = 25; // 0.25%
    uint256 public rewardRate = 75; // 0.75%
    uint256 public buyBackRate = 300; // 3%

    uint256 public constant FEE_MAX_TOTAL = 10000;
    uint256 public constant FEE_MAX = 10000; // 100 = 1%

    uint256 public withdrawFeeFactor = 9990; // 0.1% default withdraw fee
    uint256 public constant WITHDRAW_FEE_FACTOR_MAX = 10000;
    uint256 public constant WITHDRAW_FEE_FACTOR_LL = 9900;

    uint256 public slippageFactor = 950; // 5% default slippage tolerance
    uint256 public constant SLIPPAGE_FACTOR_UL = 995;

    address[] public earnedToWnativePath;
    address[] public earnedToUsdPath;
    address[] public earnedToBananaPath;
    
    event SetSettings(
        uint256 _controllerFee,
        uint256 _rewardRate,
        uint256 _buyBackRate,
        uint256 _withdrawFeeFactor,
        uint256 _slippageFactor
    );

    event SetAddress(
        address rewardAddress,
        address withdrawFeeAddress,
        address buyBackAddress
    );
    
    modifier onlyGov() {
        require(msg.sender == govAddress, "!gov");
        _;
    }

    function _vaultDeposit(uint256 _amount) internal virtual;
    function _vaultWithdraw(uint256 _amount) internal virtual;
    function _vaultHarvest() internal virtual;
    function _beforeDeposit(address _from) internal virtual;
    function _beforeWithdraw(address _from) internal virtual;
    function earn() external virtual;
    function earn(address _to) external virtual;
    function vaultSharesTotal() public virtual view returns (uint256);
    function wantLockedTotal() public virtual view returns (uint256);
    function _resetAllowances() internal virtual;
    function _emergencyVaultWithdraw() internal virtual;
    
    function deposit(address _userAddress, uint256 _wantAmt) external onlyOwner nonReentrant whenNotPaused returns (uint256) {
        // Call must happen before transfer
        _beforeDeposit(_userAddress);
        uint256 wantLockedBefore = wantLockedTotal();

        IERC20(wantAddress).safeTransferFrom(
            address(msg.sender),
            address(this),
            _wantAmt
        );

        // Proper deposit amount for tokens with fees, or vaults with deposit fees
        uint256 sharesAdded = _farm();
        if (sharesTotal > 0) {
            sharesAdded = sharesAdded.mul(sharesTotal).div(wantLockedBefore);
        }
        require(sharesAdded >= 1, "Low deposit - no shares added");
        sharesTotal = sharesTotal.add(sharesAdded);

        return sharesAdded;
    }

    function _farm() internal returns (uint256) {
        uint256 wantAmt = IERC20(wantAddress).balanceOf(address(this));
        if (wantAmt == 0) return 0;
        
        uint256 sharesBefore = vaultSharesTotal();
        _vaultDeposit(wantAmt);
        uint256 sharesAfter = vaultSharesTotal();
        
        return sharesAfter.sub(sharesBefore);
    }

    function withdraw(address _userAddress, uint256 _wantAmt) external onlyOwner nonReentrant returns (uint256) {
        require(_wantAmt > 0, "_wantAmt is 0");
        
        _beforeWithdraw(_userAddress);
        uint256 wantAmt = IERC20(wantAddress).balanceOf(address(this));
        uint256 wantBeforeWithdraw = wantLockedTotal();
        
        // Check if strategy has tokens from panic
        if (_wantAmt > wantAmt) {
            _vaultWithdraw(_wantAmt.sub(wantAmt));
            wantAmt = IERC20(wantAddress).balanceOf(address(this));
        }

        if (_wantAmt > wantAmt) {
            _wantAmt = wantAmt;
        }

        if (_wantAmt > wantBeforeWithdraw) {
            _wantAmt = wantBeforeWithdraw;
        }

        uint256 sharesRemoved = _wantAmt.mul(sharesTotal).ceilDiv(wantBeforeWithdraw);
        if (sharesRemoved > sharesTotal) {
            sharesRemoved = sharesTotal;
        }
        require(sharesRemoved >= 1, "Low withdraw - no shares removed");
        sharesTotal = sharesTotal.sub(sharesRemoved);
        
        // Withdraw fee
        uint256 withdrawFee = _wantAmt
            .mul(WITHDRAW_FEE_FACTOR_MAX.sub(withdrawFeeFactor))
            .div(WITHDRAW_FEE_FACTOR_MAX);
        if (withdrawFee > 0) {
            IERC20(wantAddress).safeTransfer(withdrawFeeAddress, withdrawFee);
        }
        
        _wantAmt = _wantAmt.sub(withdrawFee);

        IERC20(wantAddress).safeTransfer(vaultChefAddress, _wantAmt);

        return sharesRemoved;
    }

    // To pay for earn function
    function distributeFees(uint256 _earnedAmt, address _to) internal returns (uint256) {
        if (controllerFee > 0) {
            uint256 fee = _earnedAmt.mul(controllerFee).div(FEE_MAX);
    
            _safeSwapWnative(
                fee,
                earnedToWnativePath,
                _to
            );
            
            _earnedAmt = _earnedAmt.sub(fee);
        }

        return _earnedAmt;
    }

    function distributeRewards(uint256 _earnedAmt) internal returns (uint256) {
        if (rewardRate > 0) {
            uint256 fee = _earnedAmt.mul(rewardRate).div(FEE_MAX);

            if (earnedAddress == bananaAddress) {
                // Earn token is BANANA - don't sell
                IERC20(earnedAddress).safeTransfer(rewardAddress, fee);
            } else {
                _safeSwap(
                    fee,
                    earnedToUsdPath,
                    rewardAddress
                );
            }

            _earnedAmt = _earnedAmt.sub(fee);
        }

        return _earnedAmt;
    }

    function buyBack(uint256 _earnedAmt) internal virtual returns (uint256) {
        if (buyBackRate > 0) {
            uint256 buyBackAmt = _earnedAmt.mul(buyBackRate).div(FEE_MAX);

            if (earnedAddress == bananaAddress) {
                // Earn token is BANANA - don't sell
                IERC20(earnedAddress).safeTransfer(buyBackAddress, buyBackAmt);
            } else {
                _safeSwap(
                    buyBackAmt,
                    earnedToBananaPath,
                    buyBackAddress
                );
            }

            _earnedAmt = _earnedAmt.sub(buyBackAmt);
        }
        
        return _earnedAmt;
    }

    function resetAllowances() external onlyGov {
        _resetAllowances();
    }

    function pause() external onlyGov {
        _pause();
    }

    function unpause() external onlyGov {
        _unpause();
        _resetAllowances();
    }

    function panic() external onlyGov {
        _pause();
        _emergencyVaultWithdraw();
    }

    function unpanic() external onlyGov {
        _unpause();
        _farm();
    }

    function setGov(address _govAddress) external onlyGov {
        govAddress = _govAddress;
    }
    
    function setSettings(
        uint256 _controllerFee,
        uint256 _rewardRate,
        uint256 _buyBackRate,
        uint256 _withdrawFeeFactor,
        uint256 _slippageFactor
    ) external onlyGov {
        require(_controllerFee.add(_rewardRate).add(_buyBackRate) <= FEE_MAX_TOTAL, "Max fee of 100%");
        require(_withdrawFeeFactor >= WITHDRAW_FEE_FACTOR_LL, "_withdrawFeeFactor too low");
        require(_withdrawFeeFactor <= WITHDRAW_FEE_FACTOR_MAX, "_withdrawFeeFactor too high");
        require(_slippageFactor <= SLIPPAGE_FACTOR_UL, "_slippageFactor too high");
        controllerFee = _controllerFee;
        rewardRate = _rewardRate;
        buyBackRate = _buyBackRate;
        withdrawFeeFactor = _withdrawFeeFactor;
        slippageFactor = _slippageFactor;

        emit SetSettings(
            _controllerFee,
            _rewardRate,
            _buyBackRate,
            _withdrawFeeFactor,
            _slippageFactor
        );
    }

    function setAddresses(
        address _rewardAddress,
        address _withdrawFeeAddress,
        address _buyBackAddress
    ) external onlyGov {
        require(_withdrawFeeAddress != address(0), "Invalid Withdraw address");
        require(_rewardAddress != address(0), "Invalid reward address");
        require(_buyBackAddress != address(0), "Invalid buyback address");

        rewardAddress = _rewardAddress;
        withdrawFeeAddress = _withdrawFeeAddress;
        buyBackAddress = _buyBackAddress;

        emit SetAddress(_rewardAddress, _withdrawFeeAddress, _buyBackAddress);
    }
    
    function _safeSwap(
        uint256 _amountIn,
        address[] memory _path,
        address _to
    ) internal virtual {
        uint256[] memory amounts = IUniRouter02(uniRouterAddress).getAmountsOut(_amountIn, _path);
        uint256 amountOut = amounts[amounts.length.sub(1)];

        IUniRouter02(uniRouterAddress).swapExactTokensForTokens(
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
    ) internal virtual {
        uint256[] memory amounts = IUniRouter02(uniRouterAddress).getAmountsOut(_amountIn, _path);
        uint256 amountOut = amounts[amounts.length.sub(1)];

        IUniRouter02(uniRouterAddress).swapExactTokensForETH(
            _amountIn,
            amountOut.mul(slippageFactor).div(1000),
            _path,
            _to,
            block.timestamp.add(600)
        );
    }
}