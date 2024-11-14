export const checkAuth = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    // Try to decode the token
    const decodedToken = JSON.parse(atob(token));
    // Add a simple expiration check (24 hours)
    const isExpired = Date.now() - decodedToken.timestamp > 24 * 60 * 60 * 1000;
    return !isExpired;
  } catch {
    return false;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const logout = () => {
  localStorage.removeItem("authToken");
  window.location.reload();
};
