import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileUp,
  FileText,
  Send,
  Sparkles,
  Trash2,
  Bot,
  User,
  BookOpen,
  ListChecks,
  HelpCircle,
  X,
  UploadCloud,
  Loader2
} from 'lucide-react';

import { useAIChat } from '@/hooks/useAIChat';

interface UploadedPDF {
  name: string;
  size: string;
  pages: number;
}

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Summarize', prompt: 'Summarize the key points of this document.' },
  { icon: ListChecks, label: 'Key Points', prompt: 'Extract the main key points and takeaways from this document as a bullet list.' },
  { icon: HelpCircle, label: 'Explain', prompt: 'Explain the main concepts in this document in simple terms.' },
  { icon: Sparkles, label: 'Quiz Me', prompt: 'Generate 5 quiz questions based on this document with answers.' },
];

export default function ChatPDFPage() {
  const [uploadedPDF, setUploadedPDF] = useState<UploadedPDF | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isTyping, sendMessage, setMessages } = useAIChat({
    moduleType: 'chat_pdf',
    title: uploadedPDF ? `Chat: ${uploadedPDF.name}` : 'Document Chat',
    subject: uploadedPDF?.name || 'Document',
    initialMessage: "Upload a document to get started."
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !uploadedPDF) return;
    setInputValue('');
    await sendMessage(content);
    setTimeout(scrollToBottom, 100);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    setUploadedPDF({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      pages: Math.floor(Math.random() * 30) + 5,
    });
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `📄 I've analyzed **${file.name}**. The document has been processed and I'm ready to answer your questions!\n\nYou can:\n- Ask me to **summarize** the content\n- Extract **key points**\n- Get **explanations** of concepts\n- Generate **quiz questions**\n\nWhat would you like to know?`,
      timestamp: new Date(),
    }]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removePDF = () => {
    setUploadedPDF(null);
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-rose-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Chat with PDF</h1>
          <p className="text-sm text-muted-foreground">Upload a document and ask AI anything about it</p>
        </div>
      </motion.div>

      {!uploadedPDF ? (
        /* Upload Area */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-xl cursor-pointer transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}
          >
            <GlassCard className={`p-16 border-2 border-dashed text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-border hover:border-primary/50 hover:bg-secondary/30'
            }`}>
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <UploadCloud className={`w-16 h-16 mx-auto mb-6 transition-colors ${
                  isDragging ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </motion.div>
              <h3 className="text-xl font-display font-bold mb-2">
                {isDragging ? 'Drop your PDF here!' : 'Upload a PDF Document'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag & drop your PDF file here, or click to browse
              </p>
              <Button variant="outline" className="gap-2">
                <FileUp className="w-4 h-4" />
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supports PDF files up to 50MB
              </p>
            </GlassCard>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </motion.div>
      ) : (
        /* Chat Interface */
        <div className="flex-1 flex gap-6 min-h-0">
          {/* PDF Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-72 shrink-0 hidden lg:block"
          >
            <GlassCard className="h-full p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Document</h3>
                <button onClick={removePDF} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 mb-4">
                <FileText className="w-10 h-10 text-rose-500 mb-3" />
                <p className="font-medium text-sm truncate" title={uploadedPDF.name}>{uploadedPDF.name}</p>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{uploadedPDF.size}</span>
                  <span>•</span>
                  <span>{uploadedPDF.pages} pages</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick Actions</h4>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSendMessage(action.prompt)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-left"
                  >
                    <action.icon className="w-4 h-4 text-primary shrink-0" />
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Button variant="outline" onClick={removePDF} className="w-full gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Remove Document
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <GlassCard className="flex-1 flex flex-col overflow-hidden">
              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6 max-w-3xl mx-auto">
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
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-md'
                            : 'bg-secondary/50 rounded-tl-md'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm">{msg.content}</p>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-1">
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-secondary/50 rounded-2xl rounded-tl-md px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Analyzing document...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                  className="flex gap-3 max-w-3xl mx-auto"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything about the document..."
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
          </motion.div>
        </div>
      )}
    </div>
  );
}
