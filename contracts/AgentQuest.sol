// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AgentQuest — quest hub for Agent ID holders
/// @notice Built for the Agent ID Hackathon (Binance Wallet x BNB Chain).
///         Every action requires holding a SPACE ID Agent ID (ERC-721, non-transferable).
///         Check in daily to build a streak, complete verifiable on-chain quests to earn XP,
///         climb levels and the leaderboard.
///         No token, no fees, no funds held by the contract: every interaction costs gas only.
///         Owner permissions (disclosed): add quests, activate/deactivate quests,
///         transfer ownership. The owner CANNOT touch user XP, streaks, or any funds,
///         and cannot pause the contract.
interface IBalanceOf {
    function balanceOf(address account) external view returns (uint256);
}

contract AgentQuest {
    IBalanceOf public constant AGENT_ID =
        IBalanceOf(0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F);

    address public owner;
    uint256 public questCount;

    uint256 public constant CHECKIN_XP = 10;
    uint256 public constant SECONDS_PER_DAY = 86400;

    struct Quest {
        address target; // ERC-20 or ERC-721 contract whose balance proves completion
        uint256 minBalance; // minimum balance required (raw units)
        uint256 xpReward; // XP awarded once per user
        bool active;
    }

    mapping(uint256 => Quest) public quests;
    mapping(address => uint256) public xp;
    mapping(address => uint256) public totalCheckIns;
    mapping(address => uint256) public lastCheckInDay;
    mapping(address => uint256) public streak;
    mapping(address => mapping(uint256 => bool)) public questCompleted;

    event CheckIn(address indexed user, uint256 indexed day, uint256 streak, uint256 totalXp);
    event QuestCompleted(address indexed user, uint256 indexed questId, uint256 xpReward, uint256 totalXp);
    event QuestAdded(uint256 indexed questId, address indexed target, uint256 minBalance, uint256 xpReward);
    event QuestStatusChanged(uint256 indexed questId, bool active);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyAgent() {
        require(AGENT_ID.balanceOf(msg.sender) > 0, "AgentQuest: caller holds no Agent ID");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "AgentQuest: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Level thresholds: L1 0+, L2 100+, L3 250+, L4 500+, L5 1000+, L6 2000+ XP.
    function levelOf(uint256 _xp) public pure returns (uint256) {
        if (_xp >= 2000) return 6;
        if (_xp >= 1000) return 5;
        if (_xp >= 500) return 4;
        if (_xp >= 250) return 3;
        if (_xp >= 100) return 2;
        return 1;
    }

    /// @notice Daily check-in. One per UTC day; consecutive days grow the streak.
    function checkIn() external onlyAgent {
        uint256 day = block.timestamp / SECONDS_PER_DAY;
        require(lastCheckInDay[msg.sender] != day, "AgentQuest: already checked in today");
        if (lastCheckInDay[msg.sender] == day - 1) {
            streak[msg.sender] += 1;
        } else {
            streak[msg.sender] = 1;
        }
        lastCheckInDay[msg.sender] = day;
        totalCheckIns[msg.sender] += 1;
        xp[msg.sender] += CHECKIN_XP;
        emit CheckIn(msg.sender, day, streak[msg.sender], xp[msg.sender]);
    }

    /// @notice Add a quest. `target` must be an ERC-20 or ERC-721 contract (same balanceOf selector).
    function addQuest(address target, uint256 minBalance, uint256 xpReward)
        external
        onlyOwner
        returns (uint256 questId)
    {
        require(target != address(0), "AgentQuest: zero target");
        require(xpReward > 0, "AgentQuest: zero reward");
        questId = questCount;
        quests[questId] = Quest({
            target: target,
            minBalance: minBalance,
            xpReward: xpReward,
            active: true
        });
        questCount += 1;
        emit QuestAdded(questId, target, minBalance, xpReward);
    }

    function setQuestActive(uint256 questId, bool active) external onlyOwner {
        require(questId < questCount, "AgentQuest: quest does not exist");
        quests[questId].active = active;
        emit QuestStatusChanged(questId, active);
    }

    /// @notice Complete a quest by proving you hold `minBalance` of the quest target.
    ///         One completion per user per quest; XP awarded once.
    function completeQuest(uint256 questId) external onlyAgent {
        require(questId < questCount, "AgentQuest: quest does not exist");
        Quest storage q = quests[questId];
        require(q.active, "AgentQuest: quest not active");
        require(!questCompleted[msg.sender][questId], "AgentQuest: quest already completed");
        require(
            IBalanceOf(q.target).balanceOf(msg.sender) >= q.minBalance,
            "AgentQuest: requirement not met"
        );
        questCompleted[msg.sender][questId] = true;
        xp[msg.sender] += q.xpReward;
        emit QuestCompleted(msg.sender, questId, q.xpReward, xp[msg.sender]);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "AgentQuest: zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
