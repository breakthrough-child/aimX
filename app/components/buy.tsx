'use client'
import React, { useState, useEffect } from "react";
import HorizontalLine from "./hline";
import { currencyOptions } from '@/app/api/lib/paymentProvider'
import { forwardRef, useImperativeHandle } from "react";
import CustomModal from '@/app/components/alert'; // Import the custom modal




const BuySection = forwardRef<BuySectionHandle>((props, ref) => {
  const [selectedCoin, setSelectedCoin] = useState("Coin");
  const [selectedNetwork, setSelectedNetwork] = useState("Network");
  const [timeLeft, setTimeLeft] = useState(600);
  const [coinAmount, setCoinAmount] = useState("");
  const [bill, setBill] = useState("");
  const [address, setAddress] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [coinPrice, setCoinPrice] = useState<number | null>(null);
  const [charges, setCharges] = useState(0);
  const [gasFee, setGasFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [bankDetails, setBankDetails] = useState<{ bank: string, account: string, name: string } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState('ngn')
  const selected = currencyOptions.find(c => c.code.toLowerCase() === selectedCurrency.toLowerCase())

  const [paymentStatus, setPaymentStatus] = useState<string>("");

  useEffect(() => {
    const fetchCoinPrice = async () => {
      if (selectedCoin === "Coin") return;
  
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin.toLowerCase()}&vs_currencies=${selectedCurrency}`
        );
        const data = await res.json();
  
        const coinData = data[selectedCoin.toLowerCase()];
        if (coinData && coinData[selectedCurrency]) {
          setCoinPrice(coinData[selectedCurrency]);
        } else {
          console.warn(`Price not available for ${selectedCoin} in ${selectedCurrency}`);
          setCoinPrice(null);
        }
      } catch (err) {
        console.error("Failed to fetch coin price:", err);
        setCoinPrice(null);
      }
    };
  
    fetchCoinPrice();
  }, [selectedCoin, selectedCurrency]);

  const generateTempBankDetails = () => ({
    bank: "Access Bank",
    account: "1508279030",
    name: "Divine Chiemerie",
  });

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBill(value);

    if (coinPrice && value) {
      const amount = parseFloat(value) / coinPrice;
      setCoinAmount(amount.toFixed(8));
    } else {
      setCoinAmount("");
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCoinAmount(value);

    if (coinPrice && value) {
      const totalBill = parseFloat(value) * coinPrice;
      setBill(totalBill.toFixed(2));
    } else {
      setBill("");
    }
  };

  useEffect(() => {
    if (bill) {
      const fee = parseFloat(bill) * 0.05;
      setCharges(fee);
      setTotal(parseFloat(bill) + fee + gasFee);
    } else {
      setCharges(0);
      setTotal(0);
    }
  }, [bill, gasFee]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showPaymentDetails && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showPaymentDetails, timeLeft]);

  useEffect(() => {
    const calculateGasFee = async () => {
      if (selectedNetwork === "Network") {
        setGasFee(0);
        return;
      }

      const gasFeesUSD: { [key: string]: number } = {
        ethereum: 0.3,
        "binance-smart-chain": 0.06,
        polygon: 0.02,
        tron: 0.01,
      };

      const feeInUSD = gasFeesUSD[selectedNetwork] || 0;

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=${selectedCurrency.toLowerCase()}`
        );
        const data = await res.json();
        const rate = data.usd[selectedCurrency.toLowerCase()] || 1;

        const convertedFee = feeInUSD * rate;
        setGasFee(parseFloat(convertedFee.toFixed(2)));
      } catch (err) {
        console.error("Failed to fetch currency rate:", err);
        setGasFee(feeInUSD);
      }
    };

    calculateGasFee();
  }, [selectedNetwork, selectedCurrency]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs < 10 ? `0${secs}` : secs}s`;
  };

  const handlePayClick = async () => {
    if (selectedCoin === "Coin" || selectedNetwork === "Network" || !bill || !address) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    const uniqueRef = "BUY-" + Math.floor(Math.random() * 1000000000);
    setPaymentRef(uniqueRef);

    setBankDetails(generateTempBankDetails());

    const order = {
      coin: selectedCoin,
      network: selectedNetwork,
      currency: selectedCurrency,
      coinPrice,
      amount: coinAmount,
      bill,
      charges,
      total,
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

  

  // 1. Reset function
const resetForm = () => {
  setSelectedCoin("Coin");
  setSelectedNetwork("Network");
  setTimeLeft(600);
  setCoinAmount("");
  setBill("");
  setAddress("");
  setShowPaymentDetails(false);
  setPaymentRef("");
  setCoinPrice(null);
  setCharges(0);
  setGasFee(0);
  setTotal(0);
  setBankDetails(null);
  setSelectedCurrency("ngn");
  setPaymentStatus("");
};

useImperativeHandle(ref, () => ({
  resetForm,
}));


const handlePaidClick = () => {
  setPaymentStatus("Waiting for Confirmation");

  setTimeout(() => {
    setPaymentStatus("Payment confirmed, asset delivered");

    // Show custom modal after 30 minutes
    setShowModal(true);

    // Wait for 2 seconds before resetting the form
    setTimeout(() => {
      resetForm();  // Reset the form after 2 seconds
      setShowModal(false); // Close the modal
    }, 2000);  // 2 seconds delay
  }, 5000); // 30 minutes delay before confirming payment
};



  return (
    <div className="flex justify-center items-center w-full mt-[-60]">
      <div
        className="flex flex-col p-4"
        style={{
          width: "350px",
          backgroundColor: "#7CA5BE",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Select Options Row */}
        <div className="flex space-x-2 mb-4">
          <div className="space-y-3">
            <select
              className="text-white font-medium px-2"
              style={{
                flex: 1,
                minWidth: "100px",
                height: "34px",
                borderRadius: "6px",
                backgroundColor: "#334C5C",
                width: "100%",
              }}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="">Currency</option>
              {currencyOptions.map(currency => (
                <option key={currency.code} value={currency.code.toLowerCase()}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          <select
            className="text-white font-medium px-2"
            style={{ flex: 1, minWidth: "100px", height: "34px", borderRadius: "6px", backgroundColor: "#334C5C", width: "100%" }}
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
          >
            <option disabled value="Coin">Coin</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="ethereum">Ethereum</option>
            <option value="litecoin">Litecoin</option>
            <option value="the-open-network">TON</option>
            <option value="tether">Tether</option>
            <option value="solana">Solana</option>
            <option value="tron">Tron</option>
            <option value="binancecoin">Binance Coin</option>
            <option value="cardano">Cardano</option>
            <option value="usd-coin">USDC</option>
            <option value="shiba-inu">Shiba Inu</option>
            <option value="ripple">XRP</option>
            <option value="dogecoin">Dogecoin</option>
            <option value="avalanche-2">Avalanche</option>
            <option value="bitcoin-cash">Bitcoin Cash</option>
            <option value="stellar">Stellar</option>
            <option value="sui">SUI</option>
            <option value="chainlink">Chainlink</option>
            <option value="wrapped-bitcoin">Wrapped Coin</option>
          </select>

          <select
            className="text-white font-medium px-2"
            style={{ flex: 1, minWidth: "100px", height: "34px", borderRadius: "6px", backgroundColor: "#334C5C", width: "100%" }}
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
          >
            <option disabled>Network</option>
            <option value="ethereum">ERC20</option>
            <option value="binance-smart-chain">BEP20</option>
            <option value="polygon">Polygon</option>
            <option value="tron">TRC20</option>
          </select>
        </div>

        <form className="flex flex-col space-y-5">
          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Amount:</label>
            <input
              type="number"
              value={coinAmount}
              onChange={handleAmountChange}
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Gas Fee:</label>
            <input
              type="text"
              value={`${selectedCurrency.toUpperCase()} ${gasFee.toFixed(2)}`}
              readOnly
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Bill ({selectedCurrency.toUpperCase()}):</label>
            <input
              type="number"
              value={bill}
              onChange={handleBillChange}
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Charges:</label>
            <input
              type="text"
              value={`${selectedCurrency.toUpperCase()} ${charges.toFixed(2)}`}
              readOnly
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Total:</label>
            <input
              type="text"
              value={`${selectedCurrency.toUpperCase()} ${total.toFixed(2)}`}
              readOnly
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-white text-sm w-[90px]">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-2"
              style={{ width: "207px", height: "41px", backgroundColor: "#D9D9D9", borderRadius: "6px", color: "#000000" }}
            />
          </div>
        </form>

        {!showPaymentDetails && (
          <button
            className="text-white font-semibold mt-5"
            style={{ width: "72px", height: "37px", backgroundColor: "#334C5C", borderRadius: "6px", alignSelf: "center" }}
            onClick={handlePayClick}
          >
            Pay
          </button>
        )}

        {showPaymentDetails && (
          <>
            <HorizontalLine />
            <div className="text-center text-white mt-2">
              <p>Send {selectedCurrency.toUpperCase()} {total.toFixed(2)} to:</p>
              <p className="text-lg font-bold">{bankDetails?.bank}</p>
              <p className="text-lg font-bold">{bankDetails?.account} - {bankDetails?.name}</p>
              <p className="text-red-500 mt-2">Ref: {paymentRef}</p>
              <p className="text-red-500 mt-2">Time Left: {formatTime(timeLeft)}</p>
              {paymentStatus === "" && (
                <button
                  className="mt-4 text-white p-2 rounded"
                  style={{ width: "", height: "37px", backgroundColor: "#334C5C", borderRadius: "6px", alignSelf: "center" }}
                  onClick={handlePaidClick}
                >
                  I have paid
                </button>
              )}

{showModal && (
        <CustomModal
          message="Payment Confirmed, Asset Delivered"
          onClose={() => setShowModal(false)}
        />
      )}
              {paymentStatus && <p className="mt-4 text-white">{paymentStatus}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
})

export default BuySection;
export type BuySectionHandle = {
  resetForm: () => void;
};

