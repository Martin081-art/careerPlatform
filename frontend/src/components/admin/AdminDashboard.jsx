import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Institutions from "./Institutions";
import Faculties from "./Faculties";
import Courses from "./Courses";
import Companies from "./Companies";
import Reports from "./Reports";

const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin/login" />; // protected route

  return (
    <div>
      <h1>🏛️ Admin Dashboard</h1>
      <nav>
        <Link to="institutions">Institutions</Link> |{" "}
        <Link to="faculties">Faculties</Link> |{" "}
        <Link to="courses">Courses</Link> |{" "}
        <Link to="companies">Companies</Link> |{" "}
        <Link to="reports">Reports</Link>
      </nav>

      <Routes>
        <Route path="institutions" element={<Institutions />} />
        <Route path="faculties" element={<Faculties />} />
        <Route path="courses" element={<Courses />} />
        <Route path="companies" element={<Companies />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
