import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser, FiShield } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📦 Lost & Found
        </Link>
        
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Dashboard</Link>
            <Link to="/add-report" className="navbar-link">Add Report</Link>
            {isAdmin() && (
              <Link to="/admin" className="navbar-link admin-link">
                <FiShield /> Admin Panel
              </Link>
            )}
            
            <div className="navbar-user">
              <FiUser />
              <span>{user?.name}</span>
            </div>
            
            <button onClick={handleLogout} className="navbar-logout">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
