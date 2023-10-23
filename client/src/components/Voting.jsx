


const Voting = ({ currentAccount, remainingTime, candidates, inputValue, setInputValue, canPersonVote ,vote }) => {

  return (
    <section className="w-full h-screen flex flex-col gap-7 justify-center px-2 py-5">

        {/* ----- Divide ----- */}
        <div className="mx-auto">
            <h1 className='text-5xl text-center py-4'>Your Are Ready To Vote</h1>
            <p className="text-lg text-orange-500 font-semibold">Connected Wallet: {currentAccount}</p>
            <p className="font-semibold text-center mt-5 ">Remaining Time: {Number(remainingTime)}</p>
        </div>

        {/* ----- Divide ----- */}
        <div className="mx-auto w-full max-w-[400px] flex">
            {
                canPersonVote 
                    ? ( 
                        <p className="text-center text-red-500 w-full">You Already Voted</p>
                    )
                    : (
                        <>
                            <input type="number" min="0" max={`${candidates.length - 1}`} value={inputValue} onChange={(e)=> setInputValue(e.target.value)} className="w-full p-2 border-none outline-none text-xl text-black" />
                            <button onClick={() => vote()} className="bg-purple-600 px-4 py-3 transition-colors hover:bg-purple-700 font-semibold">Vote</button>
                        </>
                    )
            }
        </div>

        {/* ----- Divide ----- */}
        <div className="mx-auto w-full max-w-[400px]">
            <table className="w-full">
                <thead className="w-full">
                    <tr>
                        <th className="border p-2 text-center">Index</th>
                        <th className="border p-2 text-center">Candidate Name</th>
                        <th className="border p-2 text-center">Candidate Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        candidates?.map(candidate => (
                            <tr key={candidate.index} className="border">
                                <td className="border text-center py-3">{candidate.index}</td>
                                <td className="border text-center py-3">{candidate.name}</td>
                                <td className="border text-center py-3">{Number(candidate.voteCount)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </section>
  )
}

export default Voting