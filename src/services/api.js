const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Helper to get the auth token from local storage (or your Zustand store)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('vocalvitals_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Uploads an audio file and creates an analysis session
 */
export const uploadAudioForAnalysis = async (fileObj) => {
  const formData = new FormData();
  formData.append('file', fileObj);

  const response = await fetch(`${API_BASE_URL}/analysis/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      // Do NOT set Content-Type to application/json, browser will auto-set multipart/form-data
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Audio upload API failed');
  return await response.json(); // returns { success: true, data: { session_id, status } }
};

/**
 * Enqueues the uploaded session for the ML server to process
 */
export const startAnalysisTask = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/analysis/submit/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  });

  if (!response.ok) throw new Error('Failed to submit analysis');
  return await response.json();
};

/**
 * Polls the ML Pipeline to see if processing is complete
 */
export const checkAnalysisStatus = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/analysis/status/${sessionId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) throw new Error('Status polling failed');
  return await response.json();
};

/**
 * Authentication & Users
 */
export const registerUser = async (email, password, fullName) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName })
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Invalid credentials');
  return await response.json();
};

/**
 * Doctor Directory
 */
export const searchDoctors = async (specialty) => {
  const url = specialty 
    ? `${API_BASE_URL}/doctors/search?specialty=${encodeURIComponent(specialty)}`
    : `${API_BASE_URL}/doctors/search`;
    
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return await response.json();
};
