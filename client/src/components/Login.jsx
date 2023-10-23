


const Login = ({ connectToWallet }) => {
  return (
    <section className='w-full h-screen flex flex-col gap-7 justify-center items-center'>
      <h1 className='text-4xl'>Welcome to decentralized voting </h1>
      <button onClick={() => connectToWallet()} className='bg-green-500 p-3 rounded-sm transition-colors hover:bg-green-600'>Login MetaMask</button>
    </section>
  )
}

export default Login