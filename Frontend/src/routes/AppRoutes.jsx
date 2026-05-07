import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageEtats from "../pages/admin/ManageEtats";
import ManageDomaines from "../pages/admin/ManageDomaines";
import ManageBanques from "../pages/admin/ManageBanque";
import ManageTraces from "../pages/admin/ManageTraces"; // 🔥 AJOUT

import UserDashboard from "../pages/user/UserDashboard";
import UserDocuments from "../pages/user/UserDocuments";

import Layout from "../components/layout/Layout";
import ManageDocuments from "../pages/admin/ManageDocuments"; // 🔥 AJOUT

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
              path="/etats"
              element={
                <Layout>
                  <ManageEtats />
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

           

            <Route
              path="/documents-list"
              element={
                <Layout>
                  <ManageDocuments />
                </Layout>
              }
            />

            {/* 📊 TRACABILITE */}
            <Route
              path="/traces"
              element={
                <Layout>
                  <ManageTraces /> {/* 🔥 CORRECTION */}
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

            <Route
              path="/my-documents"
              element={
                <Layout>
                  <UserDocuments />
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