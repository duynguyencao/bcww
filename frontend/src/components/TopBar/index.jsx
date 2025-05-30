import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const TopBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <span onClick={() => navigate("/")} className="home-link">
        Home
      </span>
      <h1 className="title">Photo App</h1>
      <div>
        {user ? (
          <>
            <span>Hi {user.first_name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Please Login</span>
        )}
      </div>
    </div>
  );
};

export default TopBar;
