import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI Tutor work?',
    answer: 'The AI Tutor is powered by an advanced LLM fine-tuned for education. It understands the context of your courses, notes, and previous questions to provide highly personalized, step-by-step explanations without just giving away the answers.',
  },
  {
    question: 'Can I upload my own study materials?',
    answer: 'Yes! You can upload PDFs, Word documents, and PowerPoints. Our AI will instantly analyze them to extract summaries, key concepts, and automatically generate quizzes and flashcards for you to study.',
  },
  {
    question: 'Is it suitable for high school students or just college?',
    answer: 'EduSphere AI adapts to your level. During onboarding, you select your grade level and subjects. The AI calibrates its language and complexity to match, making it perfect for both high schoolers and university students.',
  },
  {
    question: 'Do you offer plans for entire schools?',
    answer: 'Yes, our Institution plan provides bulk licensing, custom branding, integration with your existing LMS (like Canvas or Moodle), and dedicated teacher dashboards to monitor student engagement.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. There are no long-term commitments for the Pro plan. You can cancel your subscription from your billing settings at any time.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 relative bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 md:p-8 rounded-2xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
