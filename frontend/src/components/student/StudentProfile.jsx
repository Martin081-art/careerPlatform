import React, { useState, useEffect } from "react";
import "../styles/studentProfile.css"; // make sure your CSS file path is correct

export default function StudentProfile({ user }) {
  const [student, setStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", qualification: "" });

  useEffect(() => {
    if (!user || !user.uid) return;
    fetch(`http://localhost:5000/students/${user.uid}/profile`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudent(data.student);
          setForm({
            name: data.student.name || "",
            phone: data.student.phone || "",
            qualification: data.student.qualification || "",
          });
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const res = await fetch(`http://localhost:5000/students/${user.uid}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      alert("Profile updated successfully!");
      setEditMode(false);
      setStudent({ ...student, ...form });
    } else {
      alert(data.message);
    }
  };

  if (!student) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {!editMode ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone || "N/A"}</p>
            <p><strong>Qualification:</strong> {student.qualification || "N/A"}</p>
            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
          </div>
        ) : (
          <div className="profile-edit-form">
            <label>
              Name:
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            </label>
            <label>
              Phone:
              <input type="text" name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Qualification:
              <input type="text" name="qualification" value={form.qualification} onChange={handleChange} />
            </label>
            <div className="btn-group">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
