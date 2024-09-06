import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://unipalmark-backend.hf.space/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (uid) => {
    try {
      await axios.put(`https://unipalmark-backend.hf.space/api/users/suspend/${uid}`);
      fetchUsers();  // Refresh the user list
    } catch (error) {
      console.error('Error suspending user:', error);
      setError('Failed to suspend user. Please try again.');
    }
  };

  const handleBlock = async (uid) => {
    try {
      await axios.put(`https://unipalmark-backend.hf.space/api/users/block/${uid}`);
      fetchUsers();  // Refresh user list
    } catch (error) {
      console.error('Error blocking user:', error);
      setError('Failed to block user. Please try again.');
    }
  };

  const handleUnblock = async (uid) => {
    try {
      await axios.put(`https://unipalmark-backend.hf.space/api/users/unblock/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      setError('Failed to unblock user. Please try again.');
    }
  };

  const handleUnsuspend = async (uid) => {
    try {
      await axios.put(`https://unipalmark-backend.hf.space/api/users/unsuspend/${uid}`);
      fetchUsers();
    } catch (error) {
      console.error('Error unsuspending user:', error);
      setError('Failed to unsuspend user. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
