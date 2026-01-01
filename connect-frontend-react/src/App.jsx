// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import OAuthSuccess from "./components/OAuthSuccess";
import ProfileDashboard from "./components/Profile/ProfileDashboard";
import Signup from "./components/Signup";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/signup" element={<Signup/>}/>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileDashboard/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
