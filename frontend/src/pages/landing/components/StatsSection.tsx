import { motion } from 'framer-motion';

const stats = [
  { value: '100K+', label: 'Active Learners' },
  { value: '500+', label: 'Institutions' },
  { value: '2M+', label: 'Notes Generated' },
  { value: '98%', label: 'Success Rate' },
];

export function StatsSection() {
  return (
    <section className="py-12 border-y bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center px-4"
            >
              <h3 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
                {stat.value}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
