import httpClient from './httpClient'

const HARDCODED_STAFF_USER_ID = 4

export const resolveCurrentStaffUserId = () => HARDCODED_STAFF_USER_ID

export const getCurrentStaffProfile = () =>
	httpClient.get('/nhan-vien/me', {
		params: {
			nguoi_dung_id: resolveCurrentStaffUserId(),
		},
	})
