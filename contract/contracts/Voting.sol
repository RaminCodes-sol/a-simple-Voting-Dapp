// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Voting {
    address public owner;
    uint256 public startTime;
    uint256 public endTime;

    struct CandidateStruct {
        string name;
        uint256 voteCount;
    }

    CandidateStruct[] public candidates;

    mapping (address => bool) public voters;


    constructor (string[] memory _candidatesName, uint256 _durationInMinutes) {
        owner = msg.sender;
        startTime = block.timestamp;
        endTime = block.timestamp + (_durationInMinutes * 1 minutes);
        
        for (uint256 i = 0; i < _candidatesName.length; i++) {
            candidates.push(CandidateStruct({
                name: _candidatesName[i],
                voteCount: 0
            }));
        }
    }
    

    // Events 
    event Voted(address indexed voterAddress, uint256 candidateIndex);


    // Modifier
    modifier onlyOwner () {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }


    // Add a new Candidate
    function addCandidate (string memory _name) public onlyOwner {
        candidates.push(CandidateStruct({
            name: _name,
            voteCount: 0
        }));
    }


    // Vote
    function vote (uint256 _candidateIndex) public {
        require(voters[msg.sender] == false, "You Hava Already Voted");
        require(_candidateIndex < candidates.length, "Invalid Candidate Index");
        require(block.timestamp >= startTime, "Voting Has Not Started Yet");
        require(block.timestamp <= endTime, "Voting Time Ended");

        voters[msg.sender] = true;
        candidates[_candidateIndex].voteCount += 1;

        emit Voted(msg.sender, _candidateIndex);
    }


     // Get All Candidates
    function getAllCandidates () public view returns (CandidateStruct[] memory) {
        return candidates;
    }


    // Get Voting Status
    function getVotingStatus () public view returns (bool) {
        return (block.timestamp >= startTime && block.timestamp <= endTime);
    }


    // Get Remaining Time
    function getRemainingTime () public view returns (uint256) {
        require(block.timestamp >= startTime, "Voting Has Not Started Yet");
        
        if (block.timestamp >= endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }
}


