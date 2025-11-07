import React, { useEffect, useState } from "react";
import "../../components/styles/PanelStyles.css";
import { auth } from "../../firebase/config"; // Firebase auth fallback

const ViewJobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive student id regardless of auth provider field name, with Firebase fallback
  const getStudentId = () =>
    user?.uid || user?.id || user?._id || user?.studentId || auth.currentUser?.uid || null;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      // clear previous error
      setError(null);
      try {
        const res = await fetch("https://careerplatform-xu14.onrender.com/students/opportunities"); // backend endpoint

        // Validate HTTP status first
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to fetch jobs (HTTP ${res.status} ${res.statusText}). ${text.slice(0, 200)}`
          );
        }

        // Ensure the response is JSON before parsing
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Expected JSON but received "${contentType}". ${text.slice(0, 200)}`
          );
        }

        const data = await res.json();

        if (data.success) {
          console.log("Jobs received:", data.jobs);
          setJobs(data.jobs);
        } else {
          console.error("Error fetching jobs:", data.message);
          setError(data.message || "Failed to load jobs.");
          setJobs([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("You must be logged in to apply for a job.");
      return;
    }

    try {
      const res = await fetch("https://careerplatform-xu14.onrender.com/students/apply-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, jobId }),
      });

      // Validate HTTP status and response type before parsing
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to apply (HTTP ${res.status} ${res.statusText}). ${text.slice(0, 200)}`
        );
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Expected JSON but received "${contentType}". ${text.slice(0, 200)}`
        );
      }

      const data = await res.json();
      alert(data.message || "Job application submitted!");
    } catch (err) {
      console.error("Apply job error:", err);
      alert(err.message || "Failed to apply. Try again.");
    }
  };

  return (
    <div className="student-panel-container">
      <h2>Available Jobs</h2>

      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p>No jobs available at the moment.</p>}
      {/* Show any error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="card-grid">
        {jobs.map((job) => (
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
            {/* Disable when not logged in */}
            <button
              disabled={!getStudentId()}
              onClick={() => handleApply(job.id)}
            >
              {getStudentId() ? "Apply" : "Login to Apply"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewJobs;
