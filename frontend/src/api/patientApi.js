import httpClient from './httpClient';

/**
 * Get current user's patient profile
 * @returns {Promise}
 */
export const getPatientProfile = () => {
  return httpClient.get('/patient-profile');
};

/**
 * Get patient profile by ID (test endpoint - no auth required)
 * @param {number} benhNhanId - Patient ID
 * @returns {Promise}
 */
export const getPatientProfileTest = (benhNhanId) => {
  // Using raw fetch instead of httpClient to avoid auth interceptor
  return fetch(`http://localhost:8000/api/v1/patients/test/${benhNhanId}`)
    .then(res => {
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return res.json();
    });
};

/**
 * Update patient profile by ID (test endpoint - no auth required)
 * @param {object} data - Profile data to update
 * @param {number} benhNhanId - Patient ID
 * @returns {Promise}
 */
export const updatePatientProfileTest = (data, benhNhanId = 1) => {
  // Using raw fetch for test endpoint
  return fetch(`http://localhost:8000/api/v1/patients/update/${benhNhanId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => {
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  });
};

/**
 * Update current user's patient profile
 * @param {object} data - Profile data to update
 * @returns {Promise}
 */
export const updatePatientProfile = (data) => {
  // For testing, use the test endpoint
  return updatePatientProfileTest(data, 1);
};
