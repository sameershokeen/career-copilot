'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Send, 
  Award, 
  TrendingUp, 
  Zap, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  RefreshCw,
  User,
  Sliders
} from 'lucide-react';

export default function CareerCopilotDashboard() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'jobs' | 'cover-letter' | 'interview'>('analyzer');

  // Resume Matcher State
  const [resumeText, setResumeText] = useState(`Senior Software Engineer with 5 years experience building scalable web applications using React, Next.js, Node.js, TypeScript, and AWS. Proven track record in optimizing REST APIs and leading cross-functional engineering teams.`);
  const [jobDescription, setJobDescription] = useState(`We are looking for a Senior Full Stack Engineer proficient in Next.js, TypeScript, Node.js, and Cloud Infrastructure. Requires experience with PostgreSQL, Docker, CI/CD, and system architecture.`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    matchScore: number;
    atsScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    strengths: string[];
  } | null>({
    matchScore: 88,
    atsScore: 92,
    matchingSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AWS', 'REST API'],
    missingSkills: ['PostgreSQL', 'Docker', 'CI/CD Pipelines', 'System Architecture'],
    recommendations: [
      "Add explicit metrics for cloud deployment performance in AWS.",
      "Mention containerization experience with Docker in work history.",
      "Highlight CI/CD pipeline automation experience in key skills list."
    ],
    strengths: [
      "High overlap on primary technology stack (Next.js & TypeScript)",
      "Clear leadership & architectural trajectory demonstrated",
      "Excellent formatting for ATS parser recognition"
    ]
  });

  // Cover Letter Generator State
  const [targetCompany, setTargetCompany] = useState('TechFlow Systems');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  // Job Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState('All');

  // Interview Simulator State
  const [interviewTopic, setInterviewTopic] = useState('Behavioral');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evalResult, setEvalResult] = useState<{ score: number; feedback: string } | null>(null);

  const sampleJobs = [
    {
      id: 'job-101',
      title: 'Senior Full Stack Engineer',
      company: 'TechFlow Systems',
      location: 'San Francisco, CA',
      type: 'Hybrid',
      salary: '$150,000 - $185,000',
      match: 94,
      tags: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL']
    },
    {
      id: 'job-102',
      title: 'AI Solutions Architect',
      company: 'Neural Labs AI',
      location: 'Remote',
      type: 'Remote',
      salary: '$170,000 - $210,000',
      match: 89,
      tags: ['Python', 'FastAPI', 'LLM', 'Vector DB']
    },
    {
      id: 'job-103',
      title: 'Frontend React Developer',
      company: 'Vibrant Digital',
      location: 'New York, NY',
      type: 'On-Site',
      salary: '$120,000 - $145,000',
      match: 82,
      tags: ['React', 'Tailwind CSS', 'TypeScript', 'UI/UX']
    }
  ];

  const mockInterviewQuestions = [
    {
      id: 1,
      q: "Can you describe a challenging technical bottleneck you resolved in your recent project?",
      outline: "Use the STAR method: Situation, Task, Action (specific engineering fix), and Result (quantifiable latency or performance improvement)."
    },
    {
      id: 2,
      q: "How do you handle architectural trade-offs between rapid delivery speed and long-term code maintainability?",
      outline: "Explain technical debt management, modular software design, automated testing coverage, and pragmatic product delivery."
    }
  ];

  // Actions
  const handleAnalyzeResume = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        matchScore: Math.floor(Math.random() * 15) + 82,
        atsScore: Math.floor(Math.random() * 10) + 88,
        matchingSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AWS', 'REST API'],
        missingSkills: ['PostgreSQL', 'Docker', 'CI/CD Pipelines', 'System Architecture'],
        recommendations: [
          "Add explicit metrics for cloud deployment performance in AWS.",
          "Mention containerization experience with Docker in work history.",
          "Highlight CI/CD pipeline automation experience in key skills list."
        ],
        strengths: [
          "Strong core alignment with frontend and backend framework stack",
          "Demonstrates leadership and full product cycle ownership"
        ]
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleGenerateCoverLetter = () => {
    setIsGeneratingLetter(true);
    setTimeout(() => {
      setGeneratedLetter(`Dear Hiring Manager at ${targetCompany},

I am writing to express my strong enthusiasm for the ${targetRole} position at ${targetCompany}. With my background in Next.js, React, TypeScript, and cloud services, I am eager to contribute directly to your team's ambitious engineering goals.

Throughout my career, I have consistently focused on building high-performance, user-centric software while maintaining high code quality standards. At ${targetCompany}, I look forward to applying my expertise in full stack development to drive product innovation.

Thank you for considering my application. I look forward to discussing how my technical background aligns with your vision.

Warm regards,
Alex Mercer`);
      setIsGeneratingLetter(false);
    }, 1000);
  };

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setEvalResult({
      score: 88,
      feedback: "Great structure using the STAR methodology! You clearly articulated the situation and specific technical actions taken. Consider emphasizing the exact numeric outcome (e.g. reduced latency by 35%) for maximum impact."
    });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                  Career Copilot
                </span>
                <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  v1.0 Monorepo
                </span>
              </div>
              <p className="text-xs text-slate-400">AI-Powered Career Intelligence Platform</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">ATS Optimization:</span>
              <span className="text-xs font-bold text-emerald-400">92%</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-slate-400">Active Job Matches:</span>
              <span className="text-xs font-bold text-sky-400">14 Jobs</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'analyzer' 
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Resume Matcher
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'jobs' 
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Smart Job Board
          </button>

          <button
            onClick={() => setActiveTab('cover-letter')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'cover-letter' 
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Cover Letter Studio
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeTab === 'interview' 
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 font-semibold' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Interview Coach
          </button>
        </div>

        {/* TAB 1: AI RESUME MATCHER */}
        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-sky-400" />
                    Your Resume & Experience Summary
                  </h2>
                  <span className="text-xs text-slate-400">Markdown or Text</span>
                </div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition"
                  placeholder="Paste your resume content or skills bullet points..."
                />
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    Target Job Description
                  </h2>
                  <span className="text-xs text-slate-400">Target Spec</span>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="Paste the job description you are targeting..."
                />

                <button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="mt-4 w-full py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-sky-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Key Metrics & Skill Gaps...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Run AI Match & ATS Gap Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {analysisResult ? (
                <>
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-full blur-xl"></div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Match Score</span>
                      <div className="text-4xl font-extrabold text-sky-400 mt-2">{analysisResult.matchScore}%</div>
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3" /> High Compatibility
                      </p>
                    </div>

                    <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Parsing Score</span>
                      <div className="text-4xl font-extrabold text-indigo-400 mt-2">{analysisResult.atsScore}%</div>
                      <p className="text-[11px] text-indigo-300 mt-1 flex items-center justify-center gap-1">
                        <Award className="w-3 h-3" /> Parser Optimized
                      </p>
                    </div>
                  </div>

                  {/* Matching & Missing Skills */}
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Matching Keywords ({analysisResult.matchingSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {analysisResult.matchingSkills.map((skill, idx) => (
                        <span key={idx} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Missing High-Impact Skills ({analysisResult.missingSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingSkills.map((skill, idx) => (
                        <span key={idx} className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium px-2.5 py-1 rounded-lg">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Actionable Recommendations
                    </h3>
                    <ul className="space-y-2.5">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                  <Sparkles className="w-10 h-10 text-slate-600" />
                  <p className="text-sm text-slate-400">Click "Run AI Match" to generate match analysis and skill gaps.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SMART JOB BOARD */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 flex items-center gap-3 bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 w-full">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, technology, or company..."
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {['All', 'Remote', 'Hybrid', 'On-Site'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setWorkplaceFilter(type)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                      workplaceFilter === type
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleJobs
                .filter(j => workplaceFilter === 'All' || j.type === workplaceFilter)
                .filter(j => !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((job) => (
                  <div key={job.id} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/40 transition group">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {job.match}% AI Match
                        </span>
                        <span className="text-xs text-slate-400">{job.type}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition">{job.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" /> {job.company}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {job.salary}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {job.tags.map((t, idx) => (
                          <span key={idx} className="bg-slate-950 border border-white/5 text-slate-300 text-[11px] px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setTargetCompany(job.company);
                        setTargetRole(job.title);
                        setActiveTab('cover-letter');
                      }}
                      className="mt-6 w-full py-2.5 rounded-xl border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500 hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      Draft Cover Letter <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: COVER LETTER STUDIO */}
        {activeTab === 'cover-letter' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Cover Letter Parameters
              </h2>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Job Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">Desired Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Professional', 'Enthusiastic', 'Direct', 'Creative'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                        selectedTone === t 
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-semibold' 
                          : 'border-white/10 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingLetter}
                className="mt-2 w-full py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {isGeneratingLetter ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Cover Letter
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Generated Cover Letter Preview</h3>
                {generatedLetter && (
                  <span className="text-xs text-purple-400 font-medium bg-purple-500/10 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                    {selectedTone} Tone
                  </span>
                )}
              </div>

              {generatedLetter ? (
                <div className="bg-slate-950/70 border border-white/10 rounded-xl p-6 whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
                  {generatedLetter}
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-12 text-center text-slate-400 text-sm">
                  Fill in target company details and click "Generate AI Cover Letter".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: INTERVIEW COACH */}
        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  Mock Interview Session ({interviewTopic})
                </h2>
                <span className="text-xs text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-lg">
                  Question {currentQuestionIndex + 1} of {mockInterviewQuestions.length}
                </span>
              </div>

              {/* Question Display */}
              <div className="bg-slate-950/80 border border-sky-500/30 rounded-xl p-5">
                <h3 className="text-base font-semibold text-slate-100 leading-snug">
                  "{mockInterviewQuestions[currentQuestionIndex].q}"
                </h3>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/5">
                  <strong className="text-sky-400">Ideal Outline:</strong> {mockInterviewQuestions[currentQuestionIndex].outline}
                </p>
              </div>

              {/* User Response Entry */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Your Response (Use STAR framework)</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  placeholder="In my previous role as Senior Engineer, I encountered a situation where..."
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={!userAnswer.trim()}
                  className="flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Answer for AI Grading
                </button>
              </div>
            </div>

            {/* Evaluation Results */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">AI Coach Evaluation</h3>

              {evalResult ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <span className="text-xs text-slate-400">Response Quality Score</span>
                    <div className="text-4xl font-extrabold text-emerald-400 mt-1">{evalResult.score}/100</div>
                  </div>

                  <div className="bg-slate-950/70 border border-white/10 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Detailed Feedback</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{evalResult.feedback}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-12 text-center text-slate-400 text-sm">
                  Type your answer and click "Submit Answer for AI Grading".
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
