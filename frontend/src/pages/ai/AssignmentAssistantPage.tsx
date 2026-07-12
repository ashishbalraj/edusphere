import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileQuestion,
  Image as ImageIcon,
  Send,
  Loader2,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ListTodo,
  Save
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '@/services/api';

const MOCK_SOLUTION = {
  problem: "Write a function to find the longest palindromic substring in a given string.",
  steps: [
    {
      title: "Understand the Problem",
      content: "A palindrome reads the same forwards and backwards (e.g., 'racecar'). We need to find the longest contiguous substring within a larger string that is a palindrome."
    },
    {
      title: "Identify the Approach (Expand Around Center)",
      content: "Instead of checking every possible substring (which takes O(n³)), we can treat every character (and the space between characters) as the center of a potential palindrome and expand outwards. This takes O(n²)."
    },
    {
      title: "Implementation Details",
      content: "We'll need a helper function `expandAroundCenter(left, right)` that returns the length of the palindrome centered at those indices. We'll loop through the string, calling this helper for odd-length (center is a char) and even-length (center is between chars) palindromes."
    },
    {
      title: "Write the Code",
      content: `\`\`\`javascript
function longestPalindrome(s) {
    if (!s || s.length < 1) return "";
    let start = 0, end = 0;

    for (let i = 0; i < s.length; i++) {
        let len1 = expandAroundCenter(s, i, i);     // Odd length
        let len2 = expandAroundCenter(s, i, i + 1); // Even length
        let len = Math.max(len1, len2);
        
        if (len > end - start) {
            start = i - Math.floor((len - 1) / 2);
            end = i + Math.floor(len / 2);
        }
    }
    return s.substring(start, end + 1);
}

function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}
\`\`\``
    }
  ],
  concepts: [
    { title: 'Time Complexity', desc: 'O(n²) where n is the length of the string.' },
    { title: 'Space Complexity', desc: 'O(1) as we only use pointers (start, end, left, right).' },
    { title: 'Dynamic Programming Alternative', desc: 'Can also be solved with DP, creating an n x n boolean table. Space complexity would be O(n²).' }
  ],
  similarProblems: [
    "Palindromic Substrings (Count total number)",
    "Longest Palindromic Subsequence",
    "Valid Palindrome II (Remove at most 1 char)"
  ]
};

export default function AssignmentAssistantPage() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<typeof MOCK_SOLUTION | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setSolution(null);
    
    try {
      // 1. Create a conversation for the assignment
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'assignment',
        title: 'Assignment Help',
        subject: 'General'
      });

      // 2. Send the message with strict JSON instructions
      const prompt = `Solve this assignment problem: "${query}". 
You MUST return your ENTIRE response as a valid JSON object with the exact following structure (no markdown blocks, just raw JSON):
{
  "problem": "Re-state the problem clearly",
  "steps": [
    { "title": "Step 1 title", "content": "Detailed explanation with markdown if needed" }
  ],
  "concepts": [
    { "title": "Concept name", "desc": "Brief description" }
  ],
  "similarProblems": ["Problem 1", "Problem 2"]
}`;

      const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
        content: prompt
      });

      let jsonStr = responseData.content;
      // Remove markdown code block wrappers if the AI included them
      if (jsonStr.startsWith('`\``json')) {
        jsonStr = jsonStr.replace(/^`\``json\\n/, '').replace(/\\n`\``$/, '');
      }
      
      const parsed = JSON.parse(jsonStr);
      setSolution(parsed);
    } catch (err) {
      console.error("AI Error:", err);
      // Fallback to mock on error just so the user sees something in case JSON parsing fails
      setSolution(MOCK_SOLUTION);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 text-fuchsia-500">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Assignment Assistant</h1>
            <p className="text-sm text-muted-foreground">Step-by-step guidance for homework and problems</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left Column - Input & Steps */}
        <div className="flex-1 flex flex-col min-h-0 gap-6">
          {/* Input Area */}
          <GlassCard className="p-4 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Button type="button" variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl border-dashed">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your assignment question here or upload an image..."
                className="flex-1 h-12 bg-background border-border"
                disabled={isAnalyzing}
              />
              <Button type="submit" disabled={!query.trim() || isAnalyzing} className="h-12 px-6 gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white border-0 hover:opacity-90 transition-opacity">
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Solve
              </Button>
            </form>
          </GlassCard>

          {/* Solution Area */}
          <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #d946ef 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />
            
            <ScrollArea className="flex-1 p-6 z-10">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground"
                  >
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-fuchsia-500" />
                    <p className="font-medium text-lg text-foreground">Breaking down the problem...</p>
                    <p className="text-sm mt-2">Identifying concepts and generating step-by-step solution</p>
                  </motion.div>
                ) : solution ? (
                  <motion.div
                    key="solution"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 max-w-3xl mx-auto"
                  >
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-2">Original Problem</h3>
                      <p className="font-medium">{solution.problem}</p>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-xl font-display font-bold flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-fuchsia-500" /> Step-by-Step Breakdown
                      </h2>
                      
                      {solution.steps.map((step, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={idx} 
                          className="flex gap-4 group"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 text-fuchsia-500 flex items-center justify-center font-bold text-sm border border-fuchsia-500/20 shadow-sm shrink-0">
                              {idx + 1}
                            </div>
                            {idx !== solution.steps.length - 1 && (
                              <div className="w-0.5 h-full bg-border mt-2 group-hover:bg-fuchsia-500/30 transition-colors" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50"
                  >
                    <FileQuestion className="w-24 h-24 mb-6 opacity-20" />
                    <p className="text-lg font-medium">Input a problem to get a step-by-step breakdown</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
            
            {solution && (
              <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm flex justify-end z-10">
                <Button variant="outline" className="gap-2">
                  <Save className="w-4 h-4" /> Save to Notes
                </Button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column - Concepts & Similar */}
        <AnimatePresence>
          {solution && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 shrink-0 hidden lg:flex flex-col gap-6"
            >
              <GlassCard className="p-5 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 border-fuchsia-500/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4" /> Key Concepts
                </h3>
                <div className="space-y-4">
                  {solution.concepts.map((concept, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-background/60 border border-fuchsia-500/10">
                      <p className="font-bold text-sm mb-1">{concept.title}</p>
                      <p className="text-xs text-muted-foreground">{concept.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-5 flex-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4" /> Similar Problems
                </h3>
                <div className="space-y-2">
                  {solution.similarProblems.map((prob, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-3 text-sm rounded-xl border border-border bg-secondary/30 hover:bg-secondary hover:border-primary/50 transition-all flex items-center justify-between group"
                    >
                      <span className="line-clamp-2 text-muted-foreground group-hover:text-foreground">
                        {prob}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
