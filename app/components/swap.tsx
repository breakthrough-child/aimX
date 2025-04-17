'use client'
import React, { useState } from "react";
import { ethers } from "ethers";



const truncateAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}



export default function SwapSection() {
  const [selectedCoin, setSelectedCoin] = useState("Coin");
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState("");
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    // Example fee calculation (2%)
    if (value) {
      const fee = parseFloat(value) * 0.02;
      setBill(fee.toFixed(2));
    } else {
      setBill("");
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return;
    }
  
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error: any) {
      if (error.code === -32002) {
        alert("A connection request is already pending in MetaMask. Please check your wallet.");
      } else {
        console.error(error);
        alert("Failed to connect wallet");
      }
    }
  };
  
  

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="flex flex-col p-4"
        style={{
          width: "350px",
          height: "400px",
          backgroundColor: "#7CA5BE",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        
        {/* Form Inputs */}
        <form className="flex flex-col space-y-8 mt-5">
          {/* Amount */}
          <div className="flex items-center space-x-4">
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">From:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

          {/* Bill */}
          <div className="flex items-center space-x-4">
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">To:</label>
            <input
              type="text"
              value={bill}
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

          {/* Amount */}
          <div className="flex items-center space-x-4">
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
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

          {/* Address */}
          <div className="flex items-center space-x-4">
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">Fee:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
  onClick={connectWallet}
  title={account ? "Reconnect / Switch Wallet" : "Connect Wallet"}
  className="text-white font-semibold"
  style={{
    width: "140px",
    height: "37px",
    backgroundColor: "#334C5C",
    borderRadius: "6px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
  }}
>
  {account ? truncateAddress(account) : "Connect"}
</button>



        
        {/* Pay Button */}
        <button
            className="text-white font-semibold"
            style={{
            width: "72px",
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
