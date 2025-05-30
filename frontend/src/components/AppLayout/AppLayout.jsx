import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "../TopBar";
import UserList from "../UserList";
import UserDetail from "../UserDetail";
import UserPhotos from "../UserPhotos";
import LoginRegister from "../LoginRegister";
import "./styles.css";

const AppLayout = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <TopBar user={user} onLogout={handleLogout} />
      {!user ? (
        <LoginRegister onLogin={handleLogin} />
      ) : (
        <div className="main">
        <div className="sidebar">
          <UserList />
        </div>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="welcome">
                  <h2>Welcome to Photo App</h2>
                  <p>Select a user from the sidebar to view their details</p>
                </div>
              }
            />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/photos/:userId" element={<UserPhotos user={user}  />} />
          </Routes>
        </div>
      </div>
      )} 
    </div>
  );
};

export default AppLayout;