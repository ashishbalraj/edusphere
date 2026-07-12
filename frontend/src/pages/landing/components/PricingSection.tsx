import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started with AI-assisted learning.',
    features: [
      { name: 'Basic AI Tutor (50 msgs/mo)', included: true },
      { name: 'Study Notes Generator', included: true },
      { name: '3 Active Courses', included: true },
      { name: 'Auto Quiz Generation', included: false },
      { name: 'Mock Interviews', included: false },
      { name: 'Advanced Analytics', included: false },
    ],
    buttonText: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Everything you need to ace your exams and career.',
    features: [
      { name: 'Unlimited AI Tutor', included: true },
      { name: 'Unlimited Notes & Summaries', included: true },
      { name: 'Unlimited Courses', included: true },
      { name: 'Auto Quiz & Flashcards', included: true },
      { name: 'Resume Builder & Mock Interviews', included: true },
      { name: 'Advanced Analytics', included: true },
    ],
    buttonText: 'Start 7-Day Free Trial',
    popular: true,
  },
  {
    name: 'Institution',
    price: 'Custom',
    description: 'For schools and universities to empower their students.',
    features: [
      { name: 'Everything in Pro for all students', included: true },
      { name: 'Teacher Dashboards', included: true },
      { name: 'Custom Domain & Branding', included: true },
      { name: 'LMS Integration (Canvas, Moodle)', included: true },
      { name: 'Dedicated Success Manager', included: true },
      { name: 'SLA & Priority Support', included: true },
    ],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Simple, transparent <span className="gradient-text">pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Choose the perfect plan for your learning journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? 'md:-translate-y-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge variant="gradient" className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <GlassCard className={`h-full p-8 flex flex-col relative ${plan.popular ? 'border-primary shadow-glow ring-1 ring-primary' : ''}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-display font-black">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-medium">{plan.period}</span>}
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-success" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 text-destructive/50" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="w-full">
                  <Button
                    variant={plan.popular ? 'gradient' : 'outline'}
                    className="w-full h-12 text-lg"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
