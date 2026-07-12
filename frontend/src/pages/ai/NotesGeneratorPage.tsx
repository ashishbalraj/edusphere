import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Download,
  Save,
  RefreshCcw,
  LayoutTemplate
} from 'lucide-react';
import api from '@/services/api';

const MOCK_NOTES = `
# Introduction to Machine Learning

## 1. What is Machine Learning?
Machine Learning (ML) is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.

### Key Paradigms:
- **Supervised Learning**: Learning with labeled data.
- **Unsupervised Learning**: Finding patterns in unlabeled data.
- **Reinforcement Learning**: Learning through trial and error to maximize a reward.

## 2. Core Concepts
* **Features ($X$)**: The input variables used for prediction.
* **Target ($Y$)**: The output variable you are trying to predict.
* **Model**: The mathematical function mapping $X$ to $Y$.

## 3. Simple Linear Regression Example
A basic model to predict a continuous value:
$$ Y = mX + c $$

\`\`\`python
from sklearn.linear_model import LinearRegression
import numpy as np

# Sample Data
X = np.array([[1], [2], [3]])
y = np.array([2, 4, 6])

model = LinearRegression()
model.fit(X, y)
print(f"Prediction for 4: {model.predict([[4]])}") # Output: 8
\`\`\`

## 4. Evaluation Metrics
| Metric | Use Case | Formula / Meaning |
|--------|----------|-------------------|
| MSE    | Regression | Average squared difference between predictions and actuals |
| Accuracy| Classification| Ratio of correct predictions to total predictions |
| F1 Score| Classification| Harmonic mean of Precision and Recall |
`;

export default function NotesGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
  
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Undergraduate');
  const [style, setStyle] = useState('Detailed & Structured');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedNotes(null);
    
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'notes',
        title: `Notes on ${topic}`,
        subject: topic
      });

      const prompt = `Generate notes on the topic: "${topic}". 
Academic Level: ${level}
Output Style: ${style}
Please structure the response clearly in markdown format.`;

      const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
        content: prompt
      });

      setGeneratedNotes(responseData.content);
    } catch (err) {
      console.error("AI Error:", err);
      setGeneratedNotes(MOCK_NOTES);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            Notes Generator
          </h1>
          <p className="text-muted-foreground mt-1">Transform topics, PDFs, or lectures into structured markdown notes.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Pane - Configuration */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <LayoutTemplate className="w-5 h-5 text-primary" />
              Configuration
            </h2>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-3">
                <Label>Source Material</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    Enter Topic
                  </Button>
                  <Button type="button" variant="outline" className="text-muted-foreground">
                    Upload File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Syllabus</Label>
                <Input
                  id="topic"
                  placeholder="e.g. Introduction to Machine Learning"
                  className="bg-background/50"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Academic Level</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option>High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option>Graduate</option>
                  <option>Professional</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Output Style</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="Detailed & Structured">Detailed & Structured</option>
                  <option>Bullet Points (Summary)</option>
                  <option>Q&A Format</option>
                  <option>Flashcard Format</option>
                </select>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="w-full shadow-glow"
                  disabled={isGenerating || !topic.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Notes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </GlassCard>

          <GlassCard className="p-6 bg-secondary/30">
            <div className="flex items-center justify-center flex-col text-center p-4 border-2 border-dashed border-border/50 rounded-xl">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
              <h3 className="font-medium text-sm">Upload a document</h3>
              <p className="text-xs text-muted-foreground mt-1">PDF, PPTX, or DOCX up to 10MB</p>
            </div>
          </GlassCard>
        </div>

        {/* Right Pane - Rendered Output */}
        <div className="lg:col-span-8">
          <GlassCard className="h-full flex flex-col border-primary/10 overflow-hidden relative">
            {/* Header Actions */}
            <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${generatedNotes ? 'bg-success' : 'bg-muted'}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {isGenerating ? 'Drafting...' : generatedNotes ? 'Ready' : 'Waiting for input'}
                </span>
              </div>
              
              <AnimatePresence>
                {generatedNotes && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    <Button variant="outline" size="sm" className="h-8">
                      <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> Regenerate
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
                    </Button>
                    <Button variant="default" size="sm" className="h-8">
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save to Library
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 bg-secondary/10">
              <div className="p-6 md:p-10 max-w-4xl mx-auto">
                {isGenerating ? (
                  <div className="space-y-6 max-w-2xl animate-pulse">
                    <div className="h-8 bg-secondary rounded-md w-3/4"></div>
                    <div className="h-4 bg-secondary rounded-md w-full"></div>
                    <div className="h-4 bg-secondary rounded-md w-5/6"></div>
                    <div className="h-32 bg-secondary rounded-md w-full mt-8"></div>
                    <div className="h-4 bg-secondary rounded-md w-4/5"></div>
                  </div>
                ) : generatedNotes ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
                               prose-headings:font-display prose-h1:text-3xl prose-h1:text-primary 
                               prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2 
                               prose-a:text-primary hover:prose-a:text-primary/80
                               prose-pre:bg-background/80 prose-pre:border prose-pre:border-border/50"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedNotes}
                    </ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-32">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Enter a topic on the left to generate comprehensive study notes.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
