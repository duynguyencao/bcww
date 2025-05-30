import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const UserPhotos = ({ user: currentUser }) => {
  // console.log(currentUser);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const [upload, setUpload] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const { userId } = useParams();

  useEffect(() => {
    fetchModel(`/api/photo/photosOfUser/${userId}`).then((data) => {
      setPhotos(Array.isArray(data) ? data : []);
    });
    fetchModel(`/api/user/${userId}`).then(setUser);
  }, [userId]);

  const handleInputChange = (photoId, value) => {
    setComments((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleCommment = async (e, photoId) => {
    e.preventDefault();
    const comment = comments[photoId]?.trim();
    if (!comment) return;
    await fetch(`http://localhost:8081/api/photo/commentsOfPhoto/${photoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment,
        user_id: currentUser._id,
      }),
    });
    fetchModel(`/api/photo/photosOfUser/${userId}`).then(setPhotos);
    setComments((prev) => ({ ...prev, [photoId]: "" }));
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    setUpload(true);
    setUploadError("");
    const formData = new FormData();
    const file = e.target.elements.photo.files[0];
    if (!file) {
      setUploadError("plesase select a file");
      setUpload(false);
    }
    formData.append("photo", file);
    formData.append("user_id", currentUser._id);
    try {
      const res = await fetch("http://localhost:8081/api/photo/photos/new", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error || "Upload failed");
      } else {
        setUploadError("");
        fetchModel(`/api/photo/photosOfUser/${userId}`).then(setPhotos);
        e.target.reset();
      }
    } catch (err) {
      setUploadError("Upload failed");
    }
    setUpload(false);
  };

  if (!user || !photos) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-photos">
      <h2>
        Photos of {user.first_name} {user.last_name}
      </h2>
      {currentUser && currentUser._id === userId && (
        <form
          className="upload-form"
          onSubmit={handleUpload}
          style={{ marginBottom: 20 }}
        >
          <input type="file" name="photo" accept="image/*" />
          <button type="submit" disabled={upload}>
            {upload ? "Uploading..." : "Add Photo"}
          </button>
          {uploadError && <div style={{ color: "red" }}>{uploadError}</div>}
        </form>
      )}
      {Array.isArray(photos) &&
        photos.map((photo) => (
          <div key={photo._id}>
            <img src={`/images/${photo.file_name}`} alt="User photo" />
            <p>Posted: {new Date(photo.date_time).toLocaleString()}</p>

            <div>
              <h3>Comments:</h3>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <div key={comment._id}>
                    <p>
                      {comment.user?.first_name || "Unknown"}{" "}
                      {comment.user?.last_name || ""}: {comment.comment}
                    </p>
                    <p>{new Date(comment.date_time).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No comments</p>
              )}
              <div>
                {currentUser && (
                  <form
                    className="comment-form"
                    onSubmit={(e) => handleCommment(e, photo._id)}
                  >
                    <textarea
                      value={comments[photo._id] || ""}
                      onChange={(e) =>
                        handleInputChange(photo._id, e.target.value)
                      }
                      placeholder="Add a comment..."
                    ></textarea>
                    <button type="submit">Send</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserPhotos;
