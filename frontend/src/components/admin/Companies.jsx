import React, { useEffect, useState } from "react";
import "../../components/styles/AdminCompanies.css"; // add modern styles

export default function Companies() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/companies");
    const data = await res.json();
    if (data.success) setCompanies(data.companies);
  };

  const updateStatus = async (id, status) => {
    const res = await fetch(`https://careerplatform-z4jj.onrender.com/admin/companies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) fetchCompanies();
  };

  const deleteCompany = async (id) => {
    const res = await fetch(`https://careerplatform-z4jj.onrender.com/admin/companies/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h3>Manage Companies</h3>
        <p className="muted">Review, approve, suspend, or delete registered companies.</p>
      </header>

      <section className="surface">
        <ul className="company-list">
          {companies.map((c) => (
            <li key={c.id} className="company-item">
              <div className="company-info">
                <strong className="company-name">{c.name}</strong>
                <span className="company-meta">Status: {c.status}</span>
              </div>
              <div className="company-actions">
                <button className="btn primary" onClick={() => updateStatus(c.id, "approved")}>
                  Approve
                </button>
                <button className="btn warn" onClick={() => updateStatus(c.id, "suspended")}>
                  Suspend
                </button>
                <button className="btn danger" onClick={() => deleteCompany(c.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-left">
            <strong>Career Guidance Admin</strong>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <nav className="footer-right" aria-label="Footer">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
