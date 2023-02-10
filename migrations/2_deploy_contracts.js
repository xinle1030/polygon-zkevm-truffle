// const ZkERC20 = artifacts.require("./zkERC20.sol");
const NFTMarketplace = artifacts.require("./NFTMarketplace.sol");

module.exports = function (deployer) {
  // deployer.deploy(ZkERC20);
  deployer.deploy(NFTMarketplace);
};
