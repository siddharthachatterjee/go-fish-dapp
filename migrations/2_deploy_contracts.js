const GoFish = artifacts.require("GoFish.sol");

module.exports = function (deployer) {
  deployer.deploy(GoFish);
};
