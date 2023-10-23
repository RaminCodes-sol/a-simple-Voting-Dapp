const hre = require("hardhat");


async function main() {
  const voting = await hre.ethers.deployContract("Voting", [["Loura", "Alex", "Charlie", "Mike"], 200]);
  await voting.waitForDeployment()

  console.log(`Voting Contract Deployed to: ${voting.target}`)

  const candidates = [];

  for (let i = 0; i < 4; i++) {
    const candidate = await voting.candidates(i)
    candidates.push({
      name: candidate.name,
      voteCount: Number(candidate.voteCount)
    });
  }

  console.log("Candidates:", candidates);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
