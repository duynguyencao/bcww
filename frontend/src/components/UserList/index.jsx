import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of project #5
 */
const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel("/api/user/list",{
      credentials: "include",
    }).then(data => setUsers(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {users.map((user) => (
        
        <div key={user._id}>
          <button onClick={() => navigate(`/users/${user._id}`)}>
            {user.first_name} {user.last_name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
