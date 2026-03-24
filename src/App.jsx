import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import InternshipsPage from "./pages/InternshipsPage";
import EventsPage from "./pages/EventsPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import ContactsPage from "./pages/ContactsPage";
import PaymentsPage from "./pages/PaymentsPage";
import QrConfigsPage from "./pages/QrConfigsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="qr-configs" element={<QrConfigsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}