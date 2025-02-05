import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Levels() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);

  const handleLevelSelect = (selectedLevel) => {
    setLevel(selectedLevel);
    navigate(`/game?level=${selectedLevel}`); // Navigate to /game with level parameter
  };

  return (
    <div>
      <h1>Levels</h1>
      <p>Select a level to start playing!</p>
      <div>
        <button onClick={() => handleLevelSelect(1)}>Level 1</button>
        <button onClick={() => handleLevelSelect(2)}>Level 2</button>
        <button onClick={() => handleLevelSelect(3)}>Level 3</button>
      </div>
    </div>
  );
}

export default Levels;
