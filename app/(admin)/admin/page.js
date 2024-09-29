"use client"

import React, { useState } from 'react';
import '@/app/(admin)/components/admin/Admin.css';
import Sidebar from '@/app/(admin)/components/admin/Sidebar';
import UserList from '@/app/(admin)/components/admin/UserList';

function AdminPage() {
  const [selectedSection, setSelectedSection] = useState('userlist');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@gmail.com', imageName: 'user1.png' },
    { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', imageName: 'user2.png' },
    { id: 3, name: 'Kevin Gorge', email: 'kevin@gmail.com', imageName: 'user3.png' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (userId) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      const newName = prompt('Enter new name:', user.name);
      const newEmail = prompt('Enter new email:', user.email);
      if (newName !== null && newEmail !== null) {
        const updatedUsers = users.map((u) =>
          u.id === userId ? { ...u, name: newName, email: newEmail } : u
        );
        setUsers(updatedUsers);
      }
    }
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  return (
    <div className="dashboard">
      <Sidebar onSelect={setSelectedSection} />
      <div className="content">
        {selectedSection === 'userlist' && (
          <>
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
            </div>
            <UserList
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;