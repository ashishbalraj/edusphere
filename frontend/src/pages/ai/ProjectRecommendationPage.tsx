import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  Search,
  Code,
  Database,
  Layout,
  Server,
  Smartphone,
  Cpu,
  ChevronRight,
  Clock,
  Target,
  Sparkles,
  Rocket,
  Loader2
} from 'lucide-react';
import api from '@/services/api';

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'backend', label: 'Backend', icon: Server, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'fullstack', label: 'Full Stack', icon: Code, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'data', label: 'Data Science', icon: Database, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'ai', label: 'AI / ML', icon: Cpu, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'AI Resume Analyzer',
    category: 'fullstack',
    difficulty: 'Advanced',
    duration: '4-6 weeks',
    description: 'Build a full-stack application that accepts PDF resumes, extracts text using OCR, and uses an LLM to score the resume against a job description.',
    tech: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
    milestones: [
      'Set up authentication and file upload',
      'Integrate PDF parsing library',
      'Connect to OpenAI API for scoring',
      'Build dashboard for results visualization'
    ]
  },
  {
    id: 2,
    title: 'Real-time Collaborative Whiteboard',
    category: 'frontend',
    difficulty: 'Intermediate',
    duration: '2-3 weeks',
    description: 'A browser-based whiteboard where multiple users can draw simultaneously. Great for learning WebSocket connections and Canvas API.',
    tech: ['React', 'Socket.io', 'HTML5 Canvas', 'Tailwind'],
    milestones: [
      'Create basic drawing canvas',
      'Implement WebSocket server',
      'Sync drawing events across clients',
      'Add different tools (colors, shapes, text)'
    ]
  },
  {
    id: 3,
    title: 'E-commerce API with Microservices',
    category: 'backend',
    difficulty: 'Advanced',
    duration: '6-8 weeks',
    description: 'Design a robust backend for an e-commerce platform using microservices architecture. Focus on scalability and message queues.',
    tech: ['Go', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Docker'],
    milestones: [
      'Design database schema for Products, Users, Orders',
      'Implement Auth Service (JWT)',
      'Build Order Processing Service with RabbitMQ',
      'Containerize all services with Docker Compose'
    ]
  },
  {
    id: 4,
    title: 'Personal Finance Tracker',
    category: 'mobile',
    difficulty: 'Beginner',
    duration: '1-2 weeks',
    description: 'A mobile app to track daily expenses, categorize spending, and visualize data with simple charts.',
    tech: ['React Native', 'SQLite', 'Recharts'],
    milestones: [
      'Build UI layouts for Home and Add Expense',
      'Set up local SQLite database',
      'Implement CRUD operations for expenses',
      'Add chart visualizations for monthly spending'
    ]
  }
];

export default function ProjectRecommendationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<typeof MOCK_PROJECTS>([]);
  const [selectedProject, setSelectedProject] = useState<typeof MOCK_PROJECTS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: newConv } = await api.post('/ai/conversations', {
          module_type: 'project_recommendation',
          title: 'Project Ideas',
          subject: 'Project Ideas'
        });

        const prompt = `Generate 4 realistic software engineering portfolio projects across different categories.
You MUST return your ENTIRE response as a valid JSON array of objects.
Each object must have these exact keys:
"id": (number),
"title": "Project Title",
"category": "frontend" | "backend" | "fullstack" | "mobile" | "data" | "ai",
"difficulty": "Beginner" | "Intermediate" | "Advanced",
"duration": "1-2 weeks",
"description": "Short description",
"tech": ["React", "Node.js"],
"milestones": ["Milestone 1", "Milestone 2"]
Return ONLY raw JSON, no markdown blocks.`;
        
        const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
          content: prompt
        });

        let jsonStr = responseData.content;
        if (jsonStr.startsWith('`\``json')) {
          jsonStr = jsonStr.replace(/^`\``json\\n/, '').replace(/\\n`\``$/, '');
        } else if (jsonStr.startsWith('`\``')) {
          jsonStr = jsonStr.replace(/^`\``\\n/, '').replace(/\\n`\``$/, '');
        }
        
        const parsed = JSON.parse(jsonStr);
        setProjects(parsed);
      } catch (err) {
        console.error(err);
        setProjects(MOCK_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory ? project.category === selectedCategory : true;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Project Ideas</h1>
          <p className="text-sm text-muted-foreground">AI-curated portfolio projects to boost your resume</p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 w-full bg-secondary/50 border-border rounded-xl"
            placeholder="Search by title or technology (e.g., React, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
              selectedCategory === category.id
                ? `border-${category.color.split('-')[1]}-500 ${category.bg} shadow-sm`
                : 'border-border hover:border-primary/30 bg-card'
            }`}
          >
            <category.icon className={`w-5 h-5 ${category.color}`} />
            <span className="text-xs font-medium text-center">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Curating personalized project recommendations...</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="h-full flex flex-col hover:border-primary/50 transition-colors">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold font-display line-clamp-1">{project.title}</h3>
                      <Badge variant={
                        project.difficulty === 'Beginner' ? 'secondary' :
                        project.difficulty === 'Intermediate' ? 'default' :
                        'destructive'
                      }>
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="w-4 h-4" />
                        {project.duration}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10" onClick={() => setSelectedProject(project)}>
                        View Details <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground absolute inset-0 flex flex-col items-center justify-center">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No projects found matching your criteria.</p>
                <Button variant="link" onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}>Clear filters</Button>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <GlassCard className="flex flex-col h-full border-primary/20 shadow-2xl">
                <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{CATEGORIES.find(c => c.id === selectedProject.category)?.label}</Badge>
                        <Badge variant={
                          selectedProject.difficulty === 'Beginner' ? 'secondary' :
                          selectedProject.difficulty === 'Intermediate' ? 'default' :
                          'destructive'
                        }>
                          {selectedProject.difficulty}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-display font-bold">{selectedProject.title}</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)} className="rounded-full">
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Overview
                    </h3>
                    <p className="text-sm leading-relaxed">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map(tech => (
                        <span key={tech} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium border border-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Implementation Milestones
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-sm">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-secondary/30 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <Clock className="w-4 h-4" /> Estimated Time: {selectedProject.duration}
                  </div>
                  <Button className="gap-2">
                    <Rocket className="w-4 h-4" /> Start Project Space
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
