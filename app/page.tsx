'use client'
import React, { useState } from "react";
import PageWrapper from "./components/pageWrapper";
import TopNavBar from "./components/topnav";
import Footer from "./components/footright";
import BuySection from "./components/buy"
import SwapSection from "./components/swap"
import SwapsendSection from "./components/swapsend"
import SectionSwitcher from "./components/sectionSwitcher";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState("Buy");

  const renderSection = () => {
    switch (activeSection) {
      case "Buy":
        return <BuySection />;
      case "Swap":
        return <SwapSection />;
      case "Swapsend":
        return <SwapsendSection />;
      default:
        return <BuySection />;
    }
  };

  return (
    <PageWrapper>
      <TopNavBar />
      <SectionSwitcher 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 pt-20 px-4">
        {renderSection()}
      </main>
      <Footer />
    </PageWrapper>
  );
}
