const { expect } = require("chai");
const { network } = require('hardhat');
const { mine } = require("@nomicfoundation/hardhat-network-helpers");



describe("Voting", () => {
  let voting, deployer, voter

  const candidatesNames = ["Loura", "Alex", "Charlie", "Mike"]
  const durationInMinutes = 180

  beforeEach(async () => {
    voting = await hre.ethers.deployContract("Voting", [candidatesNames, durationInMinutes]);
    await voting.waitForDeployment();

    [deployer, voter] = await hre.ethers.getSigners()
  })

  /*----- describe - Development -----*/
  describe("Development", () => {
    it("ُShould Initialize Contract With Correct Values", async () => {
      // console.log("time", await voting.endTime())

      expect(await voting.owner()).to.equal(deployer.address)

      expect(await voting.startTime()).to.equal(await voting.startTime())

      const expectedEndTime = await voting.startTime() + BigInt(durationInMinutes) * BigInt(60)
      expect(await voting.endTime()).to.equal(expectedEndTime)

      for (let i = 0; i < candidatesNames.length; i++) {
        const candidate = await voting.candidates(i)
        expect(candidate.name).to.be.a("string").to.equal(candidatesNames[i])
        expect(Number(candidate.voteCount)).to.be.a("number").to.equal(0)
      }
    })
  })


  /*----- describe-Adding Candidate -----*/
  describe("Adding Candidate", () => {
    it("Adds Candidate", async () => {
      const responseTx = await voting.connect(deployer).addCandidate("Richard")
      await responseTx.wait()
      
      const candidate = await voting.candidates(4)
      expect(candidate.name).to.be.a("string").to.equal("Richard")
      expect(Number(candidate.voteCount)).to.be.a("number").to.equal(0)
    })
  })

  
  /*----- describe-Voting -----*/
  describe("Voting", () => {
    let responseTx
    
    it("Should Fails If Voter Has Already Voted", async () => {
      responseTx = await voting.connect(voter).vote(1)  // voting candidate with index of 1
      await responseTx.wait()
      await expect(voting.connect(voter).vote(1)).to.be.revertedWith("You Hava Already Voted")
    })

    it("Should Fails If Candidate Index Is Greater Than Candidates Length", async () => {
      await expect(voting.connect(voter).vote(10)).to.be.revertedWith("Invalid Candidate Index")
    })

    it("Should Fails If Voting Has Not Startet Yet", async () => {
    })
  
    it("Should Fails If Voting Has Been Ended", async () => {
      const newTimestamp = parseInt(await voting.endTime()) + 3600

      await network.provider.send("evm_setNextBlockTimestamp", [newTimestamp])
      await network.provider.send("evm_mine")

      await expect(voting.connect(voter).vote(1)).to.be.revertedWith("Voting Time Ended")
    })

    it("Sets True If Voter Has Just Voted", async () => {
      responseTx = await voting.connect(voter).vote(1) // voting candidate with index of 1
      await responseTx.wait()
      expect(await voting.voters(voter.address)).to.equal(true)
    })

    it("Adds VoteCount To a Specific Candidate", async () => {
      responseTx = await voting.connect(voter).vote(1) // voting candidate with index of 1
      await responseTx.wait()
      const candidate = await voting.candidates(1)
      expect(candidate.voteCount).to.equal(1)
    })

    it("Emits Voted event", async () => {
      // we can do it this way
      expect(await responseTx).to.emit(voting, "Voted").withArgs(voter.address, 1)
      // or we can do it this way
      // await expect(voting.connect(voter).vote(1)).to.emit(voting, "Voted").withArgs(voter.address, 1)
    })
  })


  /*----- describe-Get All Candidates -----*/
  describe("Get All Candidates", () => {
    it("Returns Candidates Details", async () => {
      for (let i = 0; i < candidatesNames.length; i++) {
        const candidate = await voting.candidates(i)

        expect(candidate).to.have.lengthOf(2) // [{name: "Loura", voteCount: 0}] length is 2
        expect(candidate.name).to.be.a("string").to.equal(candidatesNames[i])
        expect(Number(candidate.voteCount)).to.be.a("number").to.equal(0)
      }
    })
  })


  /*----- describe-Get Voting Status -----*/
  describe("Get Voting Status", () => {
    let newTimestamp

    it('Should return true when within the voting period', async () => {
      newTimestamp = parseInt(await voting.startTime()) + 3600 // Set newTimestamp to 2 hours in the future

      // Set the current block timestamp to match the newTimestamp.
      await network.provider.send("evm_setNextBlockTimestamp", [newTimestamp])
      // Mine a new block.
      // the changes made in the previous line (setting the timestamp) take effect and become visible in the current block.
      await network.provider.send("evm_mine")
  
      const votingStatus = await voting.getVotingStatus()
      console.log("votingStatus:", votingStatus)
      expect(votingStatus).to.equal(true)
    })

    it("Should return false when outside the voting period", async () => {
      newTimestamp = parseInt(await voting.endTime()) + 3600 // Set newTimestamp 3 + 1 = 4 hours after the startTime

      await network.provider.send("evm_setNextBlockTimestamp", [newTimestamp])
      await network.provider.send("evm_mine")

      const votingStatus = await voting.getVotingStatus()
      console.log("votingStatus:", votingStatus)
      expect(votingStatus).to.equal(false)
    })
  })


  /*----- describe-Get Remaining Time -----*/

  describe("Get Remaining Time", () => {
    
  })
})