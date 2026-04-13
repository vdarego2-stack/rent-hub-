import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons from lucide-react

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold">MyApp</div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        <li className="hover:text-gray-300 cursor-pointer">Home</li>
        <li className="hover:text-gray-300 cursor-pointer">About</li>
        <li className="hover:text-gray-300 cursor-pointer">Services</li>
        <li className="hover:text-gray-300 cursor-pointer">Contact</li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-blue-600 flex flex-col items-center py-4 space-y-4 md:hidden">
          <li className="hover:text-gray-300 cursor-pointer">Home</li>
          <li className="hover:text-gray-300 cursor-pointer">About</li>
          <li className="hover:text-gray-300 cursor-pointer">Services</li>
          <li className="hover:text-gray-300 cursor-pointer">Contact</li>
        </ul>
      )}
    </nav>
  );
}