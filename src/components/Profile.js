import Navbar from "./Navbar";
import MarketplaceJSON from "../truffle_abis/Marketplace.json";
import RWDTokenJSON from "../truffle_abis/RWDToken.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";

export default function Profile() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");
  const [balance, updateBalance] = useState("0");

  async function getNFTData() {
    const ethers = require("ethers");
    let sumPrice = 0;
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const walletAddr = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    const MarketplaceData = MarketplaceJSON.networks[chainId];
    const rwdTokenData = RWDTokenJSON.networks[chainId];

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceData.address,
      MarketplaceJSON.abi,
      signer
    );

    let rwdContract = new ethers.Contract(
      rwdTokenData.address,
      RWDTokenJSON.abi,
      signer
    );

    let balance = await rwdContract.balanceOf(walletAddr);
    console.log("Reward Token Balance: " + balance);
    updateBalance(ethers.utils.formatUnits(balance.toString(), "ether"));

    //Get an NFT Token
    let transaction = await contract.getMyNFTs();

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        console.log(tokenURI);
        let meta = await axios.get(tokenURI, {
          headers: {
            Accept: "text/plain",
          },
        });
        meta = meta.data;
        console.log(meta);

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        sumPrice += Number(price);
        return item;
      })
    );

    updateData(items);
    updateFetched(true);
    updateAddress(walletAddr);
    updateTotalPrice(sumPrice.toPrecision(3));
  }

  if (!dataFetched) {
    setTimeout(() => {
      getNFTData();
    }, 1000);
  }

  return (
    <div className="profileClass" style={{ minHeight: "100vh" }}>
      <Navbar></Navbar>
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {data && data.length}
          </div>
          <div className="ml-20">
            <h2 className="font-bold">Total Value</h2>
            {balance} ETH
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data &&
              data.map((value, index) => {
                return <NFTTile data={value} key={index}></NFTTile>;
              })}
          </div>
          <div className="mt-10 text-xl">
            {data && data.length === 0
              ? "Oops, No NFT data to display (Are you logged in?)"
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
