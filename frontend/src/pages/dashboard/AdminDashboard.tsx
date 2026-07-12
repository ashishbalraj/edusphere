import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  DollarSign,
  Activity,
  ShieldCheck,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Database
} from 'lucide-react';

const MOCK_STATS = [
  { label: 'Total Users', value: '12,482', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Courses', value: '845', change: '+5%', icon: BookOpen, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'Monthly Revenue', value: '$45,230', change: '+18%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const MOCK_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active', joinDate: '2023-10-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'teacher', status: 'active', joinDate: '2023-11-02' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', status: 'suspended', joinDate: '2024-01-20' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'admin', status: 'active', joinDate: '2023-09-01' },
  { id: 5, name: 'Evan Davis', email: 'evan@example.com', role: 'teacher', status: 'pending', joinDate: '2024-02-28' },
];

const MOCK_COURSES = [
  { id: 1, title: 'Advanced React Patterns', author: 'Bob Smith', status: 'pending_review', date: '2024-03-01' },
  { id: 2, title: 'Machine Learning 101', author: 'Dr. Alan Turing', status: 'reported', date: '2024-02-25' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'system'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Admin Control Center</h1>
            <p className="text-sm text-muted-foreground">Manage users, content, and system settings</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span className="text-xs font-medium text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['overview', 'users', 'moderation', 'system'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 capitalize ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[500px]"
      >
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-6 h-96 flex items-center justify-center border-dashed">
              <div className="text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Revenue & Growth Chart Placeholder</p>
                <p className="text-sm">(Requires Recharts integration)</p>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="font-medium">New user registered</p>
                      <p className="text-muted-foreground text-xs">2 minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'users' && (
          <GlassCard className="overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 h-9"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="sm">Export CSV</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map(user => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.joinDate}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Reviews & Reports
            </h3>
            <div className="grid gap-4">
              {MOCK_COURSES.map(course => (
                <GlassCard key={course.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant={course.status === 'reported' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                        {course.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{course.date}</span>
                    </div>
                    <h4 className="font-bold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">Author: {course.author}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 text-green-500 hover:text-green-600 hover:bg-green-500/10 border-green-500/20">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 md:flex-none gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                    <Button variant="secondary" size="sm">Review Details</Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" /> Server Status
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span className="font-medium text-green-500">24%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory (RAM)</span>
                    <span className="font-medium text-amber-500">68%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span className="font-medium text-primary">45%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Database Services
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="font-medium text-sm">PostgreSQL (Primary)</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Latency: 12ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="font-medium text-sm">Redis Cache</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Latency: 2ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <span className="font-medium text-sm">ChromaDB (Vector)</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Latency: 45ms</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>
    </div>
  );
}
