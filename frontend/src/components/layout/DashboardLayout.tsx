import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useNotificationStore } from '@/stores/notificationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  BrainCircuit,
  FileText,
  HelpCircle,
  Library,
  Briefcase,
  GraduationCap,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: `/dashboard/${user?.role || 'student'}`, icon: LayoutDashboard },
        { name: 'Course Catalog', path: '/dashboard/courses', icon: BookOpen },
        { name: 'Analytics', path: '/analytics', icon: BarChart, roles: ['teacher', 'admin'] },
      ],
    },
    {
      title: 'Study Tools',
      items: [
        { name: 'AI Tutor', path: '/ai/tutor', icon: BrainCircuit },
        { name: 'ChatPDF', path: '/ai/chat-pdf', icon: FileText },
        { name: 'Notes Generator', path: '/ai/notes', icon: Library },
        { name: 'Quiz Generator', path: '/ai/quiz', icon: HelpCircle },
        { name: 'Flashcards', path: '/ai/flashcards', icon: Library },
        { name: 'Study Planner', path: '/ai/study-planner', icon: GraduationCap },
      ],
    },
    {
      title: 'Career & Projects',
      items: [
        { name: 'Resume Builder', path: '/ai/resume-builder', icon: Briefcase },
        { name: 'Career Coach', path: '/ai/career-coach', icon: MessageSquare },
        { name: 'Mock Interview', path: '/ai/mock-interview', icon: BrainCircuit },
        { name: 'Project Ideas', path: '/ai/project-recommendation', icon: FileText },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden selection:bg-primary/30 print:block">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-secondary/50 backdrop-blur-xl border-r border-border/50 flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 print:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 shrink-0">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Logo size="sm" />
          </Link>
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {navGroups.map((group, idx) => {
            const filteredItems = group.items.filter(
              (item) => !item.roles || item.roles.includes(user?.role || 'student')
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="mb-8">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                  {group.title}
                </h4>
                <ul className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50 shrink-0">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 print:hidden">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses, notes, or ask AI..."
                className="pl-9 pr-4 py-2 bg-secondary/50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent w-64 lg:w-96 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <ThemeToggle />
            <button 
              className="text-muted-foreground hover:text-foreground relative p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Avatar className="w-8 h-8 border border-border/50">
                  <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name}`} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-glass border-border/50 overflow-hidden z-50 py-1"
                    >
                      <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-sm font-medium leading-none mb-1">{user?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                      </div>
                      <div className="p-1 border-t border-border/50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative print:overflow-visible">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 print:hidden" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10 print:hidden" />
          
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full relative z-10 print:p-0 print:max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
