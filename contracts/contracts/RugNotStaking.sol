// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RugNotStaking {
    IERC20 public stakingToken;

    struct TokenStake {
        uint256 totalLegit;
        uint256 totalRug;
        bool resolved;
        bool outcome; // true = LEGIT, false = RUG
    }

    mapping(address => TokenStake) public tokenStakes;
    mapping(address => mapping(address => uint256)) public userStakesLegit;
    mapping(address => mapping(address => uint256)) public userStakesRug;

    event Staked(address indexed user, address indexed token, bool prediction, uint256 amount);
    event Resolved(address indexed token, bool outcome);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(address token, bool prediction, uint256 amount) external {
        require(amount > 0, "Must stake some tokens");
        require(!tokenStakes[token].resolved, "Token already resolved");

        // Transfer tokens from user to contract
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        if (prediction) {
            tokenStakes[token].totalLegit += amount;
            userStakesLegit[token][msg.sender] += amount;
        } else {
            tokenStakes[token].totalRug += amount;
            userStakesRug[token][msg.sender] += amount;
        }

        emit Staked(msg.sender, token, prediction, amount);
    }

    function resolve(address token, bool outcome) external {
        // In a real app, this would be restricted to a decentralized oracle or admin
        require(!tokenStakes[token].resolved, "Already resolved");
        
        tokenStakes[token].resolved = true;
        tokenStakes[token].outcome = outcome;

        emit Resolved(token, outcome);
    }

    // Reward distribution would go here (withdraw function)
}
