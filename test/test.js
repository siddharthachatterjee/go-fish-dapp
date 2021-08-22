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

    it ("Should draw cards for dealer", () => {
        return instance.seeHand({from: accounts[0]}).then(res => {
            assert(res.length == 5);
        })
    })

    it ("Should allow account to join game", () => {
        return instance.invite(accounts[1])
            .then(() => assert(true))
            .catch(err => assert(false, err));
    })

    it ("Should draw cards for newly joined account", () => {
        return instance.seeHand({from: accounts[1]}).then(res => {
            assert(res.length === 5);
        })
    })

    it ("Should NOT start game from non-dealer", () => {
        return instance.startGame({from: accounts[1]})
            .then(() => {throw("No permission")})
            .catch(err => {
                assert(err != "No permission")
            })
    });

    it ("Should start game from dealer", () => {
        return instance.startGame({from: accounts[0]})
            .then(() => assert(true))
            .catch(err => assert(false, err))
    });

    it ("Should not allow accounts to join once game has started", () => {
        return instance.invite({from: accounts[2]})
            .then(() => {throw("Game has started")})
            .catch(err => assert(err != "Game has started"));
    })
})