import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import OAuthSuccess from "./components/OAuthSuccess";

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
