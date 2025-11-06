import React, { useEffect, useState } from "react";
import "../../components/styles/AdminFaculties.css"; // add modern styles

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState("");
  const [name, setName] = useState("");

  // Fetch all faculties
  const fetchFaculties = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/faculties");
      const data = await res.json();
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("Error fetching faculties:", err);
    }
  };

  // Fetch all institutions for dropdown
  const fetchInstitutions = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/institutions");
      const data = await res.json();
      if (data.success) setInstitutions(data.institutions);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  // Add new faculty
  const addFaculty = async () => {
    if (!name || !institutionId) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/admin/faculties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, institutionId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchFaculties();
        setName("");
        setInstitutionId("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding faculty:", err);
    }
  };

  // Delete faculty
  const deleteFaculty = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/faculties/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchFaculties();
    } catch (err) {
      console.error("Error deleting faculty:", err);
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchInstitutions();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h3>Manage Faculties</h3>
        <p className="muted">Create, view, and remove faculties associated with institutions.</p>
      </header>

      <section className="surface">
        <div className="form-grid">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Faculty Name"
          />

          {/* Dropdown for institution selection */}
          <select
            className="input"
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
          >
            <option value="">Select Institution</option>
            {institutions.map((inst) => (
              <option key={inst.institution_id} value={inst.institution_id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={addFaculty}>Add Faculty</button>
        </div>
      </section>

      <section className="surface">
        <ul className="faculties-list">
          {faculties.map((fac) => (
            <li key={fac.id} className="faculty-item">
              <div className="faculty-info">
                <strong className="faculty-name">{fac.name}</strong>
                <span className="faculty-meta">Institution: {fac.institutionId}</span>
              </div>
              <button className="btn danger" onClick={() => deleteFaculty(fac.id)}>Delete</button>
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
