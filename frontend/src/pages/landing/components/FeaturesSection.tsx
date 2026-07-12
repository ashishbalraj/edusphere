import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import {
  MessageSquare,
  FileText,
  HelpCircle,
  Briefcase,
  Layers,
  BarChart,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Interactive AI Tutor',
    description: 'Get instant, personalized help 24/7. Ask questions, clarify doubts, and learn at your own pace.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'Smart Document Intelligence',
    description: 'Upload any PDF or doc. Our AI instantly extracts summaries, key points, and generates study notes.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: HelpCircle,
    title: 'Auto Quiz Generation',
    description: 'Turn your notes into interactive quizzes and flashcards automatically to test your knowledge.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Briefcase,
    title: 'Career & Resume Builder',
    description: 'AI-driven resume optimization and mock interviews to prepare you for your dream job.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Layers,
    title: 'Adaptive Study Plans',
    description: 'Intelligent scheduling that adapts to your learning speed and upcoming exam deadlines.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description: 'Track your progress, identify weak areas, and get actionable insights to improve your grades.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Everything you need to <span className="gradient-text">excel</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            A complete suite of AI-powered tools designed to supercharge your learning, from note-taking to career prep.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassCard className="h-full p-8 group hover:border-primary/50 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
