let GoFish = artifacts.require("GoFish.sol");

let instance;

contract("Go Fish Contract", accounts => {
    it("Should deploy contract", () => {
        return GoFish.deployed().then(inst => {

            instance = inst;
            assert(inst !== undefined)
        })
    })

    it ("Should set dealer", () => {
        return instance.dealer().then(res => {
            assert(res !== undefined, "Dealer is undefined")
        })
    })
})