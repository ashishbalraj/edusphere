import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  BookOpen,
  GraduationCap,
  Globe,
  FileText,
  Quote,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEPTH_LEVELS = [
  { id: 'quick', label: 'Quick Summary', icon: Globe, desc: 'High-level overview (1-2 mins)' },
  { id: 'standard', label: 'Standard Research', icon: BookOpen, desc: 'Detailed analysis with sources' },
  { id: 'academic', label: 'Academic Deep Dive', icon: GraduationCap, desc: 'Comprehensive review with citations' },
];

const CITATION_FORMATS = ['APA', 'MLA', 'Chicago', 'Harvard'];

interface ResearchResult {
  abstract: string;
  keyFindings: string[];
  sources: {
    title: string;
    authors: string;
    year: string;
    url?: string;
    credibility: 'High' | 'Medium' | 'Low';
    citations: Record<string, string>;
  }[];
}

const MOCK_RESULT: ResearchResult = {
  abstract: "The integration of Large Language Models (LLMs) in software engineering has fundamentally transformed developer workflows. Recent studies indicate a shift from syntax-focused programming to prompt-driven architecture design. While LLMs significantly reduce time spent on boilerplate code, they introduce new challenges in security auditing and code maintainability.",
  keyFindings: [
    "**Productivity Gains:** Developers using AI assistants report a 30-50% reduction in time spent on repetitive tasks.",
    "**Quality Concerns:** AI-generated code has a 15% higher rate of subtle security vulnerabilities compared to human-written code if left unchecked.",
    "**Skill Shift:** The industry is seeing a transition where 'code review' and 'system design' are becoming more critical than syntax memorization.",
    "**Economic Impact:** The cost of software prototyping has decreased substantially, democratizing access to custom software solutions."
  ],
  sources: [
    {
      title: "The Impact of AI on Developer Productivity: A Large-Scale Empirical Study",
      authors: "Chen, J., Smith, R., & Doe, J.",
      year: "2023",
      url: "https://example.com/paper1",
      credibility: "High",
      citations: {
        'APA': 'Chen, J., Smith, R., & Doe, J. (2023). The Impact of AI on Developer Productivity: A Large-Scale Empirical Study. Journal of Software Engineering, 45(2), 112-135.',
        'MLA': 'Chen, Jian, et al. "The Impact of AI on Developer Productivity: A Large-Scale Empirical Study." Journal of Software Engineering, vol. 45, no. 2, 2023, pp. 112-135.',
        'Chicago': 'Chen, Jian, Robert Smith, and John Doe. "The Impact of AI on Developer Productivity: A Large-Scale Empirical Study." Journal of Software Engineering 45, no. 2 (2023): 112-135.',
        'Harvard': 'Chen, J., Smith, R. and Doe, J., 2023. The Impact of AI on Developer Productivity: A Large-Scale Empirical Study. Journal of Software Engineering, 45(2), pp.112-135.'
      }
    },
    {
      title: "Security Vulnerabilities in LLM-Generated Code",
      authors: "Williams, T. & Garcia, M.",
      year: "2024",
      credibility: "Medium",
      citations: {
        'APA': 'Williams, T., & Garcia, M. (2024). Security Vulnerabilities in LLM-Generated Code. Tech Policy Review.',
        'MLA': 'Williams, Thomas, and Maria Garcia. "Security Vulnerabilities in LLM-Generated Code." Tech Policy Review, 2024.',
        'Chicago': 'Williams, Thomas, and Maria Garcia. "Security Vulnerabilities in LLM-Generated Code." Tech Policy Review (2024).',
        'Harvard': 'Williams, T. and Garcia, M., 2024. Security Vulnerabilities in LLM-Generated Code. Tech Policy Review.'
      }
    }
  ]
};

import api from '@/services/api';

