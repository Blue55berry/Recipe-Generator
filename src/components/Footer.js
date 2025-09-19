import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold">Smart Recipe Generator</h2>
            <p className="mt-2 text-sm text-gray-300">
              Discover delicious recipes with ingredients you already have at home.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-gray-300 hover:text-white">Find Recipes</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-300 hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Smart Recipe Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
