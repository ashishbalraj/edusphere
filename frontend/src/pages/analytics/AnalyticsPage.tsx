import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart3, TrendingUp, Clock, BookOpen, Target, Loader2 } from 'lucide-react';
import api from '@/services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/student/me');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Line Chart (Study Hours)
  const lineChartData = {
    labels: data?.study_activity.map((a: any) => a.label) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Hours',
        data: data?.study_activity.map((a: any) => a.hours) || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(99, 102, 241)', // primary
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(150, 150, 150, 0.1)' },
        border: { display: false },
        ticks: { color: 'rgba(150, 150, 150, 0.7)' }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: 'rgba(150, 150, 150, 0.7)' }
      }
    }
  };

  // Bar Chart (Subject Scores)
  const barChartData = {
    labels: data?.performance_by_subject.map((p: any) => p.subject) || [],
    datasets: [
      {
        label: 'Average Score (%)',
        data: data?.performance_by_subject.map((p: any) => p.score) || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Primary
          'rgba(168, 85, 247, 0.8)', // Purple
          'rgba(34, 197, 94, 0.8)',  // Green
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(249, 115, 22, 0.8)', // Orange
        ],
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 13 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(150, 150, 150, 0.1)' },
        border: { display: false },
        ticks: { color: 'rgba(150, 150, 150, 0.7)' }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: 'rgba(150, 150, 150, 0.7)' }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-1">Track your learning progress and performance metrics.</p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Study Hours</p>
                  <h3 className="text-2xl font-bold">{data?.total_study_hours || 0}h</h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Assessment Score</p>
                  <h3 className="text-2xl font-bold">{data?.avg_assessment_score || 0}%</h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                  <h3 className="text-2xl font-bold">{data?.courses_completed || 0}</h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                  <h3 className="text-2xl font-bold">{data?.current_streak || 0} Days</h3>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <h2 className="text-xl font-display font-bold mb-6">Study Activity (This Week)</h2>
              <div className="h-[300px] w-full">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-6">
              <h2 className="text-xl font-display font-bold mb-6">Performance by Subject</h2>
              <div className="h-[300px] w-full">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
