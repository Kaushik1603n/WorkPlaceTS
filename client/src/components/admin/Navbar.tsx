import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white px-4 py-4 flex items-center justify-between relative shadow-lg border-b border-gray-100">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">WorkPlace</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">👤</span>
        </div>

        <button
          className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-5 md:hidden z-50 shadow-lg border-t border-gray-100">
          <div className="flex flex-col space-y-4">
          </div>
        </div>
      )}
    </nav>
  );
}
