import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/internships", label: "Internships" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/registrations", label: "Registrations" },
  { to: "/admin/contacts", label: "Contacts" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/qr-configs", label: "QR Configs" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-box">
            <h2>Veltrixix</h2>
            <p>Admin Panel</p>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <p>{user?.name || "Admin User"}</p>
          <p className="muted-text">{user?.email || ""}</p>
          <button
            type="button"
            className="btn btn-secondary full-width"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}