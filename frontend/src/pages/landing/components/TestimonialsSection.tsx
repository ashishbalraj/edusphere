import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Computer Science Student',
    content: "EduSphere AI completely changed how I study. The AI Tutor explains complex algorithms better than my professors. My grades have improved significantly.",
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'Dr. Michael Chen',
    role: 'University Professor',
    content: "I use the auto-quiz generator for all my classes now. It saves me hours of work every week and gives my students instant feedback. Phenomenal platform.",
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Recent Graduate',
    content: "The resume builder and mock interview modules were instrumental in helping me land my first software engineering job at a top tech company.",
    avatar: 'ER',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Loved by learners <br />
            <span className="gradient-text">worldwide</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="h-full p-8 flex flex-col">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-lg italic text-muted-foreground mb-8 flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${testimonial.name}`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
