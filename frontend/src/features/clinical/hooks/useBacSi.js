/**
 * Custom Hook để fetch và manage dữ liệu bác sĩ
 * Giúp tách logic fetch data ra khỏi component
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getThongTinBacSiStatic,
  getThongTinBacSiWeekly,
} from '../../../Services/clinicalService';

const normalizeStaticProfile = (payload) => {
  const source = payload?.data || payload || null;

  if (!source) {
    return {
      bacSiInfo: null,
      chuyenKhoa: [],
    };
  }

  return {
    bacSiInfo: source?.bac_si || source,
    chuyenKhoa: source?.chuyen_khoa || source?.chuyenKhoas || [],
  };
};

const normalizeWeeklySchedule = (payload) => {
  const source = payload?.data || payload || {};

  return {
    lichLamViec: source?.lich_lam_viec || source?.lich_tuan || source?.lichLamViec || [],
    ngayNghiLe: source?.ngay_nghi_le || source?.nghi_le || source?.ngayNghiLe || [],
  };
};

const fetchBacSiComplete = async (bacSiId) => {
  const [profilePayload, weeklyPayload] = await Promise.all([
    getThongTinBacSiStatic({ bac_si_id: bacSiId }),
    getThongTinBacSiWeekly({ bac_si_id: bacSiId }),
  ]);

  const profile = normalizeStaticProfile(profilePayload);
  const weekly = normalizeWeeklySchedule(weeklyPayload);

  return {
    bacSiInfo: profile.bacSiInfo,
    chuyenKhoa: profile.chuyenKhoa,
    lichLamViec: weekly.lichLamViec,
    ngayNghiLe: weekly.ngayNghiLe,
  };
};

const fetchBacSiLichLamViec = async (bacSiId, params = {}) => {
  const weeklyPayload = await getThongTinBacSiWeekly({
    bac_si_id: bacSiId,
    week_offset: Number(params.week_offset ?? params.weekOffset ?? 0),
  });

  return normalizeWeeklySchedule(weeklyPayload).lichLamViec;
};

/**
 * Hook để lấy thông tin bác sĩ
 * @param {number|string} bacSiId - ID của bác sĩ
 * @returns {Object} { bacSiInfo, chuyenKhoa, lichLamViec, ngayNghiLe, loading, error, refetch }
 */
export const useBacSiInfo = (bacSiId) => {
  const [bacSiInfo, setBacSiInfo] = useState(null);
  const [chuyenKhoa, setChuyenKhoa] = useState([]);
  const [lichLamViec, setLichLamViec] = useState([]);
  const [ngayNghiLe, setNgayNghiLe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!bacSiId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchBacSiComplete(bacSiId);

      setBacSiInfo(data.bacSiInfo);
      setChuyenKhoa(data.chuyenKhoa);
      setLichLamViec(data.lichLamViec);
      setNgayNghiLe(data.ngayNghiLe);
    } catch (err) {
      setError(err.message || 'Lỗi tải dữ liệu');
      console.error('Error in useBacSiInfo:', err);
    } finally {
      setLoading(false);
    }
  }, [bacSiId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    bacSiInfo,
    chuyenKhoa,
    lichLamViec,
    ngayNghiLe,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook để fetch lịch làm việc với filter
 * @param {number|string} bacSiId - ID của bác sĩ
 * @param {Object} params - Tham số filter (startDate, endDate, status)
 * @returns {Object} { lichLamViec, loading, error, refetch }
 */
export const useBacSiLichLamViec = (bacSiId, params = {}) => {
  const [lichLamViec, setLichLamViec] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!bacSiId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchBacSiLichLamViec(bacSiId, params);
      setLichLamViec(data);
    } catch (err) {
      setError(err.message || 'Lỗi tải lịch làm việc');
      console.error('Error in useBacSiLichLamViec:', err);
    } finally {
      setLoading(false);
    }
  }, [bacSiId, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    lichLamViec,
    loading,
    error,
    refetch,
  };
};
