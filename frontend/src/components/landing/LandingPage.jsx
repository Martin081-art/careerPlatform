import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    { title: "Admin", icon: "🧑‍💼", path: "/admin/login" },
    { title: "Student", icon: "🎓", path: "/student/login" },
    { title: "Institute", icon: "🏫", path: "/institute/login" },
    { title: "Company", icon: "🏢", path: "/company/login" },
  ];

  return (
    <div className="landing-container">
      <h1 className="landing-title">Career Guidance Portal</h1>
      <p className="landing-subtitle">Select your role to continue</p>

      <div className="role-grid">
        {roles.map((role) => (
          <div
            key={role.title}
            className="role-card"
            onClick={() => navigate(role.path)}
          >
            <div className="role-icon">{role.icon}</div>
            <h3>{role.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