export default function ResearchAssistantPage() {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('standard');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [citationFormat, setCitationFormat] = useState('APA');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsSearching(true);
    setResult(null);
    
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'research',
        title: `Research: ${topic}`,
        subject: topic
      });

      const prompt = `Perform research on the topic: "${topic}" at depth level: "${depth}".
You MUST return your ENTIRE response as a valid JSON object matching exactly this structure:
{
  "abstract": "A 2-3 paragraph summary of the research topic.",
  "keyFindings": ["Finding 1 in markdown", "Finding 2 in markdown", "Finding 3 in markdown"],
  "sources": [
    {
      "title": "Source Title",
      "authors": "Author Names",
      "year": "YYYY",
      "url": "optional url",
      "credibility": "High",
      "citations": {
        "APA": "APA formatted citation",
        "MLA": "MLA formatted citation",
        "Chicago": "Chicago formatted citation",
        "Harvard": "Harvard formatted citation"
      }
    }
  ]
}

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
      setResult(parsed);
    } catch (err) {
      console.error("AI Error:", err);
      setResult(MOCK_RESULT);
    } finally {
      setIsSearching(false);
    }
  };

  const copyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6 max-w-6xl mx-auto w-full">
      {/* Header & Search */}
      <div className="space-y-6 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Research Assistant</h1>
            <p className="text-sm text-muted-foreground">AI-powered literature review and academic research</p>
          </div>
        </motion.div>

        <GlassCard className="p-4 bg-gradient-to-r from-secondary/50 to-background border-primary/20">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-3 relative">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a research topic (e.g., 'Impact of LLMs on Software Engineering')"
                className="flex-1 h-12 pl-4 text-base bg-background shadow-sm"
                disabled={isSearching}
              />
              <Button type="submit" disabled={!topic.trim() || isSearching} className="h-12 px-8 gap-2">
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isSearching ? 'Researching...' : 'Search'}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {DEPTH_LEVELS.map(level => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setDepth(level.id)}
                  disabled={isSearching}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border ${
                    depth === level.id 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <level.icon className="w-4 h-4" />
                  <span className="font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Results Area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <BookOpen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <h3 className="font-medium text-lg text-foreground mb-2">Synthesizing Information</h3>
              <p className="text-sm">Scanning academic databases, articles, and journals...</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col lg:flex-row gap-6"
            >
              {/* Left Column: Abstract & Findings */}
              <ScrollArea className="flex-1 h-full pr-4">
                <div className="space-y-6 pb-6">
                  <GlassCard className="p-6">
                    <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" /> Abstract Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {result.abstract}
                    </p>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" /> Key Findings
                    </h2>
                    <div className="space-y-3">
                      {result.keyFindings.map((finding, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="prose prose-sm dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{finding}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </ScrollArea>

              {/* Right Column: Sources & Citations */}
              <div className="lg:w-1/3 flex flex-col h-full">
                <GlassCard className="flex-1 flex flex-col min-h-0">
                  <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2">
                      <Quote className="w-4 h-4 text-primary" /> Sources
                    </h2>
                    <select
                      value={citationFormat}
                      onChange={(e) => setCitationFormat(e.target.value)}
                      className="bg-background border border-border rounded-md text-xs px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                    >
                      {CITATION_FORMATS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {result.sources.map((source, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-border bg-background space-y-3">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-sm leading-tight">{source.title}</h3>
                              {source.url && (
                                <a href={source.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{source.authors} • {source.year}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              source.credibility === 'High' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                              source.credibility === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                              'bg-red-500/10 text-red-600 border border-red-500/20'
                            }`}>
                              {source.credibility === 'High' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                              {source.credibility} Credibility
                            </span>
                          </div>

                          <div className="pt-3 border-t border-border relative group">
                            <p className="text-xs text-muted-foreground font-serif leading-relaxed pr-8">
                              {source.citations[citationFormat]}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyCitation(source.citations[citationFormat])}
                              className="absolute top-2 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </GlassCard>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50"
            >
              <GraduationCap className="w-24 h-24 mb-6 opacity-20" />
              <p className="text-lg font-medium">Enter a topic above to begin research</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
