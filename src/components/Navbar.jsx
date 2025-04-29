import React, { useState } from "react";

const Navbar = ({ setActivePage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4 fixed w-full z-10 top-0 shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Admin Panel</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button
            onClick={() => setActivePage("upload")}
            className="hover:bg-blue-700 py-2 px-4 rounded"
          >
            Upload Questions
          </button>
          <button
            onClick={() => setActivePage("results")}
            className="hover:bg-blue-700 py-2 px-4 rounded"
          >
            View Results
          </button>
          <button
            onClick={() => setActivePage("disclaimer")}
            className="hover:bg-blue-700 py-2 px-4 rounded"
          >
            Disclaimer Editor
          </button>
          <button
            onClick={() => setActivePage("questions")}
            className="hover:bg-blue-700 py-2 px-4 rounded"
          >
            Manage Questions
          </button>

          {/* ✅ Live Class Button */}
          <button
            onClick={() => setActivePage("live")}
            className="hover:bg-red-700 bg-red-600 py-2 px-4 rounded"
          >
            Live Class
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-xl"
        >
          <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <button
            onClick={() => setActivePage("upload")}
            className="block w-full text-left py-2 px-4 bg-blue-700 rounded"
          >
            Upload Questions
          </button>
          <button
            onClick={() => setActivePage("results")}
            className="block w-full text-left py-2 px-4 bg-blue-700 rounded"
          >
            View Results
          </button>
          <button
            onClick={() => setActivePage("disclaimer")}
            className="block w-full text-left py-2 px-4 bg-blue-700 rounded"
          >
            Disclaimer Editor
          </button>
          <button
            onClick={() => setActivePage("questions")}
            className="block w-full text-left py-2 px-4 bg-blue-700 rounded"
          >
            Manage Questions
          </button>

          {/* ✅ Live Class Button (Mobile) */}
          <button
            onClick={() => setActivePage("live")}
            className="block w-full text-left py-2 px-4 bg-red-600 rounded"
          >
            Live Class
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
