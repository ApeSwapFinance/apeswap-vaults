# Maximizer Tests

== MaximizerVaultApe ==

- Withdraw
    - [x] Staked tokens taken out of farm?
    - [x] User received staked tokens?
    - [x] User received BANANA tokens
    - [x] Treasury received BANANA tokens
    - [x] withdrawFee received correctly (if needed)?
    - [ ] Other fees working?
    - [ ] User shared updated correctly?
    - [x] User debt updated correctly?

- Keeper (This is a complicated one to write good tests for I suppose)
    - [x] checkUpkeep
    - [x] performUpkeep

- Deposit
    - [x] Staked token in farm increased?
    - [x] user receives stake?
    - [x] user debt updated correctly?

- earnAll/harvest
    - [x] Banana rewards taken out of pool?
    - [x] Banana rewards put into Banana vault?
    - [x] accSharesPerStakedToken increased correctly?
    - [ ] Banana pool compounded?

- claimRewards
    - [x] autoBananaShares updated correctly?
    - [/] Correct rewards received?
    - [x] user debt updated correctly?

- [ ] addVault working?

- can disable and enable vault
    - [ ] disabled
        - [ ] Cant deposit
        - [ ] Cant compound
    - [ ] reenable 
      - [ ] Can deposit
      - [ ] Can compound

- Are view function correct?
    - [ ] getExpectedOutputs()
    - [ ] balanceOf(_user)
    - [ ] totalStake()
    - [ ] totalAutoBananaShares()

- [x] Maximizer onlyOwner update functions working?
- [ ] Strategy onlyOwner update functions working?
- [ ] BananaVault onlyOwner update functions working?
