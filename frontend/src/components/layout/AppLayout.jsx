import React from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="brand">Career Guidance</Link>
          <nav className="nav" aria-label="Main Navigation">
            <Link className="nav-link" to="/student/login">Student</Link>
            <Link className="nav-link" to="/institute/login">Institute</Link>
            <Link className="nav-link" to="/admin/login">Admin</Link>

            {/* REMOVED: Jobs and Courses */}
            {/* <Link className="nav-link" to="/jobs">Jobs</Link> */}
            {/* <Link className="nav-link" to="/courses">Courses</Link> */}

            {/* ADDED: Company */}
            <Link className="nav-link" to="/company/login">Company</Link> {/* was /dashboard/company */}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">{children}</div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>Career Guidance</strong>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="footer-right" aria-label="Footer">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;