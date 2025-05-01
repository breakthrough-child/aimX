import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get("network");

  let gasFee = 0;

  try {
    switch (network) {
      case "ethereum": {
        const res = await fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourAPIKey");
        const data = await res.json();
        gasFee = parseFloat(data.result.ProposeGasPrice) * 100; // Convert to naira equivalent if necessary
        break;
      }
      case "binance-smart-chain": {
        const res = await fetch("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=YourAPIKey");
        const data = await res.json();
        gasFee = parseFloat(data.result.ProposeGasPrice) * 40; // Example multiplier
        break;
      }
      case "polygon": {
        const res = await fetch("https://gasstation-mainnet.matic.network");
        const data = await res.json();
        gasFee = data.standard * 5; // Example multiplier
        break;
      }
      case "tron": {
        gasFee = 50; // Tron has free energy but transaction fee is minimal, keep static or implement an API if available
        break;
      }
      default:
        gasFee = 0;
        break;
    }
  } catch (err) {
    console.error("Failed fetching gas fee:", err);
    gasFee = 0;
  }

  return NextResponse.json({ gasFee });
}
