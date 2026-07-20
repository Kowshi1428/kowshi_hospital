const BASE_URL = "/api";

const request = async (method, path, body = null) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    
    if (res.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized access. Redirecting to login...");
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "An API error occurred");
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on ${method} ${path}:`, err.message);
    throw err;
  }
};

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path)
};
