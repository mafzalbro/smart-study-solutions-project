import React, { useState } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

function UserList({ users, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(null);

  const toggleDropdown = (userId) => {
    if (isOpen === userId) {
      setIsOpen(null);
    } else {
      setIsOpen(userId);
    }
  };

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-item">
          <img
            src={`/user/${user.imageName}`}
            alt={user.name}
            className="user-image"
          />
          <div className="user-details">
            <span>{user.name}</span>
            <small>{user.email}</small>
          </div>
          <div className="action-menu relative">
            <button
              className="menu-button absolute top-0 right-2"
              onClick={() => toggleDropdown(user.id)}
            >
              <FaEllipsisV fontSize={14} className='dark:text-primary'/>
            </button>
            {isOpen === user.id && (
              <div className="dropdown-menu absolute top-6 right-0">
                <button
                  className="dropdown-item"
                  onClick={() => onEdit(user.id)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => onDelete(user.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
