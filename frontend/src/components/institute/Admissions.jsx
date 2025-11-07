import React, { useState, useEffect } from "react";

const Admissions = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.institutionId) return;

    const fetchCoursesWithApplications = async () => {
      setLoading(true);
      try {
        // Fetch all courses for this institute
        const resCourses = await fetch(`https://careerplatform-z4jj.onrender.com/institute/${user.institutionId}/courses`);
        const dataCourses = await resCourses.json();
        if (!resCourses.ok || !dataCourses.success) {
          console.warn("⚠️ Failed to fetch courses:", dataCourses.message);
          setLoading(false);
          return;
        }

        // For each course, fetch its applications
        const coursesWithApplications = await Promise.all(
          dataCourses.courses.map(async (course) => {
            const resApps = await fetch(`https://careerplatform-z4jj.onrender.com/institute/${user.institutionId}/applications`);
            const dataApps = await resApps.json();
            const applications = dataApps.success
              ? dataApps.applications.filter(app => app.courseId === course.id)
              : [];
            return { ...course, applications };
          })
        );

        setCourses(coursesWithApplications);
        console.log("✅ Courses with applications fetched:", coursesWithApplications);
      } catch (error) {
        console.error("❌ Error fetching courses and applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesWithApplications();
  }, [user]);

  const publishApplication = async (applicationId) => {
    try {
      const res = await fetch(
        `https://careerplatform-z4jj.onrender.com/institute/${user.institutionId}/admissions/application/${applicationId}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Application ${applicationId} published successfully`);
        // Refresh applications after publishing
        setCourses(prev =>
          prev.map(course => ({
            ...course,
            applications: course.applications.map(app =>
              app.id === applicationId ? { ...app, status: "published" } : app
            )
          }))
        );
      } else {
        console.warn("⚠️ Failed to publish application:", data.message);
      }
    } catch (error) {
      console.error("❌ Error publishing application:", error);
    }
  };

  return (
    <div className="dashboard-main">
      <h1>Publish Admissions</h1>
      {loading && <p>Loading courses and applications...</p>}
      {courses.length === 0 && !loading && <p>No courses found.</p>}
      <div className="card-grid">
        {courses.map(course => (
          <div className="card" key={course.id}>
            <h3>{course.name}</h3>
            {course.applications.length === 0 && <p>No applications yet.</p>}
            {course.applications.map(app => (
              <div key={app.id} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>{app.studentName}</strong> - Status: <em>{app.status}</em>
                </p>
                {["approved", "rejected"].includes(app.status) && (
                  <button onClick={() => publishApplication(app.id)}>Publish</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admissions;
