'use client'
import React, { useState, useEffect } from "react";
import { swapTokens } from '@/app/api/lib/swapTokens';
import deployedAddresses from "@/smart-contracts/deployed-address.json";
import { ethers, JsonRpcProvider, formatEther, parseEther, Contract, Wallet } from 'ethers';
import { BrowserProvider } from 'ethers';





const formatted = formatEther("1000000000000000000");


const truncateAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

/*export const getTokenSwapContract = async () => {
  if (!window.ethereum) throw new Error("No wallet detected");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contractAddress = deployedAddresses.contractAddress;

  return new ethers.Contract(contractAddress, TokenSwapArtifact.abi, signer);
};*/

export default function SwapSection() {
  const [selectedCoin, setSelectedCoin] = useState("Coin");
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState("");
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState<string | null>(null);
const [fee, setFee] = useState(0);
const [total, setTotal] = useState<number>(0);
const [fromCoin, setFromCoin] = useState("Ethereum");
  const [toCoin, setToCoin] = useState("Bitcoin");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [gasFee, setGasFee] = useState(0);
  const [network, setNetwork] = useState("Ethereum");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  /*const contractAbi = TokenSwapArtifact.abi; // ABI from the compiled contract*/
const contractAddress = deployedAddresses.contractAddress;
const [swapRate, setSwapRate] = useState<number>(1);





const coinGeckoIds: { [key: string]: string } = {
  Bitcoin: 'bitcoin',
  Ethereum: 'ethereum',
  Tether: 'tether',
  Solana: 'solana',
  'Binance Coin': 'binancecoin',
  Cardano: 'cardano',
  XRP: 'ripple',
  Dogecoin: 'dogecoin',
  Litecoin: 'litecoin',
  USDC: 'usd-coin',
  Tron: 'tron',
  Chainlink: 'chainlink',
  'Shiba Inu': 'shiba-inu',
  'Bitcoin Cash': 'bitcoin-cash',
  'Wrapped Coin': 'wrapped-bitcoin',
  Stellar: 'stellar',
  SUI: 'sui',
  Avalanche: 'avalanche-2',
  Ton: 'the-open-network',
};





  const coins = ["Solana", "Bitcoin", "Ethereum", "USDC", "XRP", "Tron", "Chainlink", "Shiba Inu",
    "Bitcoin Cash", "Binance Coin", "Cardano", "Wrapped Coin", "Stellar", "SUI", "Tether",
    "Dogecoin", "Avalanche", "Litecoin", "Ton"];


  
  const networks = ["Ethereum", "BSC", "Polygon", "Tron", "Solana"];


  const networkGasFees: { [key: string]: number } = {
    Ethereum: 0.0035,
    BSC: 0.0003,
    Solana: 0.0005,
    Tron: 0.0002,
    Polygon: 0.0001,
  };


  const fetchSwapRate = async (from: string, to: string) => {
    const fromId = coinGeckoIds[from];
    const toId = coinGeckoIds[to];
  
    if (!fromId || !toId) {
      console.error('Invalid coin selection');
      return;
    }
  
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`
      );
      const data = await res.json();
  
      const fromPrice = data[fromId]?.usd;
      const toPrice = data[toId]?.usd;
  
      if (fromPrice && toPrice) {
        const rate = fromPrice / toPrice;
        setSwapRate(rate);
      }
    } catch (error) {
      console.error('Failed to fetch swap rate:', error);
    }
  };
  




  




  useEffect(() => {
    if (fromCoin && toCoin) {
      fetchSwapRate(fromCoin, toCoin);
    }
  }, [fromCoin, toCoin]);
  
  

  // Update gas fee when network changes
  useEffect(() => {
    setGasFee(networkGasFees[network] || 0);
  }, [network]);

  useEffect(() => {
    if (fromAmount) {
      fetchSwapPrice(fromAmount, fromCoin, toCoin);
    }
  }, [fromCoin, toCoin]);

  
  useEffect(() => {
    if (toAmount) {
      fetchSwapPriceReverse(toAmount, toCoin, fromCoin);
    }
  }, [fromCoin, toCoin]);


  useEffect(() => {
    // Recalculate fee and total whenever fromAmount or gasFee changes
    const amt = parseFloat(fromAmount) || 0;
    const feeAmount = amt * 0.05;
    setFee(feeAmount);
    setTotal(amt + gasFee + feeAmount);
  }, [fromAmount, gasFee]);
  
  

  // Fetch and convert from -> to
  const handleFromAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    setFee(parseFloat(value) * 0.05);


    if (value) {
      await fetchSwapPrice(value, fromCoin, toCoin);
    } else {
      setToAmount("");
    }
  };

  // Fetch and convert to -> from
  const handleToAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);

    if (value) {
      await fetchSwapPriceReverse(value, toCoin, fromCoin);
    } else {
      setFromAmount("");
    }
  };

  // Live price fetch
  const fetchSwapPrice = async (amount: string, from: string, to: string) => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from.toLowerCase().replace(/ /g, "-")},${to.toLowerCase().replace(/ /g, "-")}&vs_currencies=usd`);
      const data = await res.json();

      const fromPrice = data[from.toLowerCase().replace(/ /g, "-")]?.usd || 0;
      const toPrice = data[to.toLowerCase().replace(/ /g, "-")]?.usd || 0;

      if (fromPrice && toPrice) {
        const result = ((parseFloat(amount) * fromPrice) / toPrice).toFixed(6);
        setToAmount(result);
      }
    } catch (error) {
      console.error("Price fetch error:", error);
    }
  };

  const fetchSwapPriceReverse = async (amount: string, to: string, from: string) => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from.toLowerCase().replace(/ /g, "-")},${to.toLowerCase().replace(/ /g, "-")}&vs_currencies=usd`);
      const data = await res.json();

      const fromPrice = data[from.toLowerCase().replace(/ /g, "-")]?.usd || 0;
      const toPrice = data[to.toLowerCase().replace(/ /g, "-")]?.usd || 0;

      if (fromPrice && toPrice) {
        const result = ((parseFloat(amount) * toPrice) / fromPrice).toFixed(6);
        setFromAmount(result);
      }
    } catch (error) {
      console.error("Reverse price fetch error:", error);
    }
  };


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      const fee = parseFloat(value) * 0.05;
      setBill(fee.toFixed(2));
      calculateTotal(value, gasFee);
    } else {
      setBill("");
      setTotal(0);
    }
  };
  

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return;
    }
  
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      setAccount(accounts[0]);
    } catch (error: any) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  };

  /*const getTokenSwapContract = async () => {
    if (!window.ethereum) throw new Error("No wallet detected");
  
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contractAddress = deployedAddresses.contractAddress;
  
    return new Contract(contractAddress, TokenSwapArtifact.abi, signer);
  };*/
  

  /*const handleSwap = async () => {
    if (!walletAddress) {
      alert("Connect your wallet first.");
      return;
    }
  
    if (!fromAmount || isNaN(Number(fromAmount))) {
      alert("Enter a valid swap amount.");
      return;
    }
  
    if (!total || total <= 0) {
      alert("Enter a valid total amount.");
      return;
    }
  
    /*const contract = await getTokenSwapContract();
  
    try {
      const amountInEther = parseEther(total.toString());
  
      const tx = await contract.swapTokens(
        fromCoin,              // from token
        toCoin,                // to token
        amountInEther,         // total amount of fromToken to withdraw (includes gas + fee)
        walletAddress,         // user's receiving address for toToken
        { value: amountInEther } // if swapping ETH-based token
      );
  
      await tx.wait();
      alert("Swap successful!");
    } catch (error: any) {
      console.error("Swap failed:", error);
      alert("Swap failed: " + (error?.message || "unknown error"));
    }
  };*/
  
  
  
  
  

  const fetchGasFee = async (network: string) => {
    try {
      const fees: { [key: string]: number } = {
        Ethereum: 0.0035,
        BSC: 0.0003,
        Polygon: 0.0001,
        Tron: 0.0002,
        Solana: 0.0005,
      };
      const fee = fees[network];
      setGasFee(fee);
      calculateTotal(amount, fee);
    } catch (error) {
      console.error("Failed to fetch gas fee:", error);
    }
  };
  
  
  const calculateTotal = (amountValue: string, gas: number) => {
    const amt = parseFloat(amountValue) || 0;
    const fee = amt * 0.05;
    setTotal(amt + gas + fee);  // keep it as a number here
  };

  const handleWalletConnect = async () => {
    if (walletAddress) {
      // Disconnect: reset wallet address
      setWalletAddress(null);
      return;
    }
  
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };


  
  
  





  

  
  
  

  return (
    <div className="flex justify-center items-center w-full mt-[-60]">
      <div
        className="flex flex-col p-4"
        style={{
          width: "350px",
          height: "",
          backgroundColor: "#7CA5BE",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        

        <button
  onClick={() => {
    const currentIndex = networks.indexOf(network);
    const nextIndex = (currentIndex + 1) % networks.length;
    const nextNetwork = networks[nextIndex];
    setNetwork(nextNetwork);
    fetchGasFee(nextNetwork); // Use your existing fetchGasFee function to dynamically fetch & set the gas fee
  }}
  className="text-white font-semibold mb-4"
  style={{
    width: "150px",
    height: "37px",
    backgroundColor: "#334C5C",
    borderRadius: "6px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
  }}
>
  {network}
</button>



        
        {/* Form Inputs */}
        <form className="flex flex-col space-y-8 mt-5">
          
{/* From */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">From:</label>
  <div className="flex space-x-2">
    <select value={fromCoin} onChange={(e) => setFromCoin(e.target.value)}
      className="text-black px-2"
      style={{
        width: "80px",
        height: "41px",
        backgroundColor: "#D9D9D9",
        borderRadius: "6px",
      }}
    >
      {coins.map((coin) => (
            <option key={coin} value={coin}>{coin}</option>
          ))}
    </select>
    <input type="number" value={fromAmount} onChange={handleFromAmountChange}
      className="px-2"
      style={{
        width: "120px",
        height: "41px",
        backgroundColor: "#D9D9D9",
        borderRadius: "6px",
        color: "#000000",
      }}
    />
  </div>
</div>

{/* To */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">To:</label>
  <div className="flex space-x-2">
    <select value={toCoin} onChange={(e) => setToCoin(e.target.value)}
      className="text-black px-2"
      style={{
        width: "80px",
        height: "41px",
        backgroundColor: "#D9D9D9",
        borderRadius: "6px",
      }}
    >
      {coins.map((coin) => (
            <option key={coin} value={coin}>{coin}</option>
          ))}
    </select>
    <input type="number" value={toAmount} onChange={handleToAmountChange}
      className="px-2"
      style={{
        width: "120px",
        height: "41px",
        backgroundColor: "#D9D9D9",
        borderRadius: "6px",
        color: "#000000",
      }}
    />
  </div>
</div>




         {/* Gas Fee */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">Gas Fee:</label>
  <input type="text" value={gasFee} readOnly
    className="px-2"
    style={{
      width: "207px",
      height: "41px",
      backgroundColor: "#D9D9D9",
      borderRadius: "6px",
      color: "#000000",
    }}
  />
</div>

{/* Fee */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">Fee (5%):</label>
  <input
    type="text"
    value={fee.toFixed(5)}
    readOnly
    className="px-2"
    style={{
      width: "207px",
      height: "41px",
      backgroundColor: "#D9D9D9",
      borderRadius: "6px",
      color: "#000000",
    }}
  />
</div>

{/* Total */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">Total:</label>
  <input
    type="text"
    value={total.toFixed(5)}
    readOnly
    className="px-2"
    style={{
      width: "207px",
      height: "41px",
      backgroundColor: "#D9D9D9",
      borderRadius: "6px",
      color: "#000000",
    }}
  />
</div>


        </form>

        {/* Buttons in a row */}
        <div className="flex space-x-7 justify-center mt-7">
        {/* Connect Wallet Button */}    
        <button
        onClick={handleWalletConnect}
        title={walletAddress ? "Disconnect / Switch Wallet" : "Connect Wallet"}
        className="text-white font-semibold"
        style={{
          width: "140px",
          height: "37px",
          backgroundColor: "#334C5C",
          borderRadius: "6px",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
        }}
      >
        {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connect"}
      </button>




        
        {/* Pay Button */}
        <button
  className="text-white font-semibold"
  style={{
    width: "140px",
    height: "37px",
    backgroundColor: "#334C5C",
    borderRadius: "6px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
  }}
>
  Swap
</button>

        </div>
      </div>
    </div>
  );
}
