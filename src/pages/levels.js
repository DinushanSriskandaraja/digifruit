import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/levels.css";

function Levels() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    navigate(`/game?level=${selectedLevel}`); // Navigate to /game with level parameter
  };

  return (
    <div className="levels-container">
      <h1 className="title">Choose Your Level</h1>
      <p className="subtitle">Select a level to start playing!</p>
      <div className="level-buttons">
        <button className="level-button" onClick={() => handleLevelSelect(1)}>
          Beginers
        </button>
        <button className="level-button" onClick={() => handleLevelSelect(2)}>
          Intermediate
        </button>
        <button className="level-button" onClick={() => handleLevelSelect(3)}>
          Advanced
        </button>
      </div>
    </div>
  );
}

export default Levels;
