const ZkERC20 = artifacts.require("./zkERC20.sol");

module.exports = function (deployer) {
  deployer.deploy(ZkERC20);
};
