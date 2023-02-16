const RWDToken = artifacts.require("RWDToken");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(RWDToken);
  const rwdToken = await RWDToken.deployed();
  // let rwdTokenAddr = "0x1D0B434dD82280AD64F4ED50867156c068eCbB99";

  await deployer.deploy(NFTMarketplace, rwdToken.address);
  const nftMarketplace = await NFTMarketplace.deployed();

  // Transfer all RWD tokens to Marketplace (1 million)
  await rwdToken.transfer(nftMarketplace.address, 10000000000000000000000n);
};