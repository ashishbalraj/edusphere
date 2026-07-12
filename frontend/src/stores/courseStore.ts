import { create } from 'zustand';
import type { Course, Enrollment } from '@/types';
import courseService from '@/services/course';

interface CourseState {
  courses: Course[];
  enrollments: Enrollment[];
  activeCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCourses: () => Promise<void>;
  fetchMyEnrollments: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateProgress: (enrollmentId: string, progress: number) => Promise<void>;
  createCourse: (courseData: any) => Promise<void>;
  updateCourse: (courseId: string, courseData: any) => Promise<void>;
  createMaterial: (courseId: string, materialData: any) => Promise<void>;
  deleteMaterial: (courseId: string, materialId: string) => Promise<void>;
  clearError: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  enrollments: [],
  activeCourse: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await courseService.getAllCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch courses';
      set({ error: message, isLoading: false });
    }
  },

  fetchMyEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const enrollments = await courseService.getMyEnrollments();
      set({ enrollments, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch enrollments';
      set({ error: message, isLoading: false });
    }
  },

  enrollInCourse: async (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const enrollment = await courseService.enrollInCourse(courseId);
      set({ 
        enrollments: [...get().enrollments, enrollment],
        isLoading: false 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to enroll in course';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateProgress: async (enrollmentId: string, progress: number) => {
    try {
      const updatedEnrollment = await courseService.updateProgress(enrollmentId, progress);
      set({
        enrollments: get().enrollments.map((e) => 
          e.id === enrollmentId ? updatedEnrollment : e
        )
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update progress';
      set({ error: message });
    }
  },

  createCourse: async (courseData: any) => {
    set({ isLoading: true, error: null });
    try {
      const newCourse = await courseService.createCourse(courseData);
      set({
        courses: [...get().courses, newCourse],
        isLoading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create course';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateCourse: async (courseId: string, courseData: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCourse = await courseService.updateCourse(courseId, courseData);
      set({
        courses: get().courses.map((c) => (c.id === courseId ? { ...c, ...updatedCourse } : c)),
        isLoading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update course';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createMaterial: async (courseId: string, materialData: any) => {
    set({ isLoading: true, error: null });
    try {
      const newMaterial = await courseService.createMaterial(courseId, materialData);
      set({
        courses: get().courses.map((c) => {
          if (c.id === courseId) {
            return {
              ...c,
              materials: [...(c.materials || []), newMaterial]
            };
          }
          return c;
        }),
        isLoading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create lesson';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteMaterial: async (courseId: string, materialId: string) => {
    set({ isLoading: true, error: null });
    try {
      await courseService.deleteMaterial(materialId);
      set({
        courses: get().courses.map((c) => {
          if (c.id === courseId) {
            return {
              ...c,
              materials: (c.materials || []).filter((m) => m.id !== materialId)
            };
          }
          return c;
        }),
        isLoading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete lesson';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
