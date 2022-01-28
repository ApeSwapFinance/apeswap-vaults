// contract PacocaVault is Ownable, ReentrancyGuard {
//     using SafeERC20 for IERC20;
//     using SafeMath for uint256;

//     struct UserInfo {
//         uint256 shares; // number of shares for a user
//         uint256 lastDepositedTime; // keeps track of deposited time for potential penalty
//         uint256 pacocaAtLastUserAction; // keeps track of pacoca deposited at the last user action
//         uint256 lastUserActionTime; // keeps track of the last user action time
//     }

//     IERC20 public immutable token; // Pacoca token
//     IPacocaFarm public immutable masterchef;

//     mapping(address => UserInfo) public userInfo;

//     uint256 public totalShares;
//     uint256 public lastHarvestedTime;
//     address public treasury;

//     uint256 public withdrawFee;
//     uint256 public withdrawFeePeriod = 72 hours; // 3 days
//     uint256 public constant MAX_WITHDRAW_FEE = 200; // 2%

//     event Deposit(address indexed sender, uint256 amount, uint256 shares, uint256 lastDepositedTime);
//     event Withdraw(address indexed sender, uint256 amount, uint256 shares);
//     event Harvest(address indexed sender);
//     event SetTreasury(address treasury);
//     event SetWithdrawFee(uint256 withdrawFee);

//     /**
//      * @notice Constructor
//      * @param _token: Pacoca token contract
//      * @param _masterchef: MasterChef contract
//      * @param _owner: address of the owner
//      * @param _treasury: address of the treasury (collects fees)
//      */
//     constructor(
//         IERC20 _token,
//         IPacocaFarm _masterchef,
//         address _owner,
//         address _treasury,
//         uint256 _withdrawFee
//     ) public {
//         token = _token;
//         masterchef = _masterchef;
//         treasury = _treasury;
//         withdrawFee = _withdrawFee;

//         transferOwnership(_owner);
//     }

//     /**
//      * @notice Deposits funds into the Pacoca Vault
//      * @param _amount: number of tokens to deposit (in PACOCA)
//      */
//     function deposit(uint256 _amount) external nonReentrant {
//         require(_amount > 0, "PacocaVault: Nothing to deposit");

//         uint256 pool = underlyingTokenBalance();
//         token.safeTransferFrom(msg.sender, address(this), _amount);
//         uint256 currentShares = 0;
//         if (totalShares != 0) {
//             currentShares = (_amount.mul(totalShares)).div(pool);
//         } else {
//             currentShares = _amount;
//         }
//         UserInfo storage user = userInfo[msg.sender];

//         user.shares = user.shares.add(currentShares);
//         user.lastDepositedTime = block.timestamp;

//         totalShares = totalShares.add(currentShares);

//         user.pacocaAtLastUserAction = user.shares.mul(underlyingTokenBalance()).div(totalShares);
//         user.lastUserActionTime = block.timestamp;

//         _earn();

//         emit Deposit(msg.sender, _amount, currentShares, block.timestamp);
//     }

//     /**
//      * @notice Withdraws all funds for a user
//      */
//     function withdrawAll() external {
//         withdraw(userInfo[msg.sender].shares);
//     }

//     /**
//      * @notice Reinvests PACOCA tokens into MasterChef
//      */
//     function harvest() external {
//         masterchef.withdraw(0, 0);

//         _earn();

//         emit Harvest(msg.sender);
//     }

//     /**
//      * @notice Sets treasury address
//      * @dev Only callable by the contract owner.
//      */
//     function setTreasury(address _treasury) external onlyOwner {
//         require(_treasury != address(0), "PacocaVault: Cannot be zero address");

//         treasury = _treasury;

//         emit SetTreasury(treasury);
//     }

//     /**
//      * @notice Sets withdraw fee
//      * @dev Only callable by the contract owner.
//      */
//     function setWithdrawFee(uint256 _withdrawFee) external onlyOwner {
//         require(
//             _withdrawFee <= MAX_WITHDRAW_FEE,
//             "PacocaVault: withdrawFee cannot be more than MAX_WITHDRAW_FEE"
//         );

//         withdrawFee = _withdrawFee;

//         emit SetWithdrawFee(withdrawFee);
//     }

//     /**
//      * @notice Calculates the total pending rewards that can be restaked
//      * @return Returns total pending Pacoca rewards
//      */
//     function calculateTotalPendingPacocaRewards() external view returns (uint256) {
//         uint256 amount = masterchef.pendingPACOCA(0, address(this));
//         amount = amount.add(available());

//         return amount;
//     }

//     /**
//      * @notice Calculates the price per share
//      */
//     function getPricePerFullShare() external view returns (uint256) {
//         return totalShares == 0 ? 1e18 : underlyingTokenBalance().mul(1e18).div(totalShares);
//     }

//     /**
//      * @notice Withdraws from funds from the Pacoca Vault
//      * @param _shares: Number of shares to withdraw
//      */
//     function withdraw(uint256 _shares) public nonReentrant {
//         UserInfo storage user = userInfo[msg.sender];

//         require(
//             _shares > 0,
//             "PacocaVault: Nothing to withdraw"
//         );
//         require(
//             _shares <= user.shares,
//             "PacocaVault: Withdraw amount exceeds balance"
//         );

//         uint256 currentAmount = (underlyingTokenBalance().mul(_shares)).div(totalShares);
//         user.shares = user.shares.sub(_shares);
//         totalShares = totalShares.sub(_shares);

//         uint256 bal = available();
//         if (bal < currentAmount) {
//             uint256 balWithdraw = currentAmount.sub(bal);
//             masterchef.withdraw(0, balWithdraw);
//             uint256 balAfter = available();
//             uint256 diff = balAfter.sub(bal);
//             if (diff < balWithdraw) {
//                 currentAmount = bal.add(diff);
//             }
//         }

//         if (
//             withdrawFee > 0 &&
//             block.timestamp < user.lastDepositedTime.add(withdrawFeePeriod)
//         ) {
//             uint256 currentWithdrawFee = currentAmount.mul(withdrawFee).div(10000);
//             token.safeTransfer(treasury, currentWithdrawFee);
//             currentAmount = currentAmount.sub(currentWithdrawFee);
//         }

//         if (user.shares > 0) {
//             user.pacocaAtLastUserAction = user.shares.mul(underlyingTokenBalance()).div(totalShares);
//         } else {
//             user.pacocaAtLastUserAction = 0;
//         }

//         user.lastUserActionTime = block.timestamp;

//         token.safeTransfer(msg.sender, currentAmount);

//         emit Withdraw(msg.sender, currentAmount, _shares);
//     }

//     /**
//      * @notice Custom logic for how much the vault allows to be borrowed
//      * @dev The contract puts 100% of the tokens to work.
//      */
//     function available() public view returns (uint256) {
//         return token.balanceOf(address(this));
//     }

//     /**
//      * @notice Calculates the total underlying tokens
//      * @dev It includes tokens held by the contract and held in MasterChef
//      */
//     function underlyingTokenBalance() public view returns (uint256) {
//         (uint256 amount,) = masterchef.userInfo(0, address(this));

//         return token.balanceOf(address(this)).add(amount);
//     }

//     /**
//      * @notice Deposits tokens into MasterChef to earn staking rewards
//      */
//     function _earn() internal {
//         uint256 balance = available();

//         if (balance > 0) {
//             if (token.allowance(address(this), address(masterchef)) < balance) {
//                 token.safeApprove(address(masterchef), uint(- 1));
//             }

//             masterchef.deposit(0, balance);
//         }
//     }
// }