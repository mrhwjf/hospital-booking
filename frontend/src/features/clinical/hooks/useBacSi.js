/**
 * Custom Hook để fetch và manage dữ liệu bác sĩ
 * Giúp tách logic fetch data ra khỏi component
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchBacSiComplete,
  fetchBacSiLichLamViec,
} from '../services/bacSiService';

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
