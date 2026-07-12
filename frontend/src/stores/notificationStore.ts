import { create } from 'zustand';
import api from '@/services/api';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/notifications');
      set({ 
        notifications: response.data, 
        unreadCount: response.data.filter((n: Notification) => !n.is_read).length,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.detail || 'Failed to fetch notifications', isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const updated = get().notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      );
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.is_read).length
      });
    } catch (error: any) {
      console.error('Failed to mark as read', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/read-all');
      set({
        notifications: get().notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0
      });
    } catch (error: any) {
      console.error('Failed to mark all as read', error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      const updated = get().notifications.filter((n) => n.id !== id);
      set({
        notifications: updated,
        unreadCount: updated.filter((n) => !n.is_read).length
      });
    } catch (error: any) {
      console.error('Failed to delete notification', error);
    }
  }
}));
