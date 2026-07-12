import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourseStore } from '@/stores/courseStore';
import { courseService } from '@/services/course';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  FileText,
  PlayCircle,
  BrainCircuit
} from 'lucide-react';
import type { Course } from '@/types';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollInCourse, enrollments, isLoading: isEnrolling } = useCourseStore();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setIsLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  const isEnrolled = enrollments.some(e => e.course_id === id);

  const handleEnroll = async () => {
    if (!id) return;
    try {
      await enrollInCourse(id);
      // Let it automatically re-render based on store changes, or navigate
      navigate('/dashboard/student');
    } catch (err) {
      // Error handled by store
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error loading course</h2>
        <p className="text-muted-foreground mb-6">{error || 'Course not found'}</p>
        <Button onClick={() => navigate('/dashboard/courses')}>Back to Catalog</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <button 
        onClick={() => navigate('/dashboard/courses')}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      {/* Hero Section */}
      <GlassCard className="overflow-hidden bg-gradient-to-br from-secondary/50 to-background border-primary/10">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {course.category || 'General'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                course.difficulty === 'intermediate' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {course.difficulty}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {course.description || "Dive into this comprehensive course and master the skills you need to succeed."}
            </p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{course.enrollment_count} Enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Certificate</span>
              </div>
            </div>

            <div className="pt-4">
              {isEnrolled ? (
                <Button 
                  size="lg"
                  variant="gradient"
                  className="w-full sm:w-auto shadow-glow"
                  onClick={() => navigate(`/dashboard/courses/${id}/learn`)}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Go to Course Player
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="gradient"
                  className="w-full sm:w-auto shadow-glow" 
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now for Free'}
                </Button>
              )}
            </div>
          </div>
          
          <div className="hidden md:block rounded-2xl overflow-hidden bg-secondary relative">
            {course.thumbnail_url ? (
              <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-primary/20 to-purple-500/20">
                <BookOpen className="w-24 h-24 text-primary/30 mb-4" />
                <div className="text-2xl font-display font-bold text-primary/40 text-center px-4">
                  EduSphere AI <br/> Originals
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold font-display mb-4">About This Course</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                {course.description || "This course is designed to provide you with a comprehensive understanding of the topic. You will start with the basics and gradually move to advanced concepts, guided by our intelligent AI ecosystem."}
              </p>
              {course.syllabus && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Syllabus Highlights</h3>
                  <div className="bg-secondary/30 p-4 rounded-lg border border-border whitespace-pre-wrap font-mono text-sm">
                    {course.syllabus}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold font-display mb-6">Course Materials</h2>
            <div className="space-y-4">
              {course.materials && course.materials.length > 0 ? (
                <div className="border border-border rounded-xl overflow-hidden bg-secondary/20 p-4 space-y-2">
                  {course.materials.map((material, idx) => (
                    <div 
                      key={material.id} 
                      onClick={() => isEnrolled && navigate(`/dashboard/courses/${id}/learn`)}
                      className={`flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors cursor-pointer group`}
                    >
                      <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm font-medium">{material.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">Lesson {idx + 1}</span>
                    </div>
                  ))}
                  <div 
                    onClick={() => isEnrolled && navigate(`/dashboard/courses/${id}/learn`)}
                    className="flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors cursor-pointer group border-t border-border/50 pt-3 mt-2"
                  >
                    <BrainCircuit className="w-5 h-5 text-muted-foreground group-hover:text-purple-500" />
                    <span className="text-sm font-semibold">Course Review Quiz</span>
                    <span className="ml-auto text-xs text-muted-foreground">Final Step</span>
                  </div>
                </div>
              ) : (
                /* Dummy Materials for visual representation if none exist */
                [1, 2, 3].map((mod) => (
                  <div key={mod} className="border border-border rounded-xl overflow-hidden bg-secondary/20">
                    <div className="p-4 flex items-center justify-between bg-secondary/50">
                      <h3 className="font-semibold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                          {mod}
                        </div>
                        Module {mod}: Core Concepts
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer group">
                        <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm font-medium">Introduction to the Module</span>
                        <span className="ml-auto text-xs text-muted-foreground">10:00</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer group">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-purple-500" />
                        <span className="text-sm font-medium">Reading Material & Exercises</span>
                        <span className="ml-auto text-xs text-muted-foreground">PDF</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold text-lg mb-4">Course Features</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span>Self-paced learning</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                </div>
                <span>AI Tutor Integrated</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-500" />
                </div>
                <span>Smart Notes Generation</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
