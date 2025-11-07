import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../components/styles/Dashboard.css";
import bgImage from "../../assets/admin2.jpeg"; // import the image
import { FaUniversity, FaBook, FaClipboardList, FaBuilding, FaUser, FaFileUpload, FaBriefcase, FaSignOutAlt } from "react-icons/fa";

const MainDashboard = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to landing/login page if no user
    }
  }, [user, navigate]);

  if (!user) return null;

  const { role, name } = user;

  return (
    <div className="dashboard-container" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <aside className="sidebar">
        <h2 className="sidebar-title">{role.toUpperCase()} PANEL</h2>
        <ul className="sidebar-nav">
          {role === "admin" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/institutions"><FaUniversity className="icon"/> Manage Institutions</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/faculties"><FaBook className="icon"/> Manage Faculties</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/courses"><FaClipboardList className="icon"/> Manage Courses</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/reports"><FaFileUpload className="icon"/> View Reports</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/companies"><FaBuilding className="icon"/> Manage Companies</Link>
              </li>
            </>
          )}

          {role === "institute" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/institute/faculties"><FaBook className="icon"/> Add Faculty</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/institute/courses"><FaClipboardList className="icon"/> Add Courses</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/institute/applications"><FaFileUpload className="icon"/> Student Applications</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/institute/admissions"><FaUniversity className="icon"/> Publish Admissions</Link></li>
            </>
          )}

          {role === "student" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/student/apply-course"><FaClipboardList className="icon"/> Apply for Course</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/student/upload-document"><FaFileUpload className="icon"/> Upload Documents</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/student/profile"><FaUser className="icon"/> Profile</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/student/admissions"><FaUniversity className="icon"/> Admissions Results</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/student/jobs"><FaBriefcase className="icon"/> Job Notifications</Link></li>
            </>
          )}

          {role === "company" && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/company/post-job"><FaBriefcase className="icon"/> Post Opportunities</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/company/applications"><FaFileUpload className="icon"/> View Applications</Link></li>
            </>
          )}

          <li className="nav-item">
            <button className="logout-btn" onClick={() => navigate("/")}><FaSignOutAlt className="icon"/> Logout</button>
          </li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {name || "User"}!</h1>
          <div className="user-info">
            <p>Role: <span>{role}</span></p>
            <p>Name: <span>{name}</span></p>
          </div>
        </div>

        <div className="content-cards">
          <div className="content-card">
            <p>Select a menu option on the left to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
