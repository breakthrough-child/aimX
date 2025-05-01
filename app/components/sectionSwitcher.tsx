import React from "react";
import VerticalLine from "./vline";

interface SectionSwitcherProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function SectionSwitcher({
  activeSection,
  setActiveSection,
}: SectionSwitcherProps) {
  return (
    <div className="w-full flex items-center justify-center space-x-8 bg-[#A6F6FF] mt-[80px]" style={{ height: "45px" }}>
      {["Buy", "Swap", "Swapsend"].map((section, index) => (
        <React.Fragment key={section}>
          <p
            onClick={() => setActiveSection(section)}
            className={`font-bold text-[20px] cursor-pointer ${
              activeSection === section ? "text-[#334C5C] underline" : "text-[#000000]"
            }`}
          >
            {section}
          </p>
          {index < 2 && <VerticalLine />}
        </React.Fragment>
      ))}
    </div>
  );
}
