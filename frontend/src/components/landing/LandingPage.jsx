import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLinks, setShowLinks] = useState(false);

  const roles = [
    { title: "Admin", path: "/admin/login" },
    { title: "Student", path: "/student/login" },
    { title: "Institute", path: "/institute/login" },
    { title: "Company", path: "/company/login" },
  ];

  return (
    <div className="landing-container">
      <h1 className="landing-title">Career Guidance Portal</h1>
      <p className="landing-subtitle">Select your role to continue</p>

      {!showLinks && (
        <button className="primary-btn" onClick={() => setShowLinks(true)}>
          Sign Up
        </button>
      )}

      {showLinks && (
        <div className="role-grid">
          {roles.map((role) => (
            <div
              key={role.title}
              className="role-card"
              onClick={() => navigate(role.path)}
            >
              <h3>{role.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
