import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../components/styles/Panel.css";

const InstituteDashboard = ({ institute }) => {
  const navigate = useNavigate();

  if (!institute) {
    navigate("/institute/login");
    return null;
  }

  const { name } = institute;

  return (
    <div className="panel-container">
      <aside className="sidebar">
        <h2>INSTITUTE PANEL</h2>
        <ul>
          <li><Link to="/institute/faculties">Manage Faculties</Link></li>
          <li><Link to="/institute/courses">Manage Courses</Link></li>
          <li><Link to="/institute/applications">Student Applications</Link></li>
          <li><Link to="/institute/admissions">Publish Admissions</Link></li>
          <li><Link to="/institute/profile">Update Profile</Link></li>
          <li><button onClick={() => navigate("/institute/login")}>Logout</button></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1>Welcome, {name || "Institute"}!</h1>
        <p>Select a menu option on the left to get started.</p>
      </main>
    </div>
  );
};

export default InstituteDashboard;
