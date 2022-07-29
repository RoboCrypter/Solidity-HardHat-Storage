const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("Testing Storage Contract", () => {
    let contractFactory, storage

    beforeEach("Deploying Storage Contract", async() => {
        contractFactory = await ethers.getContractFactory("Storage")
        storage = await contractFactory.deploy()
    })

    it("It should have the Current Number 0", async() => {
        const currentNo = await storage.retreive()
        const expectedCurrentNo = "0"

        assert.equal(currentNo.toString(), expectedCurrentNo)

        // you can use either "assert" or "expect"

        // expect(currentNo.toString()).to.equal(expectedCurrentNo)
    })

    it("It should update the Current Number to 100 ", async() => {
        const updatedNo = "100"
        const store = await storage.store(updatedNo)
        await store.wait(1)
        const currentNo = await storage.retreive()

        expect(currentNo.toString()).to.equal(updatedNo)
    })

    it("It should work correctly, with people struct and array, and also mapping", async() => {
        const favNo = "10"
        const name = "robot"

        const response = await storage.peopleData(favNo, name)
        await response.wait(1)

        const dataArray = await storage.data(0)

        const personFavNo = dataArray.favNo
        const personName = dataArray.name

        const myFavNoMapping = await storage.myFavNo(name)

        expect(favNo).to.equal(personFavNo)
        expect(name).to.equal(personName)
        expect(favNo).to.equal(myFavNoMapping)
    })
})
