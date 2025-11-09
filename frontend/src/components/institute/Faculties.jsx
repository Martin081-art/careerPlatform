import React, { useState, useEffect } from "react";
import "../../components/styles/Panel.css";

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [newFaculty, setNewFaculty] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 🔹 Get the logged-in institute info
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("📌 Logged-in user:", user);

  const institutionId = user?.institutionId;
  console.log("🔹 Using institutionId:", institutionId);

  // Fetch faculties from backend
  const fetchFaculties = async () => {
    if (!institutionId) {
      console.warn("⚠️ No institutionId available. Cannot fetch faculties.");
      return;
    }

    try {
      console.log("🔹 Fetching faculties for institutionId:", institutionId);
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${institutionId}/faculties`
      );
      const data = await res.json();
      console.log("🧾 Fetch faculties response:", data);
      if (data.success) setFaculties(data.faculties);
    } catch (err) {
      console.error("❌ Fetch faculties error:", err);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, [institutionId]);

  // Add new faculty
  const addFaculty = async () => {
    if (!newFaculty) return alert("Enter faculty name");
    try {
      console.log("🔹 Adding new faculty:", newFaculty);
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${institutionId}/faculties`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newFaculty }),
        }
      );
      const data = await res.json();
      console.log("🧾 Add faculty response:", data);
      if (data.success) {
        setNewFaculty("");
        fetchFaculties();
      }
    } catch (err) {
      console.error("❌ Add faculty error:", err);
    }
  };

  // Delete faculty
  const deleteFaculty = async (facultyId) => {
    try {
      console.log("🔹 Deleting facultyId:", facultyId);
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${institutionId}/faculties/${facultyId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      console.log("🧾 Delete faculty response:", data);
      if (data.success) fetchFaculties();
    } catch (err) {
      console.error("❌ Delete faculty error:", err);
    }
  };

  // Start editing
  const startEditing = (faculty) => {
    console.log("🔹 Editing faculty:", faculty);
    setEditingId(faculty.id);
    setEditingName(faculty.name);
  };

  // Save edited faculty
  const saveEdit = async () => {
    if (!editingName) return alert("Faculty name cannot be empty");
    try {
      console.log("🔹 Saving edit for facultyId:", editingId, "new name:", editingName);
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${institutionId}/faculties/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editingName }),
        }
      );
      const data = await res.json();
      console.log("🧾 Save edit response:", data);
      if (data.success) {
        setEditingId(null);
        setEditingName("");
        fetchFaculties();
      }
    } catch (err) {
      console.error("❌ Update faculty error:", err);
    }
  };

  if (!user) {
    return <p>⚠️ No user logged in. Please login to see faculties.</p>;
  }

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
