import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-[34px] w-[72px] bg-[#334C5C] text-[#FFFFFF] font-medium rounded flex items-center justify-center"
    >
      {label}
    </button>
  );
}
