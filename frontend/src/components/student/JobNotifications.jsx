import React, { useEffect, useState } from "react";
import "../../components/styles/PanelStyles.css";

const JobNotifications = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.uid) {
        console.log("No user UID available yet. Waiting for user data...");
        return;
      }

      setLoading(true);
      console.log("Fetching job notifications for student:", user.uid);

      try {
        const res = await fetch(`https://careerplatform-o67g.onrender.com/students/${user.uid}/job-notifications`);
        const data = await res.json();

        if (data.success) {
          console.log("Opportunities received:", data.jobs);
          setJobs(data.jobs);
        } else {
          console.error("Error fetching job notifications:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="student-panel-container">
      <h2>Job Notifications</h2>

      {loading && <p>Loading opportunities...</p>}
      {!loading && jobs.length === 0 && <p>No opportunities found.</p>}

      <div className="card-grid">
        {jobs.map(job => (
          <div key={job.id} className="card">
            <h3>{job.title}</h3>
            <p>Company ID: {job.companyId || "N/A"}</p>
            <p>Qualifications:</p>
            <ul>
              <li>Academic Performance: {job.qualifications?.academicPerformance || "N/A"}</li>
              <li>Certificates: {job.qualifications?.certificates || "N/A"}</li>
              <li>Work Experience: {job.qualifications?.workExperience || "N/A"}</li>
              <li>Relevance: {job.qualifications?.relevance?.join(", ") || "N/A"}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobNotifications;
