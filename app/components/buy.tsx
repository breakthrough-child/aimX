'use client'
import React, { useState } from "react";
import HorizontalLine from "./hline"; // adjust path if needed

export default function BuySection() {
  const [selectedCoin, setSelectedCoin] = useState("Coin");
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState("");
  const [address, setAddress] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

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

  const handlePayClick = () => {
    setShowPaymentDetails(true);
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
          <option>Bitcoin</option>
          <option>Ethereum</option>
          <option>Litecoin</option>
          <option>USDT</option>
        </select>

        {/* Form Inputs */}
        <form className="flex flex-col space-y-5">
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

          {/* Bill */}
          <div className="flex items-center space-x-4">
            <label className="text-[18px] font-bold text-white text-sm w-[90px]">Bill ($):</label>
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
              Bank: SampleBank
            </p>
            <p className="text-white font-bold text-[20px] text-center">
              Details: 1234567890 - John Doe
            </p>
            <p className="text-white font-bold text-[20px] text-center">
              Time Left: 29mins 59s
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
