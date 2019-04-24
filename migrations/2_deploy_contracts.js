const EBookToken = artifacts.require("./EBookToken.sol");

module.exports = function(deployer) {
  deployer.deploy(EBookToken, "title", 10, 10);
};
