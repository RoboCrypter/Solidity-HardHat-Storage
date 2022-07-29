const { ethers, run, network } = require("hardhat")



async function main() {
    const storageFactory = await ethers.getContractFactory("Storage")
    
    console.log("Please Wait...Deploying the Contract")

    const storage = await storageFactory.deploy()
    await storage.deployed()
    console.log(storage.address)

    if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
      
      console.log("Contract is Waiting for block confirmations...")
      await storage.deployTransaction.wait(6)

      await verify(storage.address, [])
    }

    const currentNo = await storage.retreive()
    console.log(`Current No: ${currentNo}`)
    const storeNo = await storage.store(100)
    await storeNo.wait(1)
    const updatedCurrentNo = await storage.retreive()
    console.log(`Updated No: ${updatedCurrentNo}`)
}

async function verify(contractAddress, args) {
  console.log("Please Wait... Contract is Verifying")

  try{

    await run("verify:verify", {

    address: contractAddress,
    constructorArguments : args
  })
  }catch(error) {
    
    if(error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")

    }else{

    console.log(error)
    }
  }
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
