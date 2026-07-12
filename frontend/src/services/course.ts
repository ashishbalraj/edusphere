import { apiClient } from './api';
import type { Course, Enrollment } from '@/types';

class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const { data } = await apiClient.get<Course[]>('/courses/');
    return data;
  }

  async getCourseById(id: string): Promise<Course> {
    const { data } = await apiClient.get<Course>(`/courses/${id}`);
    return data;
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    const { data } = await apiClient.get<Enrollment[]>('/courses/me/enrollments');
    return data;
  }

  async enrollInCourse(courseId: string): Promise<Enrollment> {
    const { data } = await apiClient.post<Enrollment>(`/courses/${courseId}/enroll`);
    return data;
  }

  async updateProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    const { data } = await apiClient.put<Enrollment>(`/courses/enrollments/${enrollmentId}/progress`, {
      progress,
    });
    return data;
  }

  async createCourse(courseData: {
    title: string;
    description?: string;
    category?: string;
    difficulty?: string;
    syllabus?: string;
    is_published?: boolean;
    thumbnail_url?: string;
  }): Promise<Course> {
    const { data } = await apiClient.post<Course>('/courses/', courseData);
    return data;
  }

  async updateCourse(courseId: string, courseData: {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    syllabus?: string;
    is_published?: boolean;
    thumbnail_url?: string;
  }): Promise<Course> {
    const { data } = await apiClient.put<Course>(`/courses/${courseId}`, courseData);
    return data;
  }

  async createMaterial(courseId: string, materialData: {
    title: string;
    description?: string;
    content?: string;
    order?: number;
    file_type?: string;
    file_url?: string;
  }): Promise<any> {
    const { data } = await apiClient.post<any>(`/courses/${courseId}/materials`, materialData);
    return data;
  }

  async deleteMaterial(materialId: string): Promise<void> {
    await apiClient.delete(`/courses/materials/${materialId}`);
  }
}

export const courseService = new CourseService();
export default courseService;
