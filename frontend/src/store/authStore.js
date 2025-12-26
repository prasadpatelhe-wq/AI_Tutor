/**
 * Auth Store - Zustand
 *
 * Global authentication state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginStudent, registerStudent, loginStudentOtp, getStudent } from '../api';

const GUEST_STUDENT = {
  id: 'guest',
  name: 'Guest Learner',
  grade_band: 'Grade 8',
  board: 'CBSE',
  medium: 'en',
  isGuest: true,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      student: null,
      loading: false,
      error: null,
      authView: 'welcome', // welcome | login | register | parent

      // Computed
      isAuthenticated: () => !!get().student,
      isGuest: () => get().student?.isGuest || false,

      // Actions
      setAuthView: (view) => set({ authView: view }),

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const result = await loginStudent(credentials);
          if (result.success) {
            set({ student: result.data, loading: false, authView: 'welcome' });
            return { success: true, data: result.data };
          } else {
            set({ error: result.message, loading: false });
            return { success: false, message: result.message };
          }
        } catch (err) {
          const message = err.message || 'Login failed';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      register: async (studentData) => {
        set({ loading: true, error: null });
        try {
          const result = await registerStudent(studentData);
          if (result.success) {
            set({ loading: false });
            return { success: true, data: result.data };
          } else {
            set({ error: result.message, loading: false });
            return { success: false, message: result.message };
          }
        } catch (err) {
          const message = err.message || 'Registration failed';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      loginWithOtp: async ({ phone, otp }) => {
        set({ loading: true, error: null });
        try {
          const result = await loginStudentOtp({ phone, otp });
          if (result.success) {
            set({ student: result.data, loading: false, authView: 'welcome' });
            return { success: true, data: result.data };
          } else {
            set({ error: result.message, loading: false });
            return { success: false, message: result.message };
          }
        } catch (err) {
          const message = err.message || 'OTP login failed';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      enterGuestMode: () => {
        set({ student: GUEST_STUDENT, authView: 'welcome' });
      },

      logout: () => {
        set({
          student: null,
          error: null,
          authView: 'welcome',
        });
      },

      refreshStudent: async () => {
        const { student } = get();
        if (!student || student.isGuest) return;
        try {
          const result = await getStudent(student.id);
          if (result.success) {
            set({ student: result.data });
          }
        } catch (err) {
          console.error('Failed to refresh student:', err);
        }
      },

      setStudent: (student) => set({ student }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'ai-tutor-auth',
      partialize: (state) => ({
        student: state.student?.isGuest ? null : state.student,
      }),
    }
  )
);

export default useAuthStore;
