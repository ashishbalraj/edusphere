import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCourseStore } from '@/stores/courseStore';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  MessageSquare,
  MoreVertical,
  Plus,
  Settings,
  X
} from 'lucide-react';

const recentSubmissions = [
  { student: 'Alex Johnson', course: 'Machine Learning Basics', assignment: 'Neural Networks Quiz', score: '95%', status: 'Graded', date: '2 hours ago' },
  { student: 'Sarah Smith', course: 'Data Structures & Algorithms', assignment: 'Binary Trees Assignment', score: 'Pending', status: 'Needs Review', date: '4 hours ago' },
  { student: 'Michael Brown', course: 'Advanced System Design', assignment: 'Microservices Case Study', score: '88%', status: 'Graded', date: 'Yesterday' },
  { student: 'Emily Davis', course: 'Machine Learning Basics', assignment: 'Neural Networks Quiz', score: '92%', status: 'Graded', date: 'Yesterday' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courses, fetchCourses, createCourse, isLoading } = useCourseStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [syllabus, setSyllabus] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses created by this teacher
  const teacherCourses = courses.filter((c) => c.teacher_id === user?.id);
  
  // Dynamic stats
  const totalStudents = teacherCourses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);
  const courseCount = teacherCourses.length;

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    try {
      await createCourse({
        title,
        category: category || 'General',
        description,
        difficulty,
        syllabus,
        is_published: false, // Default to draft
        thumbnail_url: thumbnailUrl || null,
      });
      // Reset form
      setTitle('');
      setCategory('');
      setDescription('');
      setDifficulty('beginner');
      setSyllabus('');
      setThumbnailUrl('');
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, Prof. {user?.full_name?.split(' ')[1] || 'Teacher'}. Here's what's happening in your classes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-background/50 border-border/50">
            <MessageSquare className="w-4 h-4 mr-2" />
            Broadcast
          </Button>
          <Button variant="gradient" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Students</p>
          <h3 className="text-3xl font-bold mt-1">{totalStudents}</h3>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">My Courses</p>
          <h3 className="text-3xl font-bold mt-1">{courseCount}</h3>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-xs font-medium text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +4%
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Class Average</p>
          <h3 className="text-3xl font-bold mt-1">84%</h3>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
          <h3 className="text-3xl font-bold mt-1">4</h3>
        </GlassCard>
      </motion.div>

      {/* Courses List */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-bold font-display">My Active Courses</h2>
        {isLoading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading courses...</div>
        ) : teacherCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherCourses.map((c) => (
              <GlassCard key={c.id} className="overflow-hidden flex flex-col border-primary/10">
                <div className="h-32 bg-secondary relative">
                  {c.thumbnail_url ? (
                    <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                    c.is_published ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] text-primary uppercase font-bold tracking-wide">{c.category}</span>
                    <h3 className="font-bold text-lg leading-tight mt-1 line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <span>{c.enrollment_count} Enrolled</span>
                    <Link to={`/dashboard/teacher/courses/${c.id}`}>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground bg-secondary/50 p-6 rounded-lg text-center border border-dashed border-border">
            You haven't created any courses yet. Click "New Course" to start sharing your knowledge!
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Submissions Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Recent Submissions</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Assignment</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 rounded-r-lg font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub, idx) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-4 font-medium">{sub.student}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{sub.assignment}</p>
                        <p className="text-xs text-muted-foreground">{sub.course}</p>
                      </td>
                      <td className="px-4 py-4">{sub.score}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'Graded' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions & AI Helpers */}
        <motion.div variants={itemVariants} className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold font-display mb-4">AI Assistants</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 bg-background/50 group">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                </div>
                Generate Quiz from Syllabus
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 bg-background/50 group">
                <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4 text-purple-500 group-hover:text-white" />
                </div>
                Create Lesson Plan
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 bg-background/50 group">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4 text-green-500 group-hover:text-white" />
                </div>
                Draft Student Feedback
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Insight
            </h3>
            <p className="text-sm text-muted-foreground">
              Students in "Data Structures & Algorithms" are struggling with Binary Trees. We recommend generating a simplified review quiz.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary mt-2">
              Generate Review Quiz &rarr;
            </Button>
          </GlassCard>
        </motion.div>
      </div>

      {/* 4. Create Course Modal Dialog */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <GlassCard className="p-6 m-4 max-h-[90vh] overflow-y-auto border-primary/20 flex flex-col">
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                  <h3 className="text-xl font-bold font-display text-foreground">Create New Course</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleCreateCourse} className="space-y-4">
                  {error && <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg">{error}</div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Intro to Computer Science"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Coding, Math"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                      <Input
                        id="thumbnailUrl"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description">Short Description</Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief summary of what this course covers..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="syllabus">Syllabus Details (One per line)</Label>
                    <textarea
                      id="syllabus"
                      value={syllabus}
                      onChange={(e) => setSyllabus(e.target.value)}
                      placeholder="e.g. Week 1: Introduction&#10;Week 2: Advanced Topics"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gradient" disabled={isLoading} className="shadow-glow">
                      {isLoading ? 'Creating...' : 'Create Course'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

