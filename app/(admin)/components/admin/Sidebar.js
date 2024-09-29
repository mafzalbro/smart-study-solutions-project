
import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-heading">Dashboard</h2>

      <div className="menu-item" onClick={toggleUserDropdown}>
        <i className="fas fa-user"></i>
        <span>User</span>
        <i className={`fas fa-chevron-${isUserDropdownOpen ? 'up' : 'down'}`}></i>
      </div>

      {isUserDropdownOpen && (
        <div className="dropdown-content">
          <div className="dropdown-item">
            <i className="fas fa-address-book"></i>
            <span>Contact</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;