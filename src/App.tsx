import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HelloWorldPage from "./pages/HelloWorldPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hello-world" element={<HelloWorldPage />} />
      </Routes>
    </BrowserRouter>
  );
}
