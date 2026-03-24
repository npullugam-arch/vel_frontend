const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  let data;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(
      (typeof data === "object" && data?.message) ||
      (typeof data === "string" && data) ||
      "Request failed"
    );
  }

  return data;
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function submitContact(payload) {
  const response = await fetch(`${BASE_URL}/contact-inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}