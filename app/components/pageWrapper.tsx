import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex flex-col bg-[#A6F6FF] h-screen overflow-hidden transition-colors duration-300">
      {children}
    </div>
  );
}

