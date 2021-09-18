// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./libs/IMasterchef.sol";
import "./StrategyMasterChefSingle.sol";

contract StrategyMasterChefSingleReflect is StrategyMasterChefSingle {
    using SafeMath for uint256;

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
}