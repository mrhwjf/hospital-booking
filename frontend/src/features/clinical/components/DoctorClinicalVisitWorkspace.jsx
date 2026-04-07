import { useMemo, useState } from "react";
import { Alert, Button, Descriptions, Modal, Tabs, Tag, message } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { completePhieuKham, getPhieuKham } from "../../../Services/clinicalService";
import { getApiErrorMessage } from "../../../utils/apiError";
import PhieuKhamPage from "../pages/PhieuKhamPage";
import PhieuChiDinhPage from "../pages/PhieuChiDinhPage";
import DonThuocPage from "../pages/DonThuocPage";
import HoSoTaiLieuPage from "../../records/pages/HoSoTaiLieuPage";

const COMPLETABLE_STATUSES = new Set(["dang_kham"]);

function normalizeStatus(value) {
	return String(value || "").trim().toLowerCase();
}

function getStatusMeta(status) {
	const normalized = normalizeStatus(status);

	if (normalized === "hoan_thanh") {
		return { label: "Hoàn thành", color: "success" };
	}

	if (normalized === "dang_kham") {
		return { label: "Đang khám", color: "processing" };
	}

	return { label: "Tiếp nhận", color: "default" };
}

function isEmptyValue(value) {
	return value === undefined || value === null || String(value).trim() === "";
}

