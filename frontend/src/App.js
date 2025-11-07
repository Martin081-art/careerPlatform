// ✅ File: C:\Users\Martin\Documents\career_guidance\frontend\src\App.js

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";
import MainDashboard from "./components/dashboard/MainDashboard";

// ==================== STUDENT MODULE ====================
import RegisterStudent from "./components/student/RegisterStudent";
import LoginStudent from "./components/student/LoginStudent";
import ApplyCourse from "./components/student/ApplyCourse";
import UploadDocument from "./components/student/UploadDocument";
import StudentApplications from "./components/student/StudentApplications";
import StudentProfile from "./components/student/StudentProfile";
import ViewAdmissions from "./components/student/ViewAdmissions";
import AdmissionsResults from "./components/student/AdmissionsResults";
import JobNotifications from "./components/student/JobNotifications";
import ViewJobs from "./components/student/ViewJobs";

// ==================== INSTITUTE MODULE ====================
import InstituteLogin from "./components/institute/InstituteLogin";
import RegisterInstitute from "./components/institute/RegisterInstitute";
import Faculties from "./components/institute/Faculties";
import Courses from "./components/institute/Courses";
import Applications from "./components/institute/Applications";
import Admissions from "./components/institute/Admissions";
import StudentApplicationsInstitute from "./components/institute/StudentApplications";

// ==================== ADMIN MODULE ====================
import AdminLogin from "./components/admin/LoginAdmin";
import AddAdmin from "./components/admin/AddAdmin";
import Reports from "./components/admin/Reports";
import AdminInstitutions from "./components/admin/Institutions";
import AdminCompanies from "./components/admin/Companies";
import AdminCourses from "./components/admin/Courses";
import AdminFaculties from "./components/admin/Faculties";

// ==================== COMPANY MODULE ====================
import CompanyLogin from "./components/company/CompanyLogin";
import CompanyRegister from "./components/company/CompanyRegister";
import PostJob from "./components/company/PostJob";
import CompanyApplications from "./components/company/Applications";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <Routes>
        {/* ==================== LANDING ==================== */}
        <Route path="/" element={<LandingPage />} />

        {/* ==================== STUDENT ROUTES ==================== */}
        <Route path="/student/register" element={<RegisterStudent />} />
        <Route path="/student/login" element={<LoginStudent setUser={setUser} />} />
        <Route path="/student/apply-course" element={<ApplyCourse user={user} />} />
        <Route path="/student/upload-document" element={<UploadDocument user={user} />} />
       
        <Route path="/student/profile" element={<StudentProfile user={user} />} />
        <Route path="/student/admissions" element={<ViewAdmissions user={user} />} />
        <Route path="/student/admissions-results" element={<AdmissionsResults />} />
        <Route path="/student/applications" element={<StudentApplications user={user} />} />
        <Route path="/student/jobs" element={<ViewJobs />} />
        <Route path="/student/notifications" element={<JobNotifications />} />

        {/* ==================== INSTITUTE ROUTES ==================== */}
        <Route path="/institute/login" element={<InstituteLogin setUser={setUser} />} />
        <Route path="/institute/register" element={<RegisterInstitute setUser={setUser} />} />
        <Route path="/institute/faculties" element={<Faculties />} />
        <Route path="/institute/courses" element={<Courses />} />
        <Route path="/institute/applications" element={<Applications user={user} />} />
        <Route path="/institute/admissions" element={<Admissions user={user} />} />
        <Route path="/institute/student-applications" element={<StudentApplicationsInstitute />} />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
        <Route path="/admin/add" element={<AddAdmin />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/institutions" element={<AdminInstitutions />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/faculties" element={<AdminFaculties />} />

        {/* ==================== COMPANY ROUTES ==================== */}
        <Route path="/company/login" element={<CompanyLogin setUser={setUser} />} />
        <Route path="/company/register" element={<CompanyRegister setUser={setUser} />} />
        <Route path="/company/post-job" element={<PostJob companyId={user?.id} />} />

        <Route path="/company/applications" element={<CompanyApplications />} />
    

        {/* ==================== DASHBOARD BY ROLE ==================== */}
        <Route path="/dashboard/student" element={<MainDashboard user={{ role: "student", name: "Student" }} />} />
        <Route path="/dashboard/institute" element={<MainDashboard user={{ role: "institute", name: "Institute" }} />} />
        <Route path="/dashboard/admin" element={<MainDashboard user={{ role: "admin", name: "Admin" }} />} />
        <Route path="/dashboard/company" element={<MainDashboard user={{ role: "company", name: "Company" }} />} />
      </Routes>
    </div>
  );
}

export default App;
