import React, { useEffect, useState } from "react";
import "../../components/styles/AdminInstitutions.css"; // add modern styles

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const fetchInstitutions = async () => {
    try {
      const res = await fetch("https://careerplatform-o67g.onrender.com/admin/institutions");
      const data = await res.json();
      if (data.success) setInstitutions(data.institutions);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  const addInstitution = async () => {
    try {
      const res = await fetch("https://careerplatform-o67g.onrender.com/admin/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInstitutions();
        setName("");
        setEmail("");
        setAddress("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding institution:", err);
    }
  };

  const deleteInstitution = async (id) => {
    try {
      const res = await fetch(`https://careerplatform-o67g.onrender.com/admin/institutes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchInstitutions();
    } catch (err) {
      console.error("Error deleting institution:", err);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h3>Manage Institutions</h3>
        <p className="muted">Create, view, and remove registered institutions.</p>
      </header>

      <section className="surface">
        <div className="form-grid">
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Institution Name"
          />
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Institution Email"
          />
          <input
            className="input full"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Institution Address"
          />
        </div>
        <div className="actions">
          <button className="btn primary" onClick={addInstitution}>Add Institution</button>
        </div>
      </section>

      <section className="surface">
        <ul className="institutions-list">
          {institutions.map((inst) => (
            <li key={inst.id} className="institution-item">
              <div className="institution-info">
                <strong className="inst-name">{inst.name}</strong>
                <span className="inst-meta">{inst.email} — {inst.address}</span>
              </div>
              <button className="btn danger" onClick={() => deleteInstitution(inst.id)}>Delete</button>
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