export default function DoctorClinicalVisitWorkspace({
	selectedPatient,
	selectedPhieuKham,
	onBack,
	onCompleted,
}) {
	const [activeTab, setActiveTab] = useState("phieu-kham");
	const [refreshKey, setRefreshKey] = useState(0);
	const [isCompleting, setIsCompleting] = useState(false);
	const [visitSnapshot, setVisitSnapshot] = useState(selectedPhieuKham ?? null);
	const [validationError, setValidationError] = useState("");
	const [messageApi, contextHolder] = message.useMessage();

	const phieuKhamId = useMemo(() => {
		const id = Number(visitSnapshot?.id ?? selectedPhieuKham?.id ?? 0);
		return Number.isFinite(id) && id > 0 ? id : null;
	}, [selectedPhieuKham?.id, visitSnapshot?.id]);

	const benhNhanId = useMemo(() => {
		const candidateIds = [
			selectedPatient?.benhNhanId,
			selectedPatient?.id,
			visitSnapshot?.benh_nhan?.id,
			selectedPhieuKham?.benh_nhan?.id,
		];

		for (const candidate of candidateIds) {
			const id = Number(candidate);
			if (Number.isFinite(id) && id > 0) {
				return id;
			}
		}

		return null;
	}, [selectedPatient?.benhNhanId, selectedPatient?.id, selectedPhieuKham?.benh_nhan?.id, visitSnapshot?.benh_nhan?.id]);

	const currentStatus = normalizeStatus(visitSnapshot?.trang_thai ?? selectedPhieuKham?.trang_thai);
	const statusMeta = getStatusMeta(currentStatus);
	const isLocked = currentStatus === "hoan_thanh";
	const canComplete = COMPLETABLE_STATUSES.has(currentStatus);

	async function handleCompleteVisit() {
		if (!phieuKhamId || isLocked) {
			return;
		}

		setValidationError("");
		setIsCompleting(true);

		try {
			const latestPhieuKham = await getPhieuKham(phieuKhamId);
			const requiredFields = [
				{ key: "trieu_chung", label: "Triệu chứng" },
				{ key: "ket_qua_kham", label: "Kết quả khám" },
				{ key: "chan_doan", label: "Chẩn đoán" },
				{ key: "huong_dieu_tri", label: "Hướng điều trị" },
				{ key: "loi_dan", label: "Lời dặn" },
			];

			const missingFields = requiredFields
				.filter((field) => isEmptyValue(latestPhieuKham?.[field.key]))
				.map((field) => field.label);

			if (missingFields.length > 0) {
				setActiveTab("phieu-kham");
				setValidationError(`Vui lòng hoàn thiện trước khi hoàn tất khám: ${missingFields.join(", ")}.`);
				messageApi.warning("Phiếu khám chưa đủ thông tin để hoàn tất.");
				return;
			}

			const latestStatus = normalizeStatus(latestPhieuKham?.trang_thai);

			if (!COMPLETABLE_STATUSES.has(latestStatus)) {
				setValidationError("Phiếu khám chưa ở trạng thái cho phép hoàn tất. Hãy bắt đầu/tiếp tục khám trước.");
				return;
			}

			const completed = await completePhieuKham(phieuKhamId);
			const mergedVisit = {
				...(visitSnapshot ?? {}),
				...(completed ?? {}),
				trang_thai: completed?.trang_thai ?? "hoan_thanh",
			};

			setVisitSnapshot(mergedVisit);
			setRefreshKey((prev) => prev + 1);
			messageApi.success("Đã hoàn tất khám. Bản ghi đã được khóa chỉnh sửa.");

			if (typeof onCompleted === "function") {
				onCompleted(mergedVisit);
			}
		} catch (error) {
			const errorMessage = getApiErrorMessage(error, "Không thể hoàn tất phiếu khám.");
			messageApi.error(errorMessage);
		} finally {
			setIsCompleting(false);
		}
	}

	function confirmCompleteVisit() {
		if (!phieuKhamId || isLocked || isCompleting || !canComplete) {
			return;
		}

		Modal.confirm({
			title: "Xác nhận hoàn tất khám",
			content: "Sau khi hoàn tất, phiếu khám sẽ bị khóa chỉnh sửa. Bạn có chắc chắn muốn tiếp tục?",
			okText: "Hoàn tất khám",
			cancelText: "Hủy",
			onOk: handleCompleteVisit,
		});
	}

	function handlePhieuKhamChange(updatedPhieuKham) {
		if (!updatedPhieuKham) {
			return;
		}

		setVisitSnapshot((prev) => ({
			...(prev ?? {}),
			...updatedPhieuKham,
		}));
	}

	if (!phieuKhamId || !benhNhanId) {
		return (
			<div className="rounded-xl border border-red-200 bg-red-50 p-4">
				{contextHolder}
				<Alert
					type="error"
					showIcon
					message="Không đủ dữ liệu để mở không gian khám bệnh. Vui lòng quay lại lịch sử khám và chọn lại phiếu khám."
				/>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{contextHolder}

			<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="space-y-3">
						<Button icon={<ArrowLeftOutlined />} onClick={onBack}>
							Quay lại lịch sử khám
						</Button>

						<div>
							<h2 className="text-2xl font-bold text-slate-900">Không gian khám lâm sàng</h2>
							<p className="mt-1 text-sm text-slate-500">
								Bệnh nhân: <strong>{selectedPatient?.name || "-"}</strong> ({selectedPatient?.code || "-"})
							</p>
						</div>

						<Descriptions size="small" column={2} className="[&_.ant-descriptions-item-label]:text-slate-500">
							<Descriptions.Item label="Mã phiếu khám">
								{visitSnapshot?.ma_phieu_kham || `PK#${phieuKhamId}`}
							</Descriptions.Item>
							<Descriptions.Item label="Trạng thái">
								<Tag color={statusMeta.color}>{statusMeta.label}</Tag>
							</Descriptions.Item>
						</Descriptions>
					</div>

					<div className="flex flex-col items-end gap-2">
						{!isLocked ? (
							<Button
								type="primary"
								icon={<CheckCircleOutlined />}
								onClick={confirmCompleteVisit}
								loading={isCompleting}
								disabled={!canComplete}
								className="bg-emerald-600! hover:bg-emerald-700! border-emerald-600!"
							>
								Hoàn tất khám
							</Button>
						) : null}

						{isLocked ? <span className="text-xs text-emerald-600">Phiếu khám đã khóa chỉnh sửa.</span> : null}
						{!isLocked && !canComplete ? (
							<span className="text-xs text-amber-600">Cần ở trạng thái "Đang khám" để hoàn tất.</span>
						) : null}
					</div>
				</div>

				{validationError ? (
					<Alert
						className="mt-4"
						type="warning"
						showIcon
						message={validationError}
					/>
				) : null}
			</div>

			<div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
				<Tabs
					activeKey={activeTab}
					onChange={setActiveTab}
					items={[
						{
							key: "phieu-kham",
							label: "Phiếu khám",
							children: (
								<PhieuKhamPage
									phieuKhamId={phieuKhamId}
									refreshKey={refreshKey}
									onPhieuKhamChange={handlePhieuKhamChange}
								/>
							),
						},
						{
							key: "chi-dinh",
							label: "Chỉ định",
							children: (
								<PhieuChiDinhPage
									phieuKhamId={phieuKhamId}
									isLocked={isLocked}
									refreshKey={refreshKey}
								/>
							),
						},
						{
							key: "don-thuoc",
							label: "Đơn thuốc",
							children: (
								<DonThuocPage
									phieuKhamId={phieuKhamId}
									isLocked={isLocked}
									refreshKey={refreshKey}
								/>
							),
						},
						{
							key: "tai-lieu-ho-so",
							label: "Tài liệu hồ sơ",
							children: (
								<HoSoTaiLieuPage
									benhNhanId={benhNhanId}
									phieuKhamId={phieuKhamId}
									isLocked={isLocked}
									refreshKey={refreshKey}
								/>
							),
						},
					]}
				/>
			</div>
		</div>
	);
}
