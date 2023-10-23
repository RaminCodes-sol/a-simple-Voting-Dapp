import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import { BrowserProvider } from 'ethers/providers'
import Login from "./components/Login"
import Voting from "./components/Voting"
import VotingContract from './contract.json'



const App = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [votingStatus, setVotingStatus] = useState(false)
  const [remainingTime, setRemainingTime] = useState('')
  const [candidates, setCandidates] = useState('')
  const [inputValue, setInputValue] = useState(0)
  const [canPersonVote, setCanPersonVote] = useState(false)


  // Connect To Wallet
  const connectToWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])

        const signer = await provider.getSigner()
        const accountAddress = await signer.getAddress()

        if (accountAddress) {
          setCurrentAccount(accountAddress)
          setIsConnected(true)
          canVote()
          console.log("MetaMask Connected:", accountAddress)
        } else {
          console.log("Please Connect Your Wallet")
        }
      } catch(error) {
        console.log("Error:", error.message)
        setIsConnected(false)
      }
    } else {
      alert("Please install MetaMask")
    }
  }
  

  // Get Voting Status
  const getVotingStatus = async () => {
    const provider = new BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contractInstance = new ethers.Contract(VotingContract.address, VotingContract.abi, signer)

    const votingStatus = await contractInstance.getVotingStatus()
    setVotingStatus(votingStatus)
    console.log("VotingStatus:", votingStatus)
  }
 

  // Get Remaining Time
  const getRemainingTime = async () => {
    const provider = new BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contractInstance = new ethers.Contract(VotingContract.address, VotingContract.abi, signer)

    const remainingTime = await contractInstance.getRemainingTime()
    setRemainingTime(remainingTime)
    console.log("remainingTime:", parseInt(remainingTime))
  }


  // Get All Candidates
  const getAllCandidates = async () => {
    const provider = new BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contractInstance = new ethers.Contract(VotingContract.address, VotingContract.abi, signer)

    let candidates = await contractInstance.getAllCandidates()
    candidates = candidates?.map((candidate, index)=> ({
      index: index,
      name: candidate.name,
      voteCount: parseInt(candidate.voteCount)
    }))

    setCandidates(candidates)
    console.log("candidates:", Object.values(candidates))
  }


  // Can Person Vote
  let canVote = async () => {
    const provider = new BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contractInstance = new ethers.Contract(VotingContract.address, VotingContract.abi, signer)

    const canVote = await contractInstance.voters(await signer.getAddress())
    setCanPersonVote(canVote)
    console.log("Can this account vote:", canPersonVote) 
  }
    

  // Voting
  const vote = async () => {
    const provider = new BrowserProvider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = await provider.getSigner()
    const contractInstance = new ethers.Contract(VotingContract.address, VotingContract.abi, signer)

    const responseTx = await contractInstance.vote(inputValue)
    await responseTx.wait()
    canVote()
  }
  

  // Handle Accounts Changed
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0 && currentAccount != accounts[0]) {
      setCurrentAccount(accounts[0])
      canVote()
    } else {
      setIsConnected(false)
      setCurrentAccount(null)
    }
  }



  useEffect(() => {
    getVotingStatus()
    getRemainingTime()
    getAllCandidates()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [currentAccount])


  useEffect(() => {
    getAllCandidates()
  }, [canPersonVote])


  return (
    <main>
      {
        votingStatus 
          ? (
              isConnected 
                ? <Voting 
                    currentAccount={currentAccount}
                    votingStatus={votingStatus}
                    remainingTime={remainingTime}
                    candidates={candidates}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    canPersonVote={canPersonVote}
                    vote={vote}
                  />
                : <Login connectToWallet={connectToWallet} />
            )
          : (<p className="text-xl text-red-500 text-center my-14">Voting Ended</p>)
      }     
    </main>
  )
}

export default App
