import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="w-full bg-[#334C5C] text-[#FFFFFF] flex flex-col items-center justify-center" style={{ height: "107px" }}>
      {/* Project Title */}
      <p className="font-bold text-[20px] font-[Inter] text-center">
        An Africa In Mind Project
      </p>

      <div className="w-full flex items-center justify-between px-6 mt-2">
        {/* Copyright */}
        <p className="font-bold text-[14px] text-left">
          © Copyright ODG
        </p>

        {/* Social Icons */}
        <div className="flex items-center justify-between" style={{ width: "100px", height: "17px" }}>
          <a href="#" aria-label="Facebook">
            <Facebook size={17} />
          </a>
          <a href="#" aria-label="Twitter">
            <Twitter size={17} />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram size={17} />
          </a>
          <a href="#" aria-label="Telegram">
          <FaTelegramPlane size={17} />
          </a>

          
        </div>
      </div>
    </footer>
  );
}
