const GoFish = artifacts.require("../contracts/GoFish.sol");

module.exports = function (deployer) {
  deployer.deploy(GoFish);
};
