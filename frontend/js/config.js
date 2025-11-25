// Frontend configuration
// Update API_BASE_URL to point to the provided backend.
// Backend README says the server runs on port 4000 by default.
const API_BASE_URL = window.__API_BASE_URL__ || 'http://localhost:4000';
const AUTH_STORAGE_KEY = 'olivier_auth_v1';

// Helper to choose storage based on persistent flag
function storage(persistent){
  return persistent ? localStorage : sessionStorage;
}
