import httpClient from './httpClient';

const CLOUDINARY_ENDPOINTS = {
	uploadMedicalDocument: (phieuKhamId, taiLieuId) => `/cloudinary/medical-document/${phieuKhamId}/${taiLieuId}`,
	getMedicalDocumentSignedUrl: (publicId) => `/cloudinary/medical-document/${encodeURIComponent(publicId)}/signed-url`,
	deleteMedicalDocument: (publicId) => `/cloudinary/medical-document/${encodeURIComponent(publicId)}`,
};

export async function uploadMedicalDocumentFile(phieuKhamId, taiLieuId, file) {
	const formData = new FormData();
	formData.append('tai_lieu', file);

	return httpClient.post(CLOUDINARY_ENDPOINTS.uploadMedicalDocument(phieuKhamId, taiLieuId), formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
}

export async function getMedicalDocumentSignedUrl(publicId) {
	return httpClient.get(CLOUDINARY_ENDPOINTS.getMedicalDocumentSignedUrl(publicId));
}

export async function deleteMedicalDocumentFile(publicId) {
	return httpClient.delete(CLOUDINARY_ENDPOINTS.deleteMedicalDocument(publicId));
}
