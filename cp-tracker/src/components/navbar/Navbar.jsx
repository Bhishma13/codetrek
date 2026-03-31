import React from 'react';
import { useNavigate } from "react-router-dom";

const Navbar = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-white py-4 px-8 shadow-md z-50">

        {/* Left Section - CP Logo */}
        <div
          className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl cursor-pointer shadow-lg"
          onClick={() => navigate("/")}
        >
          CT
        </div>

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
          {auth ? (
            <>
              <li
                onClick={() => navigate(`/dashboard?handle=${auth.linkedHandle}`)}
                className="text-lg font-bold text-cyan-600 hover:text-cyan-500 transition duration-300 cursor-pointer"
              >
                Dashboard ({auth.linkedHandle})
              </li>
              <li
                onClick={() => { setAuth(null); navigate("/"); }}
                className="text-lg font-bold text-red-500 hover:text-red-400 transition duration-300 cursor-pointer"
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => navigate("/signin")}
                className="text-lg font-bold text-cyan-600 hover:text-cyan-500 transition duration-300 cursor-pointer bg-cyan-100/50 px-4 py-1 rounded-full"
              >
                Sign In
              </li>
              <li
                onClick={() => navigate("/signup")}
                className="text-lg font-bold text-white bg-black hover:bg-gray-800 transition duration-300 cursor-pointer px-4 py-1 rounded-full"
              >
                Sign Up
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="mt-20"></div>
    </div>
  );
};

export default Navbar;
