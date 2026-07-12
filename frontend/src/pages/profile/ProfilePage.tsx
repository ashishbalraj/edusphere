import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Bell,
  Mail,
  LogOut,
  Camera
} from 'lucide-react';

type Tab = 'account' | 'preferences' | 'security' | 'subscription';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: 'account', label: 'Account Details', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.form
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSave}
            className="space-y-6"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-glass">
                  <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name}`} />
                  <AvatarFallback className="text-2xl">{user?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">{user?.full_name}</h3>
                <p className="text-muted-foreground capitalize">{user?.role}</p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" type="button">Change Avatar</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={user?.full_name} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} className="bg-background/50" disabled />
                <p className="text-[10px] text-muted-foreground">Contact support to change your email.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" variant="gradient" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.form>
        );

      case 'preferences':
        return (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20">
                <div>
                  <p className="font-medium">Theme Preferences</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive weekly digest and updates.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Get instant alerts for assignments.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" required className="bg-background/50" />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>

            <div className="pt-8 border-t border-border/50">
              <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </motion.div>
        );

      case 'subscription':
        return (
          <motion.div
            key="subscription"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <CreditCard className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Current Plan</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold font-display">Pro Tier</span>
                <span className="text-muted-foreground mb-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                You have unlimited access to all AI tools, advanced analytics, and priority support.
              </p>
              <div className="flex gap-3">
                <Button variant="gradient">Manage Billing</Button>
                <Button variant="outline">View Invoice History</Button>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="py-6 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-orange-500" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and profile details.</p>
        </div>
        <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          <GlassCard className="p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
