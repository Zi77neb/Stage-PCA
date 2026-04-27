import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCodes from "../pages/admin/ManageCodes";
import ManageDomaines from "../pages/admin/ManageDomaines";
import ManageBanques from "../pages/admin/ManageBanque";

import UserDashboard from "../pages/user/UserDashboard";

import Layout from "../components/layout/Layout";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LOGIN */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* 👑 ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />

            <Route
              path="/users"
              element={
                <Layout>
                  <ManageUsers />
                </Layout>
              }
            />

            <Route
              path="/codes"
              element={
                <Layout>
                  <ManageCodes />
                </Layout>
              }
            />
            <Route
  path="/banques"
  element={
    <Layout>
      <ManageBanques />
    </Layout>
  }
/>
            <Route
              path="/domaines"
              element={
                <Layout>
                  <ManageDomaines />
                </Layout>
              }
            />
          </>
        )}

        {/* 👤 USER */}
        {user?.role === "USER" && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <UserDashboard />
                </Layout>
              }
            />
          </>
        )}

        {/* 🚫 fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}