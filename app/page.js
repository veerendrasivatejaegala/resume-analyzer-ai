'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, Zap, Sparkles, BrainCircuit, FileText, 
  AlertCircle, BarChart3, ChevronDown, CheckCircle 
} from 'lucide-react';
import { 
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

export default function Home() {
  const [view, setView] = useState('home');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [extraAnalysis, setExtraAnalysis] = useState("");

  // Base URL from Environment Variables
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/resumes/upload`, formData);
      setResult(response.data);
      setView('result');
    } catch (err) {
      console.error(err);
      alert("Upload Failed: Check if Render backend is awake and CORS is allowed for Vercel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    if (!result?.id) return;
    setLoading(true);
    
    // Add 1.5s delay to allow TiDB Cloud to finish indexing the new record
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const response = await axios.get(`${API_BASE_URL}/api/resumes/${result.id}/deep-analysis`);
      setExtraAnalysis(response.data);
    } catch (err) {
      console.error(err);
      alert("Deep Analysis failed. The database might still be syncing. Please wait a moment and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-start bg-background text-text selection:bg-primary/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="w-full flex justify-between items-center py-10 px-8 md:px-16 self-stretch">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.6)] border border-primary/20">
            <BrainCircuit className="text-white w-8 h-8" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic">
            Resume <span className="text-primary">Analyzer</span>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/5">
          <Sparkles size={16} className="text-primary animate-pulse" />
          <span className="text-sm font-bold tracking-[0.3em] uppercase opacity-40">
            Powered by AI Engine
          </span>
        </div>
      </nav>

      <div className="w-full px-8 md:px-16 pb-24">
        <AnimatePresence mode="wait">
          
          {/* Hero Section */}
          {view === 'home' && (
            <motion.section 
              key="home" 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30 }}
              className="mt-12"
            >
              <div className="ml-[20px] flex flex-col gap-10 max-w-6xl">
                <h1 className="text-7xl md:text-9xl font-black leading-[1.05] tracking-tighter uppercase italic text-left">
                  <span className="text-primary">Analyze your resume</span> <br /> 
                  just in seconds with Ai
                </h1>
                <p className="text-2xl text-subtext max-w-3xl leading-relaxed opacity-80">
                  Unlock your career potential with instant ATS scoring, executive summaries, 
                  and neural improvement suggestions.
                </p>
                <button 
                  onClick={() => setView('upload')}
                  className="w-fit px-16 py-6 bg-primary text-white text-2xl font-black rounded-full hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all flex items-center gap-3 active:scale-95 group"
                >
                  Get Started <Zap className="group-hover:fill-current" />
                </button>
              </div>
            </motion.section>
          )}

          {/* Upload Section */}
          {view === 'upload' && !loading && (
            <motion.section 
              key="upload" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="w-full flex flex-col items-center justify-center min-h-[70vh] relative mt-10"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col items-center text-center w-full max-w-4xl gap-12 z-10">
                <div className="space-y-4">
                  <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter">
                    Ready for <span className="text-primary">Deep Scan</span>
                  </h1>
                  <p className="text-subtext text-xl opacity-60">Professional PDF analysis powered by Llama-3.3</p>
                </div>

                <div className="relative group w-full max-w-3xl">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[3.8rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="glass-card relative p-1 rounded-[4rem]">
                    <div className="border-2 border-dashed border-white/10 rounded-[3.8rem] p-20 flex flex-col items-center justify-center gap-10 hover:bg-white/5 transition-all cursor-pointer">
                      <input type="file" className="hidden" id="fileIn" onChange={(e) => setFile(e.target.files[0])} />
                      <label htmlFor="fileIn" className="cursor-pointer flex flex-col items-center gap-6">
                        <UploadCloud size={64} className="text-primary" />
                        <span className="text-4xl font-extrabold tracking-tight">{file ? file.name : "Drop Resume Here"}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-center items-center gap-6 w-full opacity-50 flex-wrap">
                  {['Instant ATS Scoring', 'Neural Skill Mapping', 'Recruiter Insights'].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3 border border-white/5 rounded-2xl bg-white/2">
                      <CheckCircle size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={!file}
                  className="px-20 py-7 bg-primary text-white text-2xl font-black rounded-full hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all flex items-center justify-center gap-4 min-w-[350px]"
                >
                  ANALYZE NOW <Zap size={24} fill="currentColor" />
                </button>
              </div>
            </motion.section>
          )}

          {/* Loading View */}
          {loading && (
            <motion.div key="loading" className="w-full flex flex-col items-center justify-center py-48 gap-8">
              <div className="w-24 h-24 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-4xl font-black tracking-[0.3em] animate-pulse text-primary italic uppercase">Neural Processing...</h2>
            </motion.div>
          )}

          {/* Result Section */}
          {view === 'result' && result && !loading && (
            <motion.section key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12 w-full mt-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 flex flex-col gap-10">
                  <div className="glass-card p-10 rounded-4xl">
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3 italic uppercase">
                      <FileText className="text-primary" /> Executive Summary
                    </h3>
                    <p className="text-subtext text-lg leading-relaxed whitespace-pre-wrap">{result.detailedAnalysis}</p>
                  </div>

                  <div className="glass-card p-10 rounded-4xl">
                    <h3 className="text-3xl font-black mb-6 flex items-center gap-3 italic uppercase text-accent">
                      <AlertCircle /> Areas to Change
                    </h3>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-subtext text-[10px] font-black uppercase tracking-widest opacity-60">
                          <th className="pb-6">Weak Part</th>
                          <th className="pb-6">Suggestion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.skillsToImprove?.split(',').map((skill, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                            <td className="py-6 font-bold text-lg uppercase tracking-tight">{skill.trim()}</td>
                            <td className="py-6 text-subtext italic">Boost impact in {skill.trim()}.</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="lg:col-span-5 flex flex-col gap-10">
                  <div className="glass-card p-10 rounded-4xl flex flex-col items-center">
                    <h3 className="text-xl font-black mb-10 self-start uppercase tracking-widest opacity-40 italic">Neural Scoreboard</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={22} data={[
                        { name: 'ATS', value: result.atsScore, fill: '#8B5CF6' },
                        { name: 'Overall', value: result.overallScore, fill: '#EC4899' }
                      ]}>
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} clockwise dataKey="value" cornerRadius={12} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between w-full mt-6 px-4">
                      <div className="text-center"><p className="text-5xl font-black text-primary italic">{result.atsScore}%</p><p className="text-[10px] font-black uppercase tracking-widest text-subtext">ATS</p></div>
                      <div className="text-center"><p className="text-5xl font-black text-accent italic">{result.overallScore}%</p><p className="text-[10px] font-black uppercase tracking-widest text-subtext">Overall</p></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Neural Analysis */}
              <AnimatePresence>
                {extraAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-12 rounded-4xl relative overflow-hidden w-full">
                    <div className="absolute top-0 right-0 p-12 text-primary opacity-5 rotate-12"><Sparkles size={180}/></div>
                    <h3 className="text-4xl font-black mb-8 flex items-center gap-3 italic uppercase relative z-10 text-primary">
                      <BrainCircuit size={32} /> Deep Neural Analysis
                    </h3>
                    <p className="text-subtext text-xl leading-relaxed whitespace-pre-wrap relative z-10 opacity-90">
                      {extraAnalysis}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer Actions */}
              <footer className="w-full flex justify-between items-center py-10 mt-10 border-t border-white/10 glass-card px-10 rounded-3xl">
                <div>
                  <span className="text-2xl font-black tracking-tight uppercase italic text-primary">Want to check more?</span>
                  <p className="text-subtext text-sm">Deep-dive into your profile architecture.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleDeepAnalysis} 
                    disabled={!!extraAnalysis}
                    className="flex items-center gap-3 px-10 py-5 bg-primary/10 text-primary font-black rounded-2xl hover:bg-primary/20 transition-all disabled:opacity-30"
                  >
                    View More <ChevronDown size={20} />
                  </button>
                  <button onClick={() => { setView('home'); setExtraAnalysis(""); }} className="px-10 py-5 border border-white/10 text-subtext font-bold rounded-2xl hover:bg-white/5 transition-colors">
                    Reset
                  </button>
                </div>
              </footer>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}