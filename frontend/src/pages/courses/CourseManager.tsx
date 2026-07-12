import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '@/stores/courseStore';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Globe,
  Lock,
  Users,
  X
} from 'lucide-react';

export default function CourseManager() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourses, updateCourse, createMaterial, deleteMaterial, isLoading } = useCourseStore();

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, []);

  useEffect(() => {
    if (course && course.materials) {
      setLessonOrder(course.materials.length);
    }
  }, [course]);

  if (!course) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading course workspace...</p>
      </div>
    );
  }

  const handleTogglePublish = async () => {
    try {
      await updateCourse(course.id, {
        is_published: !course.is_published,
      });
    } catch (err) {
      // Handled in store
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    setError(null);
    try {
      await createMaterial(course.id, {
        title: lessonTitle,
        description: lessonDesc,
        content: lessonContent,
        order: lessonOrder,
      });
      // Reset form
      setLessonTitle('');
      setLessonDesc('');
      setLessonContent('');
      setShowAddLessonModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (materialId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteMaterial(course.id, materialId);
      } catch (err) {
        // Handled in store
      }
    }
  };

  const materials = course.materials || [];
  const sortedMaterials = [...materials].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/dashboard/teacher"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold leading-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-1">Course Management Workspace</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant={course.is_published ? 'outline' : 'default'}
            onClick={handleTogglePublish}
            disabled={isLoading}
            className="h-10 text-sm font-semibold"
          >
            {course.is_published ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Unpublish Draft
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2 text-primary" />
                Publish Course
              </>
            )}
          </Button>
          <Button variant="gradient" onClick={() => setShowAddLessonModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </Button>
        </div>
      </div>

      {/* Course Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4 border-primary/10">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
            <h3 className="text-2xl font-bold">{course.enrollment_count}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4 border-primary/10">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Lessons</p>
            <h3 className="text-2xl font-bold">{materials.length}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4 border-primary/10">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            {course.is_published ? <Globe className="w-6 h-6 text-green-500" /> : <Lock className="w-6 h-6 text-warning" />}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <h3 className="text-2xl font-bold">{course.is_published ? 'Published' : 'Draft'}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Course Lessons List */}
      <GlassCard className="p-6 border-primary/10">
        <h2 className="text-xl font-bold font-display mb-6">Course Lessons & Syllabus</h2>

        {sortedMaterials.length > 0 ? (
          <div className="space-y-4">
            {sortedMaterials.map((material, idx) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-secondary/15 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{material.title}</h3>
                    <p className="text-xs text-muted-foreground">{material.description || 'No description provided.'}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLesson(material.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground bg-secondary/10 py-10 rounded-lg text-center border border-dashed">
            No lessons created yet. Click "Add Lesson" to start writing your syllabus.
          </div>
        )}
      </GlassCard>

      {/* Create Lesson Modal */}
      <AnimatePresence>
        {showAddLessonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl"
            >
              <GlassCard className="p-6 m-4 max-h-[90vh] overflow-y-auto border-primary/20 flex flex-col">
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                  <h3 className="text-xl font-bold font-display text-foreground">Add New Lesson</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowAddLessonModal(false)} className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleAddLesson} className="space-y-4">
                  {error && <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg">{error}</div>}

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <Label htmlFor="lessonTitle">Lesson Title</Label>
                      <Input
                        id="lessonTitle"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        placeholder="e.g. Introduction to Variables"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lessonOrder">Order Index</Label>
                      <Input
                        id="lessonOrder"
                        type="number"
                        value={lessonOrder}
                        onChange={(e) => setLessonOrder(parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lessonDesc">Short Description</Label>
                    <Input
                      id="lessonDesc"
                      value={lessonDesc}
                      onChange={(e) => setLessonDesc(e.target.value)}
                      placeholder="What this lesson covers..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lessonContent">Lesson Content (Markdown Supported)</Label>
                    <textarea
                      id="lessonContent"
                      value={lessonContent}
                      onChange={(e) => setLessonContent(e.target.value)}
                      placeholder="Write your lesson notes here..."
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => setShowAddLessonModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="gradient" disabled={isLoading} className="shadow-glow">
                      {isLoading ? 'Saving...' : 'Save Lesson'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
