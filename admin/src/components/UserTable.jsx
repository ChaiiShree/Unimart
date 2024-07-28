import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSuspend = async (uid) => {
    try {
      await axios.put(`http://localhost:5000/api/user/suspend/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleBlock = async (uid) => {
    try {
      await axios.put(`http://localhost:5000/api/user/block/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblock = async (uid) => {
    try {
      await axios.put(`http://localhost:5000/api/user/unblock/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleUnsuspend = async (uid) => {
    try {
      await axios.put(`http://localhost:5000/api/user/unsuspend/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error unsuspending user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Suspended Until</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.name}</td>
              <td>{user.rollNumber}</td>
              <td>{user.suspendedUntil ? new Date(user.suspendedUntil).toLocaleString() : 'N/A'}</td>
              <td>{user.isBlocked ? 'Yes' : 'No'}</td>
              <td>
                {user.suspendedUntil ? (
                  <button onClick={() => handleUnsuspend(user.uid)}>Unsuspend</button>
                ) : (
                  <button onClick={() => handleSuspend(user.uid)}>Suspend</button>
                )}
                {user.isBlocked ? (
                  <button onClick={() => handleUnblock(user.uid)}>Unblock</button>
                ) : (
                  <button onClick={() => handleBlock(user.uid)}>Block</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
