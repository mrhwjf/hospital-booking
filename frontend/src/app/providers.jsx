import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import viVN from 'antd/locale/vi_VN'

const antTheme = {
	algorithm: theme.defaultAlgorithm,
	token: {
		colorPrimary: '#0F766E',
		borderRadius: 10,
		fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
	},
}

export default function AppProviders({ children }) {
	return (
		<ConfigProvider
			theme={antTheme}
			locale={viVN}
		>
			<BrowserRouter>{children}</BrowserRouter>
		</ConfigProvider>
	)
}
