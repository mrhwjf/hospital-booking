// App.jsx
import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import axios from 'axios';

function App() {
	const [pdfUrl, setPdfUrl] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const filePath = 'hospital_booking/medical_documents/appointments_1/document_1.pdf';
	const encodedPath = encodeURIComponent(filePath);

	useEffect(() => {
		// Backend returns ApiResponse::success({ url: ... }) => { success, data: { url }, message }
		axios.get(`http://localhost:8000/api/v1/cloudinary/file/${encodedPath}/signed-url`)
			.then(({ data }) => {
				const signedUrl = data?.data?.url;

				if (!signedUrl) {
					throw new Error('Signed URL is missing in API response.');
				}

				setPdfUrl(signedUrl);
				setLoading(false);
			})
			.catch(err => {
				console.error(err);
				const apiMessage = err?.response?.data?.message;
				setError(apiMessage || err?.message || 'Failed to fetch PDF URL');
				setLoading(false);
			});
	}, [encodedPath]);

	if (loading) return <Spin description="Loading..." style={{ margin: 50 }} />;

	if (error) return <Alert title="Error" description={error} type="error" style={{ margin: 50 }} />;

	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			padding: 0,
			margin: 0
		}}>
			<Card
				title="PDF Preview"
				style={{
					width: '100%',
					height: '100%',
					borderRadius: 0
				}}
				bodyStyle={{
					padding: 0,
					height: 'calc(100% - 57px)' // Adjust for Card title height
				}}
			>
				<iframe
					src={pdfUrl}
					style={{
						border: 'none',
						width: '100%',
						height: '100%',
						display: 'block'
					}}
					title="PDF Viewer"
				/>
			</Card>
		</div>
	);
}

export default App;