import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageEtats from "../pages/admin/ManageEtats";
import ManageDomaines from "../pages/admin/ManageDomaines";
import ManageBanques from "../pages/admin/ManageBanque";
import ManageTraces from "../pages/admin/ManageTraces";
import ManageDocuments from "../pages/admin/ManageDocuments";
import ChangePassword from "../pages/user/ChangePassword";
import UserDashboard from "../pages/user/UserDashboard";
import UserDocuments from "../pages/user/UserDocuments";

import Layout from "../components/layout/Layout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {

  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>

      <Routes>

        {/* 🔐 LOGIN */}
        <Route
          path="/"
          element={
            !user
              ? <Login />
              : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/login"
          element={
            !user
              ? <Login />
              : <Navigate to="/dashboard" replace />
          }
        />
        <Route
  path="/change-password"
  element={

    <ProtectedRoute>

      <ChangePassword />

    </ProtectedRoute>
  }
/>
        {/* 👑 ADMIN */}

        <Route
          path="/dashboard"
          element={

            <ProtectedRoute>

              <Layout>

                {user?.role === "ADMIN"
                  ? <AdminDashboard />
                  : <UserDashboard />}

              </Layout>

            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={

            <AdminRoute>

              <Layout>
                <ManageUsers />
              </Layout>

            </AdminRoute>
          }
        />

        <Route
          path="/etats"
          element={

            <AdminRoute>

              <Layout>
                <ManageEtats />
              </Layout>

            </AdminRoute>
          }
        />

        <Route
          path="/banques"
          element={

            <AdminRoute>

              <Layout>
                <ManageBanques />
              </Layout>

            </AdminRoute>
          }
        />

        <Route
          path="/domaines"
          element={

            <AdminRoute>

              <Layout>
                <ManageDomaines />
              </Layout>

            </AdminRoute>
          }
        />

        <Route
          path="/documents-list"
          element={

            <AdminRoute>

              <Layout>
                <ManageDocuments />
              </Layout>

            </AdminRoute>
          }
        />

        <Route
          path="/traces"
          element={

            <AdminRoute>

              <Layout>
                <ManageTraces />
              </Layout>

            </AdminRoute>
          }
        />

        {/* 👤 USER */}

        <Route
          path="/my-documents"
          element={

            <ProtectedRoute>

              <Layout>
                <UserDocuments />
              </Layout>

            </ProtectedRoute>
          }
        />

        {/* 🚫 FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}