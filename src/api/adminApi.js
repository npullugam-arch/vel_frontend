export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const API_ORIGIN = new URL(API_BASE_URL).origin;
const STORAGE_KEY = "veltrixix_admin_auth";

function getToken() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return parsed?.token || "";
  } catch (error) {
    console.error("Failed to parse auth token from localStorage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return "";
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text();
}

async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const errorMessage =
      (typeof data === "object" && (data?.message || data?.error)) ||
      (typeof data === "string" && data) ||
      "Request failed";

    throw new Error(errorMessage);
  }

  return data;
}

export const authApi = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload?.email?.trim().toLowerCase() || "",
        password: payload?.password || "",
      }),
    }),
};

export const dashboardApi = {
  summary: () => request("/dashboard/summary"),
};

export const internshipsApi = {
  getAll: () => request("/internships"),
  create: (payload) =>
    request("/internships", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/internships/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/internships/${id}`, {
      method: "DELETE",
    }),
};

export const eventsApi = {
  getAll: () => request("/events"),
  create: (payload) =>
    request("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/events/${id}`, {
      method: "DELETE",
    }),
};

export const projectsApi = {
  getAll: () => request("/projects"),
  create: (payload) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const registrationsApi = {
  getAll: () => request("/registrations"),
  updateSelectionStatus: (id, selectionStatus) =>
    request(`/registrations/${id}/selection-status`, {
      method: "PATCH",
      body: JSON.stringify({ selectionStatus }),
    }),
  remove: (id) =>
    request(`/registrations/${id}`, {
      method: "DELETE",
    }),
};

export const contactsApi = {
  getAll: () => request("/contact-inquiries"),
  updateStatus: (id, status) =>
    request(`/contact-inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id) =>
    request(`/contact-inquiries/${id}`, {
      method: "DELETE",
    }),
};

export const paymentsApi = {
  getAll: () => request("/payments"),
  verify: (id, payload) =>
    request(`/payments/${id}/verify`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const qrConfigsApi = {
  getAll: () => request("/qr-configs"),
  create: (payload) =>
    request("/qr-configs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/qr-configs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/qr-configs/${id}`, {
      method: "DELETE",
    }),
};

export const filesApi = {
  upload: (folderName, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return request(`/files/upload/${folderName}`, {
      method: "POST",
      body: formData,
    });
  },
};
