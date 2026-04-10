import React from 'react';
import { useNavigate } from "react-router-dom";

const Navbar = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-white py-4 px-8 shadow-md z-50">

        {/* Left Section - Empty or Reserved */}
        <div></div>

        {/* Center Section - CodeTrek */}
        <h1
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 tracking-tight cursor-pointer transition duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          CodeTrek
        </h1>

        {/* Right Section - Navigation Links */}
        <ul className="flex items-center space-x-10">
          <li
            onClick={() => navigate("/")}
            className="text-lg text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 cursor-pointer"
          >
            Home
          </li>
          <li
            onClick={() => navigate("/about")}
            className="text-lg text-gray-700 hover:text-emerald-600 font-semibold transition duration-300 cursor-pointer"
          >
            About us
          </li>
          {auth ? (
            <>
              <li
                onClick={() => navigate(`/dashboard?handle=${auth.linkedHandle}`)}
                className="text-lg font-bold text-emerald-600 hover:text-emerald-700 transition duration-300 cursor-pointer"
              >
                Dashboard ({auth.linkedHandle})
              </li>
              <li
                onClick={() => { setAuth(null); navigate("/"); }}
                className="text-lg font-bold text-red-600 hover:text-red-700 transition duration-300 cursor-pointer"
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => navigate("/signin")}
                className="text-lg font-bold text-emerald-600 hover:text-emerald-700 transition duration-300 cursor-pointer bg-emerald-50 px-5 py-2 rounded-full border border-emerald-200"
              >
                Sign In
              </li>
              <li
                onClick={() => navigate("/signup")}
                className="text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md transition duration-300 cursor-pointer px-5 py-2 rounded-full"
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
