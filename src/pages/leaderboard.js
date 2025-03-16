import React, { useEffect, useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaCrown, FaChartLine } from "react-icons/fa";
import { getUserScore } from "../services/score"; // Adjust path to score.js
import { db } from "../firebase"; // Adjust path to firebase config
import { collection, getDocs } from "firebase/firestore";
import "./Styles/leaderboard.css";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("1"); // Default to Level 1

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get all users from the 'users' collection
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        
        // Map users to player objects with their scores and usernames
        const allPlayers = await Promise.all(
          usersSnapshot.docs.map(async (doc) => {
            const userId = doc.id;
            const userData = doc.data();
            
            // Get score data using getUserScore
            const scoreResult = await getUserScore(userId);
            
            return {
              name: userData.name || "Anonymous",
              mail: userData.email || "",
              score: scoreResult.score || {}, // Contains {Level1: X, Level2: Y, ...}
            };
          })
        );

        // Process players for the leaderboard
        const leaderboardPlayers = allPlayers
          .filter(player => player.score[`Level${selectedLevel}`] !== undefined) // Filter players with scores for selected level
          .map(player => ({
            name: player.name,
            score: player.score[`Level${selectedLevel}`],
            level: selectedLevel
          }))
          .sort((a, b) => b.score - a.score); // Sort by score in descending order

        setPlayers(leaderboardPlayers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setPlayers([]); // Set empty array on error
      }
    };

    fetchLeaderboard();
  }, [selectedLevel]); // Re-fetch when selectedLevel changes

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">
        <FaChartLine className="icon" /> Leaderboard
      </h1>
      <p className="leaderboard-subtitle">Select a level to view top players</p>

      {/* Level Selection Dropdown */}
      <select 
        className="level-select" 
        value={selectedLevel} 
        onChange={(e) => setSelectedLevel(e.target.value)}
      >
        <option value="1">🏆 Level 1</option>
        <option value="2">🥈 Level 2</option>
        <option value="3">🥉 Level 3</option>
        {/* Add more levels as needed */}
      </select>

      {/* Display Leaderboard based on Selected Level */}
      <div className="leaderboard-list">
        {players.length > 0 ? (
          players.map((player, index) => (
            <div key={index} className={`leaderboard-item rank-${index + 1}`}>
              <span className="rank-icon">
                {index === 0 ? <FaCrown /> : index === 1 ? <FaTrophy /> : index === 2 ? <FaMedal /> : <FaStar />}
              </span>
              <span className="player-name">{player.name}</span>
              <span className="player-score">{player.score} pts</span>
            </div>
          ))
        ) : (
          <p className="no-players">No players found in this level</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;