import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Styles/auth.css';
const defaultUser = {
  email: "user@example.com",
  password: "password123"
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      if (email === defaultUser.email && password === defaultUser.password) {
        navigate("/level");
      } else {
        setError("Invalid credentials");
      }
    } else {
      setError("Signup is not available. Use default credentials or play as guest.");
    }
  };

  const playAsGuest = () => {
    navigate("/level");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <button onClick={playAsGuest} className="auth-guest">
          Play as Guest
        </button>
      </div>
    </div>
  );
  
};

export default Auth;
