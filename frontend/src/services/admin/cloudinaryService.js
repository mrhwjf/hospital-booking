import {
	taiAnhDaiDienCloudinary as taiAnhDaiDienCloudinaryApi,
	xoaAnhDaiDienCloudinary as xoaAnhDaiDienCloudinaryApi,
} from '../../api/adminApi';

const toAvatarResult = (item = {}) => ({
	url: item.url ?? '',
	public_id: item.public_id ?? '',
});

export const taiAnhDaiDienCloudinary = async (nguoiDungId, file) => {
	const response = await taiAnhDaiDienCloudinaryApi(nguoiDungId, file);
	return toAvatarResult(response?.data ?? {});
};

export const xoaAnhDaiDienCloudinary = async (publicId) => {
	if (!publicId) return null;
	return xoaAnhDaiDienCloudinaryApi(publicId);
};

const cloudinaryService = {
	taiAnhDaiDienCloudinary,
	xoaAnhDaiDienCloudinary,
};

export default cloudinaryService;
