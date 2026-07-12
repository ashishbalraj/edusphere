import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/stores/courseStore';
import { GlassCard } from '@/components/ui/card';
import { Search, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function CourseCatalog() {
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Course Catalog
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Discover Your Next <span className="gradient-text">Passion</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore our expert-curated courses designed to take your skills to the next level.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-2xl backdrop-blur-sm border border-border/50">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </motion.div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="h-80 animate-pulse bg-secondary/50 border-border/10" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <motion.div key={course.id} variants={itemVariants}>
              <Link to={`/dashboard/courses/${course.id}`} className="block h-full group">
                <GlassCard className="h-full flex flex-col transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow overflow-hidden">
                  {/* Thumbnail Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-secondary to-primary/10 relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <BookOpen className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${
                        course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        course.difficulty === 'intermediate' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="bg-secondary px-2 py-0.5 rounded text-foreground">{course.category || 'General'}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {course.description || "No description provided."}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollment_count} enrolled</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <ArrowRight className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </motion.div>
  );
}
