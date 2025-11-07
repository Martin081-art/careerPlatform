import React, { useState, useEffect } from "react";
import "../../components/styles/Panel.css";

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 🔹 Get the logged-in institute info
  const institute = JSON.parse(localStorage.getItem("user"));
  const instituteId = institute?.uid || institute?.id; // adjust based on your stored user object

  // Fetch faculties from backend
  const fetchFaculties = async () => {
    try {
      const res = await fetch(`https://careerplatform-o67g.onrender.com/institute/${instituteId}/faculties`);
      const data = await res.json();
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("Fetch faculties error:", err);
    }
  };

  useEffect(() => {
    if (instituteId) fetchFaculties();
  }, [instituteId]);

  // Add new faculty
  const addFaculty = async () => {
    if (!newFaculty) return alert("Enter faculty name");
    try {
      const res = await fetch(`https://careerplatform-o67g.onrender.com/institute/${instituteId}/faculties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFaculty }),
      });
      const data = await res.json();
      if (data.success) {
        fetchFaculties();
        setNewFaculty("");
      }
    } catch (err) {
      console.error("Add faculty error:", err);
    }
  };

  // Delete faculty
  const deleteFaculty = async (facultyId) => {
    try {
      const res = await fetch(`https://careerplatform-o67g.onrender.com/institute/${instituteId}/faculties/${facultyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) fetchFaculties();
    } catch (err) {
      console.error("Delete faculty error:", err);
    }
  };

  // Start editing
  const startEditing = (faculty) => {
    setEditingId(faculty.id);
    setEditingName(faculty.name);
  };

  // Save edited faculty
  const saveEdit = async () => {
    if (!editingName) return alert("Faculty name cannot be empty");
    try {
      const res = await fetch(`https://careerplatform-o67g.onrender.com/institute/${instituteId}/faculties/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditingName("");
        fetchFaculties();
      }
    } catch (err) {
      console.error("Update faculty error:", err);
    }
  };

  return (
    <div className="dashboard-main">
      <h1>Faculties</h1>
      <div className="card-grid">
        {faculties.map((fac) => (
          <div className="card" key={fac.id}>
            {editingId === fac.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{fac.name}</h3>
                <button onClick={() => startEditing(fac)}>Edit</button>
                <button onClick={() => deleteFaculty(fac.id)}>Delete</button>
              </>
            )}
          </div>
        ))}

        <div className="card">
          <input
            type="text"
            value={newFaculty}
            onChange={(e) => setNewFaculty(e.target.value)}
            placeholder="New Faculty Name"
          />
          <button onClick={addFaculty}>Add Faculty</button>
        </div>
      </div>
    </div>
  );
};

export default Faculties;
