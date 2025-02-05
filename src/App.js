import React from "react";
import { Routes, Route } from "react-router-dom";
import Game from "./pages/game";
import Leaderboard from "./components/leaderboard";
import Auth from "./pages/auth";
import Level from "./pages/levels"; // Ensure this file exists and is correctly named
import Header from "./components/header";
import Profile from "./components/profile";
import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/level" element={<Level />} /> {/* Fixed route name */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
