const Marketplace = artifacts.require("./Marketplace.sol");
//const EBookToken = artifacts.require("./EBookToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
  //deployer.deploy(EBookToken);
};
