import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#6c63ff", fontFamily: "Syne" }}>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}
