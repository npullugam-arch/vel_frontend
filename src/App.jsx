import Footer from "./components/Footer";
import PublicPage from "./pages/PublicPage";
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
      <Route path="/about" element={<Navigate to="/about-us" replace />} />
      <Route path="/terms" element={<Navigate to="/terms-conditions" replace />} />
      <Route path="/refund-policy" element={<Navigate to="/refund-cancellation-policy" replace />} />
      <Route path="/internships" element={<Navigate to="/programs" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about-us" element={<PublicPage page="about-us" />} />
      <Route path="/privacy-policy" element={<PublicPage page="privacy-policy" />} />
      <Route path="/refund-cancellation-policy" element={<PublicPage page="refund-cancellation-policy" />} />
      <Route path="/service-delivery-policy" element={<PublicPage page="service-delivery-policy" />} />
      <Route path="/terms-conditions" element={<PublicPage page="terms-conditions" />} />
      <Route path="/contact" element={<PublicPage page="contact" />} />
      <Route path="/programs" element={<PublicPage page="programs" />} />
      <Route path="/projects" element={<PublicPage page="projects" />} />
      <Route path="/login" element={<><LoginPage /><Footer /></>} />

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