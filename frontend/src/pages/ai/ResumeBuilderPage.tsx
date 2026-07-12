import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Sparkles, 
  Download, 
  LayoutTemplate,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Wand2,
  X
} from 'lucide-react';
import api from '@/services/api';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: FileText },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills', icon: Wrench },
  { id: 'preview', title: 'Preview & Export', icon: LayoutTemplate },
];

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [personal, setPersonal] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate software engineer with 3+ years of experience building scalable web applications. Strong background in React, Node.js, and cloud architecture.'
  });

  const [education] = useState([
    { id: '1', school: 'University of California, Berkeley', degree: 'B.S. Computer Science', year: '2019 - 2023' }
  ]);

  const [experience, setExperience] = useState([
    { 
      id: '1', 
      company: 'Tech Innovators Inc.', 
      role: 'Frontend Developer', 
      duration: 'Jun 2023 - Present',
      description: 'Led the migration of legacy architecture to React. Improved page load time by 40%.'
    }
  ]);

  const [skills, setSkills] = useState(['JavaScript/TypeScript', 'React.js', 'Node.js', 'Python', 'AWS', 'Docker']);
  const [newSkill, setNewSkill] = useState('');

  const nextStep = () => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(0, currentStep - 1));

  const improveSummary = async () => {
    if (!personal.summary.trim()) return;
    setIsGenerating(true);
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'resume',
        title: 'Improve Summary',
        subject: 'Resume Summary'
      });
      const prompt = `Rewrite and professionalize the following resume summary to make it more impactful and ATS-friendly:
"${personal.summary}"
Return ONLY the rewritten summary text, no quotes or intro.`;
      const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
        content: prompt
      });
      setPersonal({ ...personal, summary: responseData.content.trim() });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceDescription = async (expId: string, currentDesc: string) => {
    if (!currentDesc.trim()) return;
    setIsGenerating(true);
    try {
      const { data: newConv } = await api.post('/ai/conversations', {
        module_type: 'resume',
        title: 'Enhance Experience',
        subject: 'Resume Experience'
      });
      const prompt = `Rewrite the following resume experience description to be more impactful, using strong action verbs and quantifying results where possible. Format as a bulleted list with bullet characters (•).
"${currentDesc}"
Return ONLY the raw bulleted text, no markdown blocks or intro.`;
      const { data: responseData } = await api.post(`/ai/conversations/${newConv.id}/messages`, {
        content: prompt
      });
      
      let newDesc = responseData.content.trim();
      if (newDesc.startsWith('`\``')) {
        newDesc = newDesc.replace(/^`\``[a-z]*\\n/, '').replace(/\\n`\``$/, '');
      }

      setExperience(experience.map(exp => 
        exp.id === expId ? { ...exp, description: newDesc } : exp
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex flex-col p-6 gap-6 print:h-auto print:p-0 print:gap-0">
        {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 shrink-0 print:hidden"
      >
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">AI Resume Builder</h1>
          <p className="text-sm text-muted-foreground">Create a professional resume tailored to your dream job</p>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-6 min-h-0 print:block">
        {/* Editor Panel */}
        <GlassCard className="w-1/2 flex flex-col min-h-0 print:hidden">
          {/* Progress Bar */}
          <div className="p-6 border-b border-border">
            <div className="flex justify-between mb-2">
              {STEPS.map((step, idx) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center gap-2 ${
                    idx <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    idx < currentStep ? 'bg-primary border-primary text-primary-foreground' :
                    idx === currentStep ? 'border-primary bg-primary/10' :
                    'border-border'
                  }`}>
                    {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="relative w-full h-1 bg-secondary rounded-full mt-2">
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-display font-bold mb-4">Personal Information</h2>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={personal.name} onChange={(e) => setPersonal({...personal, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={personal.email} onChange={(e) => setPersonal({...personal, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input value={personal.phone} onChange={(e) => setPersonal({...personal, phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={personal.location} onChange={(e) => setPersonal({...personal, location: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Summary</Label>
                      <textarea 
                        className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        value={personal.summary}
                        onChange={(e) => setPersonal({...personal, summary: e.target.value})}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
                        onClick={improveSummary}
                        disabled={isGenerating}
                      >
                        <Wand2 className="w-3.5 h-3.5" /> Improve Summary
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-display font-bold">Education</h2>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Education
                      </Button>
                    </div>
                    {education.map(edu => (
                      <div key={edu.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4 relative group">
                        <button className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="space-y-2">
                          <Label>School / University</Label>
                          <Input value={edu.school} onChange={() => {}} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input value={edu.degree} onChange={() => {}} />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input value={edu.year} onChange={() => {}} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-display font-bold">Experience</h2>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Experience
                      </Button>
                    </div>
                    {experience.map(exp => (
                      <div key={exp.id} className="p-4 rounded-xl border border-border bg-secondary/20 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={exp.company} onChange={() => {}} />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={exp.role} onChange={() => {}} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input value={exp.duration} onChange={() => {}} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Description</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => enhanceDescription(exp.id, exp.description)}
                              disabled={isGenerating}
                              className="h-7 px-2 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Sparkles className="w-3 h-3" />
                              {isGenerating ? 'Enhancing...' : 'Enhance with AI'}
                            </Button>
                          </div>
                          <textarea 
                            className="w-full min-h-[150px] p-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...experience];
                              const index = newExp.findIndex(x => x.id === exp.id);
                              newExp[index].description = e.target.value;
                              setExperience(newExp);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-display font-bold mb-4">Skills</h2>
                    <div className="flex gap-2">
                      <Input 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="e.g. React, Python, Project Management"
                      />
                      <Button onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4">
                      <AnimatePresence>
                        {skills.map(skill => (
                          <motion.div
                            key={skill}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium"
                          >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-destructive">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className="pt-6">
                      <GlassCard className="p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                          <Sparkles className="w-4 h-4" />
                          <span>AI Suggestions</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Based on your experience, you might want to add:</p>
                        <div className="flex flex-wrap gap-2">
                          {['GraphQL', 'Redux', 'Jest', 'CI/CD'].map(skill => (
                            <button 
                              key={skill}
                              onClick={() => {setNewSkill(skill); setTimeout(addSkill, 10);}}
                              className="px-2.5 py-1 rounded-md border border-primary/20 text-xs text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-display font-bold mb-4">Choose Template & Export</h2>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {(['modern', 'classic', 'minimal'] as const).map(t => (
                        <div 
                          key={t}
                          onClick={() => setTemplate(t)}
                          className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${
                            template === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="aspect-[1/1.4] bg-background border border-border/50 rounded shadow-sm mb-3 flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Abstract representation of template */}
                            <div className="w-3/4 h-2 bg-secondary rounded-full absolute top-4 left-4" />
                            <div className="w-1/2 h-1 bg-secondary rounded-full absolute top-8 left-4" />
                            <div className="w-full h-[1px] bg-secondary absolute top-12 left-0" />
                          </div>
                          <p className="text-center text-sm font-medium capitalize">{t}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Button className="w-full gap-2 h-12 text-base" onClick={() => window.print()}>
                        <Download className="w-5 h-5" /> Export PDF
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>

          <div className="p-4 border-t border-border flex justify-between bg-secondary/30">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button onClick={nextStep} disabled={currentStep === STEPS.length - 1} className="gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>

        {/* Live Preview Panel */}
        <GlassCard className="w-1/2 overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-900 print:w-full print:block print:overflow-visible print:bg-white print:border-none print:shadow-none">
          <div className="p-3 border-b border-border bg-background flex items-center justify-between print:hidden">
            <span className="text-sm font-medium flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" /> Live Preview ({template})
            </span>
            <Button variant="ghost" size="sm" className="h-8 gap-2 text-primary" onClick={() => window.print()}>
              <Download className="w-3.5 h-3.5" /> PDF
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-8 flex justify-center bg-slate-200/50 dark:bg-black/20 print:p-0 print:bg-white print:overflow-visible">
            {/* The Resume Document */}
            <div id="resume-preview" className="w-full max-w-[800px] aspect-[1/1.414] bg-white text-black p-10 shadow-lg mx-auto origin-top transition-all print:max-w-none print:w-full print:h-auto print:aspect-auto print:shadow-none print:p-0 print:m-0"
                 style={{ 
                   fontFamily: template === 'classic' ? 'Times New Roman, serif' : 
                               template === 'modern' ? 'Inter, sans-serif' : 
                               'Helvetica, sans-serif'
                 }}>
              
              {/* Header */}
              <div className={`mb-6 ${template === 'modern' ? 'border-b-2 border-blue-600 pb-4' : template === 'minimal' ? 'text-center' : 'border-b border-black pb-2'}`}>
                <h1 className={`text-4xl font-bold ${template === 'modern' ? 'text-blue-600' : ''}`}>
                  {personal.name || 'Your Name'}
                </h1>
                <div className={`flex flex-wrap gap-4 mt-2 text-sm text-gray-600 ${template === 'minimal' ? 'justify-center' : ''}`}>
                  <span>{personal.email}</span>
                  <span>|</span>
                  <span>{personal.phone}</span>
                  <span>|</span>
                  <span>{personal.location}</span>
                </div>
              </div>

              {/* Summary */}
              {personal.summary && (
                <div className="mb-6">
                  <p className="text-sm leading-relaxed">{personal.summary}</p>
                </div>
              )}

              {/* Experience */}
              <div className="mb-6">
                <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 ${template === 'modern' ? 'text-blue-600' : 'border-b border-gray-300'}`}>
                  Professional Experience
                </h2>
                {experience.map(exp => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base">{exp.role}</h3>
                      <span className="text-sm text-gray-600 font-medium">{exp.duration}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-4">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 ${template === 'modern' ? 'text-blue-600' : 'border-b border-gray-300'}`}>
                  Education
                </h2>
                {education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline mb-2">
                    <div>
                      <h3 className="font-bold text-base">{edu.school}</h3>
                      <p className="text-sm text-gray-700">{edu.degree}</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{edu.year}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h2 className={`text-lg font-bold uppercase tracking-wider mb-3 ${template === 'modern' ? 'text-blue-600' : 'border-b border-gray-300'}`}>
                    Technical Skills
                  </h2>
                  <div className="text-sm">
                    {skills.join(' • ')}
                  </div>
                </div>
              )}

            </div>
          </ScrollArea>
        </GlassCard>
      </div>
      </div>
    </>
  );
}
