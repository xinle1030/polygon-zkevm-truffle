const RWDToken = artifacts.require("RWDToken");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer) {
  // await deployer.deploy(RWDToken);
  // const rwdToken = await RWDToken.deployed();
  let rwdTokenAddr = "0x1D0B434dD82280AD64F4ED50867156c068eCbB99";;

  await deployer.deploy(NFTMarketplace, rwdTokenAddr);
  const nftMarketplace = await NFTMarketplace.deployed();

  // Transfer all RWD tokens to Marketplace (1 million)
  // await rwdToken.transfer(nftMarketplace.address, "100000000000000000000000");
};