import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showRoles, setShowRoles] = useState(false);

  const roles = [
    { title: "Admin", path: "/admin/login" },
    { title: "Student", path: "/student/login" },
    { title: "Institute", path: "/institute/login" },
    { title: "Company", path: "/company/login" },
  ];

  return (
    <div>
      {/* --- Nav Bar with Marquee --- */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px 0",
          backgroundColor: "#0c0c0cff",
          color: "#fff",
        }}
      >
        <marquee style={{ fontSize: "24px", fontWeight: "bold" }}>
          Career Guidance Portal
        </marquee>
      </nav>

      {/* --- Landing Content --- */}
      <div
        className="landing-container"
        style={{
          textAlign: "center",
          marginTop: "100px",
          padding: "0 20px",
        }}
      >
        <p className="landing-subtitle">Click the button below to select your role</p>

        <button
          onClick={() => setShowRoles((prev) => !prev)}
          style={{
            backgroundColor: "#111213ff",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          {showRoles ? "Hide Roles" : "Show Roles"}
        </button>

        {showRoles && (
          <div
            className="role-grid"
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
            }}
          >
            {roles.map((role) => (
              <div
                key={role.title}
                className="role-card"
                onClick={() => navigate(role.path)}
                style={{
                  padding: "20px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3>{role.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
