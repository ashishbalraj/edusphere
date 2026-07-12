import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award,
  Clock,
  Check,
  Trash2,
  Settings
} from 'lucide-react';

import { useNotificationStore } from '@/stores/notificationStore';
import { Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const { 
    notifications, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount 
  } = useNotificationStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n => 
    filter === 'unread' ? !n.is_read : true
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="w-5 h-5 text-slate-500" />;
      case 'course': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'system': return 'bg-slate-500/10 border-slate-500/20';
      case 'course': return 'bg-blue-500/10 border-blue-500/20';
      case 'achievement': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'alert': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
              <Bell className="w-6 h-6" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-background">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated on your learning journey</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <GlassCard className="flex flex-col min-h-[600px] overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border bg-secondary/30 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'
            }`}
          >
            Unread
          </button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ opacity: { duration: 0.2 } }}
                  className={`relative group transition-colors hover:bg-secondary/20 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div className="p-4 sm:p-6 flex gap-4">
                    {!notification.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    
                    <div className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${getIconBg(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className={`text-base font-medium truncate ${!notification.is_read ? 'text-foreground font-bold' : 'text-foreground/80'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" /> {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {notification.link && (
                        <div className="mt-3">
                          <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
                            View Details →
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        {!notification.is_read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                  <Bell className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg font-medium text-foreground">You're all caught up!</p>
                  <p className="text-sm mt-1">No new notifications at the moment.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </GlassCard>
    </div>
  );
}
