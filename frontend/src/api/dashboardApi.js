import httpClient from './httpClient';

/**
 * Get patient dashboard overview
 * 
 * API: GET /api/v1/dashboard/patient
 * Auth: Bearer token (role: BENHNHAN)
 * 
 * Returns:
 * - patient_info: Mã BN, nhóm máu, thông tin cơ bản
 * - upcoming_appointments: Lịch hẹn sắp tới
 * - recent_visit_history: Lịch sử khám gần đây
 * - health_profile: Tiền sử bệnh, dị ứng
 * - health_reminder: Nhắc nhở sức khỏe
 * 
 * @returns {Promise<Object>} Dashboard data
 * @throws {Error} API error or network error
 */
export const getPatientDashboard = () => {
  return httpClient.get('/dashboard/patient').then((response) => {
    return response?.data ?? response;
  });
};

/**
 * Get test token for development (Dev only)
 * 
 * Creates test patient account and returns authentication token
 * Useful for testing without login
 * 
 * API: POST /api/test/create-patient
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "access_token": "1|abc123def456...",
 *     "token_type": "Bearer",
 *     "user_id": 1,
 *     "email": "test.patient@hospital.test"
 *   }
 * }
 * 
 * @returns {Promise<Object>} { access_token, user_id, email }
 * @throws {Error} If not in development mode
 */
export const getTestToken = async () => {
  try {
    const response = await fetch('/api/test/create-patient', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data.access_token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', data.data.access_token);
      localStorage.setItem('test_mode', 'true');

      console.log('✅ Test token created:', {
        user: data.data.email,
        patient: data.data.ma_benh_nhan
      });

      return data.data;
    }

    throw new Error('Failed to create test token');

  } catch (error) {
    console.error('❌ Failed to get test token:', error);
    throw error;
  }
};

/**
 * Get test dashboard data (Dev only)
 * 
 * Fetches dashboard using a test token
 * Combines getTestToken + getPatientDashboard
 * 
 * @returns {Promise<Object>} Dashboard data
 */
export const getTestDashboard = async () => {
  try {
    // Get test token
    const tokenData = await getTestToken();

    // Set auth header with test token
    const response = await fetch('/api/v1/dashboard/patient', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dashboard = await response.json();
    return dashboard;

  } catch (error) {
    console.error('❌ Failed to get test dashboard:', error);
    throw error;
  }
};

/**
 * Clear test mode (Dev only)
 * 
 * Removes test data from localStorage
 */
export const clearTestMode = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('test_mode');
  console.log('✅ Test mode cleared');
};

