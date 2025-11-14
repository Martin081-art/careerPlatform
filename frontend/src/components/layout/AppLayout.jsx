import React from "react";
import { Link } from "react-router-dom";
import "../styles/theme.css";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      
       

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
            
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;