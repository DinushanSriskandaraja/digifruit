import React, { useState, useEffect } from "react";
import { FaUserCircle, FaStar, FaSignOutAlt } from "react-icons/fa";
import "./Styles/profile.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase"; // Adjust the import path based on your project

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setPlayer({
              name: userDocSnap.data().name || "No Name",
              email: user.email || "No Email",
              highestScore: userDocSnap.data().highestScore || 0,
            });
          } else {
            console.log("User profile not found in Firestore.");
          }
        } else {
          setPlayer(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken"); // Remove token from local storage
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading...</p>;
  }

  if (!player) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile.</p>
        </div>
        <div className="logout-button-container">
          <button className="logout-button" onClick={() => navigate("/")}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <FaUserCircle className="profile-icon" />
        <h2>{player.name}</h2>
        <p>{player.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <FaStar className="stat-icon" />
          <p>Highest Score</p>
          <h3>{player.highestScore}</h3>
        </div>
      </div>

      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
