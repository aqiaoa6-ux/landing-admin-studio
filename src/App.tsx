import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminPage } from "./pages/AdminPage";
import { LandingPage } from "./pages/LandingPage";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<AdminLoginPage />} path="/admin/login" />
      <Route element={<AdminPage />} path="/admin" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
