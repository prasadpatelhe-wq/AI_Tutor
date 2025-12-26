/**
 * useAuth - Authentication Hook
 *
 * Manages login, logout, session state and guest mode
 */

import { useState, useCallback, useEffect } from 'react';
import { loginStudent, registerStudent, requestOtp, verifyOtp, loginStudentOtp, getStudent } from '../api';

const GUEST_STUDENT = {
  id: 'guest',
  name: 'Guest Learner',
  grade_band: 'Grade 8',
  board: 'CBSE',
  medium: 'en',
  isGuest: true,
};

const STORAGE_KEY = 'ai_tutor_student';

export const useAuth = () => {
  const [student, setStudent] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist student to localStorage
  useEffect(() => {
    if (student && !student.isGuest) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [student]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginStudent(credentials);
      if (result.success) {
        setStudent(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerStudent(studentData);
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithOtp = useCallback(async ({ phone, otp }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginStudentOtp({ phone, otp });
      if (result.success) {
        setStudent(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || 'OTP login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendOtp = useCallback(async ({ channel, identifier, purpose }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestOtp({ channel, identifier, purpose });
      return result;
    } catch (err) {
      const message = err.message || 'Failed to send OTP';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmOtp = useCallback(async ({ channel, identifier, purpose, otp }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyOtp({ channel, identifier, purpose, otp });
      return result;
    } catch (err) {
      const message = err.message || 'OTP verification failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const enterGuestMode = useCallback(() => {
    setStudent(GUEST_STUDENT);
  }, []);

  const logout = useCallback(() => {
    setStudent(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshStudent = useCallback(async () => {
    if (!student || student.isGuest) return;
    try {
      const result = await getStudent(student.id);
      if (result.success) {
        setStudent(result.data);
      }
    } catch (err) {
      console.error('Failed to refresh student:', err);
    }
  }, [student]);

  return {
    student,
    loading,
    error,
    isAuthenticated: !!student,
    isGuest: student?.isGuest || false,
    login,
    register,
    loginWithOtp,
    sendOtp,
    confirmOtp,
    enterGuestMode,
    logout,
    refreshStudent,
    setStudent,
    clearError: () => setError(null),
  };
};

export default useAuth;
