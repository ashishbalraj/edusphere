import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Send,
  User,
  TrendingUp,
  Target,
  Compass,
} from 'lucide-react';

import { useAIChat } from '@/hooks/useAIChat';


const SUGGESTIONS = [
  "How do I transition from frontend to full-stack?",
  "What's the current average salary for a Junior React Dev?",
  "Can you review my elevator pitch?",
  "What skills should I learn in 2024?",
];

export default function CareerCoachPage() {
  const { messages, isTyping, sendMessage } = useAIChat({
    moduleType: 'career',
    title: 'Career Coaching Session',
    subject: 'Career Development',
    initialMessage: "Hi! I'm your AI Career Coach. Whether you're looking to switch careers, ask for a raise, or plan your long-term goals, I'm here to help. What's on your mind today?",
  });

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    setInputValue('');
    await sendMessage(content);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Career Coach</h1>
            <p className="text-sm text-muted-foreground">AI guidance for your professional journey</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 shrink-0 hidden lg:flex flex-col gap-4"
        >
          <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" /> Market Insights
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Top Tech Skill 2024</p>
                <p className="font-medium text-sm">Generative AI Integration</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Fastest Growing Role</p>
                <p className="font-medium text-sm">AI Engineer (+74% YoY)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Remote Work Trend</p>
                <p className="font-medium text-sm">Stabilized at 32% of tech roles</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" /> Recommended Topics
            </h3>
            <div className="space-y-2 flex-1">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(suggestion)}
                  className="w-full text-left p-3 text-sm rounded-xl border border-border bg-secondary/30 hover:bg-secondary hover:border-primary/50 transition-all group"
                >
                  <p className="line-clamp-2 text-muted-foreground group-hover:text-foreground">
                    "{suggestion}"
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Chat Interface */}
        <GlassCard className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" 
               style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />

          <ScrollArea className="flex-1 p-6 relative z-10">
            <div className="space-y-6 max-w-3xl mx-auto pb-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Compass className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-background border border-border rounded-tl-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-secondary/50">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border relative z-10">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
              className="flex gap-3 max-w-3xl mx-auto relative"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for career advice, salary info, or interview tips..."
                className="flex-1 pr-12 rounded-xl border-border bg-secondary/50 focus:bg-background"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!inputValue.trim() || isTyping} 
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-lg"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-muted-foreground">AI can make mistakes. Verify important salary or career data.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
