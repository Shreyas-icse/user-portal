const BASE = 'http://localhost:5000/api/employees';

// Register new user
export async function signup(formData) {
  const res = await fetch(`${BASE}/signup`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

// Login user
export async function login(credentials) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

// Get user profile using JWT token
export async function getProfile(token) {
  const res = await fetch(`${BASE}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return data.user || data; // support both formats
}

// Update user profile
export async function updateProfile(token, formData) {
  const res = await fetch(`${BASE}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      // NOTE: Do NOT set Content-Type manually when using FormData
      // It will be set automatically by the browser with proper boundary
    },
    body: formData,
  });

  const data = await res.json();
  return data;
}
