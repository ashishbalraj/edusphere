import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Code2,
  Send,
  Bot,
  User,
  Bug,
  Zap,
  BookOpen,
  Copy,
  Check,
  Wrench,
  Loader2
} from 'lucide-react';


const INITIAL_CODE = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
console.log(fibonacci(10));`;

import { useAIChat } from '@/hooks/useAIChat';

export default function CodingMentorPage() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [language, setLanguage] = useState('javascript');
  
  const { messages, isTyping, sendMessage: sendAIChatMessage } = useAIChat({
    moduleType: 'coding_mentor',
    title: 'Code Review Session',
    subject: language,
    initialMessage: "Hi! I'm your AI Coding Mentor. Paste your code on the left and ask me to explain, optimize, or debug it."
  });
  
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    const hiddenContext = `Code Context:\n\`\`\`${language}\n${code}\n\`\`\``;
    sendAIChatMessage(content, hiddenContext);
    setInputValue('');
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6 w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 shrink-0"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-indigo-500">
          <Code2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Coding Mentor</h1>
          <p className="text-sm text-muted-foreground">AI pair programming and code review</p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Code Editor Side */}
        <GlassCard className="lg:w-1/2 flex flex-col min-h-0 overflow-hidden bg-[#1E1E1E]">
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20">
            <div className="flex gap-2">
              {['javascript', 'python', 'typescript'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-colors ${
                    language === lang 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={copyCode} className="h-8 gap-2 text-gray-400 hover:text-white">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="flex-1 relative">
            {/* Simple textarea pretending to be a code editor for MVP */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="absolute inset-0 w-full h-full p-6 bg-transparent text-gray-300 font-mono text-sm leading-relaxed focus:outline-none resize-none"
              spellCheck="false"
            />
          </div>
          <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-none"
              onClick={() => sendMessage("Can you explain how this code works?")}
            >
              <BookOpen className="w-4 h-4" /> Explain
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-none"
              onClick={() => sendMessage("Can you find any bugs or issues in this code?")}
            >
              <Bug className="w-4 h-4" /> Debug
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 gap-2 bg-white/5 hover:bg-white/10 text-white border-none"
              onClick={() => sendMessage("How can I optimize this code for better performance?")}
            >
              <Zap className="w-4 h-4" /> Optimize
            </Button>
          </div>
        </GlassCard>

        {/* Chat Side */}
        <GlassCard className="lg:w-1/2 flex flex-col min-h-0">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-md'
                        : 'bg-secondary/50 rounded-tl-md'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-border">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0 mt-1">
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary/50 rounded-2xl rounded-tl-md px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Analyzing code...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(inputValue); }}
              className="flex gap-3"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about the code..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!inputValue.trim() || isTyping} className="gap-2 px-6">
                <Send className="w-4 h-4" />
                Send
              </Button>
            </form>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
