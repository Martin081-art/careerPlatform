import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Applications = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/institute/login");
      return;
    }

    if (!user.institutionId) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://careerplatform-z4jj.onrender.com/institute/${user.institutionId}/applications`
        );
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, navigate]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${user.institutionId}/admissions/${appId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-main">
      <style>
        {`
        .dashboard-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px;
          background: #f7f8fb;
          display: flex;
          flex-direction: column;
          gap: 32px;
          font-family: "Inter", sans-serif;
        }
        .dashboard-main h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        th, td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #fafafa;
          font-weight: 600;
          color: #111827;
        }
        td {
          color: #111827;
        }
        td span {
          display: inline-block;
          color: #6b7280;
        }
        td button {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          font-weight: 500;
          margin-right: 8px;
          transition: all 0.2s ease;
          min-width: 80px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        td button:last-child {
          margin-right: 0;
        }
        td button.approve {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }
        td button.approve:hover {
          background: #1d4ed8;
        }
        td button.reject {
          background: #ef4444;
          color: #fff;
          border-color: #ef4444;
        }
        td button.reject:hover {
          background: #dc2626;
        }
        @media (max-width: 768px) {
          th, td {
            padding: 8px 12px;
          }
          td button {
            padding: 6px 12px;
            font-size: 0.85rem;
            margin-right: 6px;
          }
        }
      `}
      </style>

      <h1>Student Applications</h1>
      {loading && <p>Loading applications...</p>}
      {applications.length === 0 && !loading && <p>No applications found.</p>}
      <table>
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
                {app.status === "pending" ? (
                  <>
                    <button
                      className="approve"
                      onClick={() => updateStatus(app.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(app.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applications;
