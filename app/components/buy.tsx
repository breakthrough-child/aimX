'use client'
import React, { useState, useEffect } from "react";
import HorizontalLine from "./hline"; // adjust path if needed

export default function BuySection() {
  const [selectedCoin, setSelectedCoin] = useState("Coin");
  const [timeLeft, setTimeLeft] = useState(600); // 1800 seconds = 30 minutes
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState("");
  const [address, setAddress] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState
  (false);
  const [paymentRef, setPaymentRef] = useState("");
  const [pricePerCoin, setPricePerCoin] = useState<number | null>(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [coinPrice, setCoinPrice] = useState<number | null>(null);

  



  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      const fee = parseFloat(value) * 0.02;
      setBill(fee.toFixed(2));
    } else {
      setBill("");
    }
  };
  
  useEffect(() => {
    if (amount && coinPrice) {
      const total = parseFloat(amount) * coinPrice;
      setBill(total.toFixed(2));
    } else {
      setBill("");
    }
  }, [amount, coinPrice]);
  

  useEffect(() => {
    const fetchCoinPrice = async () => {
      if (selectedCoin === "Coin") return;
  
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin.toLowerCase()}&vs_currencies=ngn`);
      const data = await res.json();
      setCoinPrice(data[selectedCoin.toLowerCase()].ngn);
    };
  
    fetchCoinPrice();
  }, [selectedCoin]);
  

  // Fetch price when coin changes
useEffect(() => {
  const fetchPrice = async () => {
    if (selectedCoin !== "Coin") {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin.toLowerCase()}&vs_currencies=ngn`
      );
      const data = await res.json();
      const price = data[selectedCoin.toLowerCase()].ngn;
      setPricePerCoin(price);
    }
  };
  fetchPrice();
}, [selectedCoin]);



// Handle bill (editable naira value)
const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setBill(value);
  if (pricePerCoin && value) {
    const amount = parseFloat(value) / pricePerCoin;
    setCoinAmount(amount.toFixed(8)); // 8 decimal places for crypto
  } else {
    setCoinAmount("");
  }
};


  useEffect(() => {
    let timer: NodeJS.Timeout;
  
    if (showPaymentDetails && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
  
    return () => clearInterval(timer);
  }, [showPaymentDetails, timeLeft]);

  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs < 10 ? `0${secs}` : secs}s`;
  };
  

  const handlePayClick = async () => {
    if (selectedCoin === "Coin" || !bill || !address) {
      alert("Please fill all fields before proceeding.");
      return;
    }
  
    const uniqueRef = "BUY-" + Math.floor(Math.random() * 1000000000);
    setPaymentRef(uniqueRef);
  
    const order = {
      coin: selectedCoin,
      coinPrice,
      amount: coinAmount, // calculated amount based on bill and price
      bill,
      address,
      reference: uniqueRef,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
  
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
  
      const data = await res.json();
      console.log("Order sent to API:", data);
  
      setShowPaymentDetails(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  
  
  
  
  

  return (
    <div className="flex justify-center items-center w-full">
      <div
        className="flex flex-col p-4"
        style={{
          width: "350px",
          backgroundColor: "#7CA5BE",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Select List */}
        <select
          className="text-white font-medium px-2 mb-4"
          style={{
            width: "72px",
            height: "34px",
            borderRadius: "6px",
            backgroundColor: "#334C5C",
          }}
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
        >
          <option disabled>Coin</option>
        <option value="bitcoin">Bitcoin</option>
        <option value="ethereum">Ethereum</option>
        <option value="litecoin">Litecoin</option>
        <option value="tether">USDT</option>
        <option value="solana">Solana</option>
        <option value="the-open-network">Ton</option>
        <option value="the-open-network">Ton</option>
        <option value="doge">Doge</option>
        <option value="shiba-inu">Shiba</option>
        <option value="ripple">XRP</option>
        <option value="avalanche-2">Avalanch</option>
        <option value="polkadot">Polkadot</option>
        </select>

        {/* Form Inputs */}
        <form className="flex flex-col space-y-5">
          {/* Display coin amount */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">Amount:</label>
  <input
    type="text"
    value={coinAmount}
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

          {/* Bill in NGN */}
<div className="flex items-center space-x-4">
  <label className="text-[18px] font-bold text-white text-sm w-[90px]">Bill (₦):</label>
  <input
    type="number"
    value={bill}
    onChange={handleBillChange}
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
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">Address:</label>
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

        {/* Pay Button */}
        {!showPaymentDetails && (
          <button
            className="text-white font-semibold mt-5"
            style={{
              width: "72px",
              height: "37px",
              backgroundColor: "#334C5C",
              borderRadius: "6px",
              alignSelf: "center",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
            }}
            onClick={handlePayClick}
          >
            Pay
          </button>
        )}

        {/* Horizontal Line */}
        {showPaymentDetails && <HorizontalLine />}

        {/* Payment Details Section */}
        {showPaymentDetails && (
          <div className="flex flex-col space-y-3 mt-5">
            <p className="text-white font-bold text-[16px] text-center">
              Send Bill to the account below:
            </p>
            <p className="text-white font-bold text-[20px] text-center">
              Bank: Access Bank
            </p>
            <p className="text-white font-bold text-[20px] text-center">
              Details: 1508279030 - Chukwu Divine Chiemerie
            </p>
            <p className="text-red-500 font-bold text-[16px] text-center">
            Put this in your reference: {paymentRef}
            </p>

            <p className="text-red-500 font-bold text-[20px] text-center">
              Time Left: {formatTime(timeLeft)}
            </p>
            <p className="text-red-500 font-bold text-[20px] text-center">
              Please do not leave this page
            </p>
            <button
              className="text-white font-semibold mt-3"
              style={{
                width: "120px",
                height: "40px",
                backgroundColor: "#334C5C",
                borderRadius: "6px",
                alignSelf: "center",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
              }}
            >
              I have paid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
