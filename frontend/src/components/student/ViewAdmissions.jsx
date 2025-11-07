// ViewAdmissions.jsx
import React, { useEffect, useState } from "react";
import "../../components/styles/PanelStyles.css";

const ViewAdmissions = ({ user }) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmissions = async () => {
      if (!user?.uid) {
        console.log("No user UID available yet.");
        return;
      }

      console.log("Fetching admissions for user:", user);

      try {
        const res = await fetch(`https://careerplatform-z4jj.onrender.com/students/admissions/${user.uid}`);
        const data = await res.json();

        console.log("Admissions API response:", data);

        if (data.success) {
          setAdmissions(data.admissions);
        } else {
          console.error("Error fetching admissions:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [user]);

  if (!user?.uid) return <p>Loading user info...</p>;
  if (loading) return <p>Loading your admissions...</p>;

  return (
    <div className="student-panel-container">
      <h2>My Applications & Results</h2>
      {admissions.length === 0 ? (
        <p>No admissions found yet.</p>
      ) : (
        <div className="card-grid">
          {admissions.map((app) => (
            <div key={app.id} className="card">
              <h3>Course ID: {app.courseId}</h3>
              <p>Institution ID: {app.institutionId}</p>
              <p>Status: {app.status}</p>
              <p>Created At: {new Date(app.createdAt).toLocaleString()}</p>
              {app.admittedAt && <p>Admitted At: {new Date(app.admittedAt).toLocaleString()}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAdmissions;
