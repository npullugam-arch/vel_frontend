import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const response = await authApi.login(form);

      // Backend wrapper:
      // { success, message, data: { token, id, name, email, role } }
      const data = response?.data || response;

      if (!data?.token) {
        throw new Error(response?.message || "Token not received from server");
      }

      login({
        token: data.token,
        userId: data.id || data.userId || "",
        name: data.name || "",
        email: data.email || form.email.trim().toLowerCase(),
        role: data.role || "",
      });

      navigate(from, { replace: true });
    } catch (error) {
      setErrorText(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="eyebrow">Veltrixix Admin</p>
        <h1>Secure Login</h1>
        <p className="muted-text">
          Login to manage internships, events, projects, and approvals.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {errorText ? <p className="error-text">{errorText}</p> : null}
        </form>
      </div>
    </div>
  );
}