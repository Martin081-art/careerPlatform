import React, { useEffect, useState } from "react";
import "../../components/styles/AdminInstitutions.css";

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null); // store ID of institution being edited
  const [editData, setEditData] = useState({ name: "", email: "", address: "" });

  const fetchInstitutions = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/institutions");
      const data = await res.json();
      if (data.success) setInstitutions(data.institutions);
    } catch (err) {
      console.error("Error fetching institutions:", err);
    }
  };

  const addInstitution = async () => {
    try {
      const res = await fetch("https://careerplatform-z4jj.onrender.com/admin/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInstitutions();
        setName(""); setEmail(""); setAddress("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding institution:", err);
    }
  };

  const deleteInstitution = async (id) => {
    try {
      const res = await fetch(`https://careerplatform-z4jj.onrender.com/admin/institutes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchInstitutions();
    } catch (err) {
      console.error("Error deleting institution:", err);
    }
  };

  const startEditing = (inst) => {
    setEditingId(inst.id);
    setEditData({ name: inst.name, email: inst.email, address: inst.address });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ name: "", email: "", address: "" });
  };

  const updateInstitution = async () => {
    try {
      const res = await fetch(`https://careerplatform-z4jj.onrender.com/admin/institutes/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        fetchInstitutions();
        cancelEditing();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating institution:", err);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h3>Manage Institutions</h3>
        <p className="muted">Create, view, edit, and remove registered institutions.</p>
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
              {editingId === inst.id ? (
                <div className="edit-form">
                  <input
                    className="input"
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <input
                    className="input"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                  <input
                    className="input"
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  />
                  <button className="btn primary" onClick={updateInstitution}>Save</button>
                  <button className="btn muted" onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div className="institution-info">
                  <strong className="inst-name">{inst.name}</strong>
                  <span className="inst-meta">{inst.email} — {inst.address}</span>
                  <div className="item-actions">
                    <button className="btn secondary" onClick={() => startEditing(inst)}>Edit</button>
                    <button className="btn danger" onClick={() => deleteInstitution(inst.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
