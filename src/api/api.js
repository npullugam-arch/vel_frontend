const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(
      (data && data.message) || data || "Something went wrong"
    );
  }

  return data;
}

function buildAuthHeaders(token, extraHeaders = {}) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

export async function loginAdmin(payload) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getPublicInternships() {
  const response = await fetch(`${BASE_URL}/public/internships`);
  return handleResponse(response);
}

export async function getPublicEvents() {
  const response = await fetch(`${BASE_URL}/public/events`);
  return handleResponse(response);
}

export async function getPublicProjects() {
  const response = await fetch(`${BASE_URL}/public/projects`);
  return handleResponse(response);
}

export async function submitRegistration(payload) {
  const response = await fetch(`${BASE_URL}/registrations`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function submitContact(payload) {
  const response = await fetch(`${BASE_URL}/contact-inquiries`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getDashboard(token) {
  const response = await fetch(`${BASE_URL}/dashboard`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function getRegistrations(token) {
  const response = await fetch(`${BASE_URL}/registrations`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function getContacts(token) {
  const response = await fetch(`${BASE_URL}/contact-inquiries`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function getPayments(token) {
  const response = await fetch(`${BASE_URL}/payments`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });
  return handleResponse(response);
}

export async function getQrConfigs(token) {
  const response = await fetch(`${BASE_URL}/qr-configs`, {
    method: "GET",
    headers: buildAuthHeaders(token),
  });
  return handleResponse(response);
}