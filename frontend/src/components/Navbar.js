import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="navbar">
      <span className="brand">CreditScore</span>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/rankings">Rankings</Link>
        <span style={{ fontSize: "14px", color: "var(--muted)" }}>{user.name}</span>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;
