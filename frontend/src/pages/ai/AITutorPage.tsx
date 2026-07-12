import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Bot,
  Paperclip,
  Sparkles,
  BookOpen,
  Code,
  Calculator,
  RefreshCcw
} from 'lucide-react';

import { useAIChat } from '@/hooks/useAIChat';

const suggestedPrompts = [
  { icon: Calculator, text: "Explain backpropagation like I'm 5" },
  { icon: Code, text: "How does React's virtual DOM work?" },
  { icon: BookOpen, text: "Summarize the causes of World War 1" },
];

export default function AITutorPage() {
  const { user } = useAuth();
  const { messages, isTyping, sendMessage, resetChat } = useAIChat({
    moduleType: 'tutor',
    title: 'Tutoring Session',
    subject: 'General Education',
    initialMessage: "Hello! I'm your AI Tutor. I can help you understand complex topics, solve problems, or prepare for exams. What would you like to learn today?"
  });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            AI Tutor
          </h1>
          <p className="text-muted-foreground mt-1">Your personal academic assistant, available 24/7.</p>
        </div>
        <Button variant="outline" onClick={resetChat} className="hidden sm:flex">
          <RefreshCcw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <GlassCard className="flex-1 flex flex-col overflow-hidden border-primary/10">
        <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
          <div className="space-y-6 max-w-3xl mx-auto pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8 shrink-0 border border-border/50">
                    {msg.role === 'assistant' ? (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    ) : (
                      <>
                        <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name}`} />
                        <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-glow'
                        : 'bg-secondary/50 backdrop-blur-sm rounded-tl-sm border border-border/50'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/50">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <Avatar className="w-8 h-8 shrink-0 border border-border/50">
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                </Avatar>
                <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl rounded-tl-sm border border-border/50 px-5 py-4 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-border/50 bg-background/50 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedPrompts.map((prompt, i) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt.text)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                    >
                      <Icon className="w-3 h-3" />
                      {prompt.text}
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="relative flex items-end gap-2">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Ask anything..."
                  className="pr-12 py-6 bg-secondary/30 border-border/50 focus-visible:ring-primary/30 rounded-xl"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="gradient"
                size="icon"
                className="h-[52px] w-[52px] shrink-0 rounded-xl shadow-glow"
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? <Sparkles className="w-5 h-5 animate-spin-slow" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-3">
              AI Tutor can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
