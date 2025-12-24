import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import OAuthSuccess from "./components/OAuthSuccess";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
