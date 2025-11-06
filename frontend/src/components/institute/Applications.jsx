import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Applications = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📌 Applications component mounted");
    console.log("👤 Current user object:", user);

    if (!user) {
      console.warn("⚠️ No user logged in. Redirect to login required.");
      navigate("/institute/login");
      return;
    }

    if (!user.institutionId) {
      console.warn("⚠️ No institutionId provided. Cannot fetch applications.");
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      try {
        console.log(`🔹 Fetching applications for instituteId: ${user.institutionId}`);

        const res = await fetch(
          `http://localhost:5000/institute/${user.institutionId}/applications`
        );

        console.log("🔹 Raw response object:", res);

        if (!res.ok) {
          console.error("❌ Failed to fetch applications. Status:", res.status);
          return;
        }

        const data = await res.json();
        console.log("🧾 Backend response data:", data);

        if (data.success) {
          setApplications(data.applications);
          console.log("✅ Applications loaded successfully");
        } else {
          console.warn("⚠️ Backend returned failure:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  const updateStatus = async (appId, newStatus) => {
    try {
      console.log(`⚡ Updating status for application ${appId} -> ${newStatus}`);
      const res = await fetch(
        `http://localhost:5000/institute/${user.institutionId}/admissions/${appId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      console.log("🧾 Status update response:", data);

      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: newStatus } : app
          )
        );
        console.log(`✅ Application ${appId} status updated to ${newStatus}`);
      } else {
        console.warn("⚠️ Failed to update status:", data.message);
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-main">
      <h1>Student Applications</h1>
      {loading && <p>Loading applications...</p>}
      {applications.length === 0 && !loading && <p>No applications found.</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course Applied</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.studentName}</td>
              <td>{app.courseName}</td>
              <td>{app.status}</td>
              <td>
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(app.id, "approved")}
                      style={{ marginRight: "5px" }}
                    >
                      Approve
                    </button>
                    <button onClick={() => updateStatus(app.id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
                {app.status !== "pending" && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
