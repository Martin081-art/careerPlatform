import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../components/styles/Dashboard.css";

const MainDashboard = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to landing/login page if no user
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering before redirect

  const { role, name } = user;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">{role.toUpperCase()} PANEL</h2>
        <ul className="sidebar-nav">
          {role === "admin" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/admin/institutions">Manage Institutions</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/faculties">Manage Faculties</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/courses">Manage Courses</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/reports">View Reports</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin/companies">Manage Companies</Link></li>
            </>
          )}

           {role === "institute" && (
  <>
    <li><Link to="/institute/faculties">Add Faculty</Link></li>
    <li><Link to="/institute/courses">Add Courses</Link></li>
    <li><Link to="/institute/applications">Student Applications</Link></li>
    <li><Link to="/institute/admissions">Publish Admissions</Link></li> {/* NEW */}
  </>
)}

          {role === "student" && (
            <>
              <li><Link to="/student/apply-course">Apply for Course</Link></li>
              <li><Link to="/student/upload-document">Upload Documents</Link></li>
              <li><Link to="/student/profile">Profile</Link></li>
              <li><Link to="/student/admissions">Admissions Results</Link></li>
              <li><Link to="/student/jobs">Job Notifications</Link></li>
            </>
          )}
          {role === "company" && (
            <>
              <li><Link to="/company/post-job">Post Opportunities</Link></li>
              <li><Link to="/company/applications">View Applications</Link></li>
            </>
          )}
          <li className="nav-item">
            <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <h1 className="dashboard-title">Welcome, {name || "User"}!</h1>
        <p>Role: <strong>{role}</strong></p>
        <p>Select a menu option on the left to get started.</p>
      </main>
    </div>
  );
};

export default MainDashboard;
