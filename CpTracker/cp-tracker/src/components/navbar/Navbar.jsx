import React from 'react';
import cpLogo from '../../assets/cpLogo1.jpg';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-white py-4 px-8 shadow-md z-50">

        {/* Left Section - CP Logo */}
        <img
          src={cpLogo}
          alt="CP Logo"
          className="h-14 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Center Section - CodeTrek */}
        <h1
          className="text-4xl font-bold text-black font-serif cursor-pointer transition duration-300 hover:text-gray-700"
          onClick={() => navigate("/")}
        >
          CodeTrek
        </h1>

        {/* Right Section - Navigation Links */}
        <ul className="flex items-center space-x-10">
          <li
            onClick={() => navigate("/")}
            className="text-lg text-black hover:text-gray-700 transition duration-300 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => navigate("/about")}
            className="text-lg text-black hover:text-gray-700 transition duration-300 cursor-pointer"
          >
            About us
          </li>
        </ul>
      </div>
      <div className="mt-20"></div>
    </div>
  );
};

export default Navbar;
