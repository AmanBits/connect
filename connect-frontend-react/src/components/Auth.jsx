import React, { useState } from "react";
import "../assets/css/auth.css";
import api from "../assets/js/api";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const googleAuth = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const githubAuth = () => {
    window.location.href = "http://localhost:8080/oauth2/authorize/github";
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <div className="divider">OR</div>
        <Link to="/signup">Signup</Link>

        <button className="btn-oauth google" onClick={googleAuth}>
          <span className="icon">G</span> Login with Google
        </button>
        <button className="btn-oauth github" onClick={githubAuth}>
          <span className="icon">GH</span> Login with GitHub
        </button>
      </div>
    </div>
  );
}
