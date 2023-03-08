const { ethers, run, network } = require("hardhat")

//async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying ...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to ${simpleStorage.address}`)
    //Verify
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        //wait few blocks to make sure etherscan see it
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    //dealing with the contract
    const currentValue = await simpleStorage.retrieve()
    console.log(`current value is : ${currentValue}`)

    //update the value
    const transactonResponse = await simpleStorage.store(7)
    await transactonResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is : ${updatedValue}`)
}

async function verify(contractAddress, args) {
    try {
        console.log("Verifying contract ...")
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified"))
            console.log("Already verified")
        else console.log(e)
    }
}
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
