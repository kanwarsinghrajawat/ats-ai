import React from "react";
import Image from "next/image";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";

interface HeaderProps {
  toggleOpen: () => void;
  open: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleOpen, open }) => {
  return (
    <header className="mb-6 border-b pt-2 p-4 w-full border-gray-600">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleOpen}
          aria-label={open ? "Close panel" : "Open panel"}
          className="p-2"
        >
          {open ? (
            <LuPanelRightClose size={30} />
          ) : (
            <LuPanelRightOpen size={30} />
          )}
        </button>
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Image
            src="/file.svg"
            width={20}
            height={20}
            alt="ATS-Lite Logo"
            className="h-6 w-6"
          />
        </div>
        <h1 className="text-2xl font-bold">ATS-Lite</h1>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Natural language candidate search powered by AI
      </p>
    </header>
  );
};

export default Header;
