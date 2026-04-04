export const getApiErrorMessage = (error, fallbackMessage) => {
	const firstError =
		error?.response?.data?.data?.errors &&
		Object.values(error.response.data.data.errors)[0]?.[0]

	return firstError || error?.response?.data?.message || fallbackMessage
}
