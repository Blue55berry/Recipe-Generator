import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 sm:inline-block sm:border-transparent sm:text-gray-500 sm:hover:border-primary sm:hover:text-primary sm:px-1 sm:pt-1 sm:border-b-2"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center" onClick={() => setIsOpen(false)}>
              <FaUtensils className="mr-2" />
              <span>Smart Recipe</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <NavLink to="/">{t('nav_home')}</NavLink>
            <NavLink to="/search">{t('nav_find_recipes')}</NavLink>
            <NavLink to="/categories">{t('nav_categories')}</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard">{t('nav_dashboard')}</NavLink>
                <NavLink to="/collections">{t('nav_my_collections')}</NavLink>
              </>
            )}
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-2 mr-4">
              <button 
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                EN
              </button>
              <button 
                onClick={() => i18n.changeLanguage('ta')}
                className={`px-3 py-1 text-sm font-medium rounded-md ${i18n.language === 'ta' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                TA
              </button>
            </div>
            {user ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/profile">Hello, {user.name}</NavLink>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">Login</NavLink>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/search">Find Recipes</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/collections">My Collections</NavLink>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="px-5">
              <div className="text-base font-medium text-gray-800">{user.name}</div>
              <div className="text-sm font-medium text-gray-500">{user.email}</div>
              <div className="mt-3 space-y-1">
                <NavLink to="/profile">Profile</NavLink>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Logout</button>
              </div>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
