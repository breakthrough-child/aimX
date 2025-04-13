"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function TopNavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is correctly rendered on hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 bg-[#7CA5BE] shadow-[0_2px_4px_rgba(0,0,0,0.25),0_4px_8px_rgba(0,0,0,0.25)] z-50" style={{ height: "40px" }}>
  {/* Left spacer */}
  <div className="w-12" />

  {/* Center logo */}
  <div className="text-2xl font-bold text-white text-center flex-1 shadow-[rgba(0,0,0,0.25), rgba(0,0,0,0.25)]">
    aimX
  </div>

      {/* Theme Toggle Button */}
      <div className="w-12 flex justify-end">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle Theme"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-800" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>
    </nav>
  );
}
