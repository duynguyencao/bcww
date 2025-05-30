import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import TopBar from "../TopBar";

/**
 * Define UserDetail, a React component of Project 4.
 */
const UserDetail = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModel(`/api/user/${userId}`).then(setUser);
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{user.first_name} {user.last_name}</h2>
      <p><strong>Location:</strong> {user.location || "Not specified"}</p>
      <p><strong>Occupation:</strong> {user.occupation || "Not specified"}</p>
      <p><strong>Description:</strong> {user.description || "No description"}</p>
      <button onClick={() => navigate(`/photos/${userId}`)}>
        View Photos
      </button>
    </div>
  );
};

export default UserDetail;
