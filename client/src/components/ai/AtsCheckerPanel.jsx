import React, { useState } from 'react';
import { 
  Sparkles, Play, AlertTriangle, CheckCircle, HelpCircle, 
  BookOpen, ChevronRight, Check, FileText, Activity
} from 'lucide-react';
import api from '../../api/axios';
import Button from '../ui/Button';
import Card from '../ui/Card';
import toast from 'react-hot-toast';

export default function AtsCheckerPanel({ resumeId }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleRunCheck = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description first.');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const response = await api.post('/ai/ats-check', {
        resumeId,
        jobDescription,
      });
      setResults(response.data);
      toast.success('ATS check complete!');
    } catch (error) {
      console.error('ATS check failed:', error);
      toast.error(error.response?.data?.message || 'Failed to complete ATS check.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine color based on score
  const getScoreColor = (score) => {
    if (score < 50) return 'text-red-500 border-red-500/20 bg-red-500/5';
    if (score < 75) return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
  };

  const getScoreSvgColor = (score) => {
    if (score < 50) return '#ef4444';
    if (score < 75) return '#fbbf24';
    return '#34d399';
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Input Section */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
          Target Job Description
        </label>
        <textarea
          placeholder="Paste the job description you want to optimize your resume for..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          className="w-full bg-dark-input text-text-primary border border-dark-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200 resize-y min-h-[120px]"
        />
        <Button
          onClick={handleRunCheck}
          variant="primary"
          disabled={loading}
          icon={Play}
          className="self-start shadow-md shadow-accent/15"
        >
          {loading ? 'Analyzing your resume...' : 'Run ATS Check'}
        </Button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 border border-dark-border/40 bg-dark-card/25 rounded-2xl gap-4 select-none">
          <Activity className="h-8 w-8 text-accent animate-pulse" />
          <div className="flex flex-col items-center gap-1">
            <h4 className="text-sm font-heading font-semibold text-text-primary animate-pulse">
              Running ATS Audit...
            </h4>
            <p className="text-xs text-text-secondary">
              Analyzing keyword matches, length constraints, and format completeness.
            </p>
          </div>
        </div>
      )}

      {/* Results View */}
      {results && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top Score and Highlights Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Score circle */}
            <Card className="flex flex-col items-center justify-center p-6 text-center bg-dark-card border-dark-border col-span-1">
              <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase mb-4 select-none">
                Overall Match
              </span>
              <div className="relative flex items-center justify-center w-28 h-28 select-none">
                {/* SVG Radial circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke={getScoreSvgColor(results.overallScore)}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - results.overallScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-text-primary">
                    {results.overallScore}
                  </span>
                  <span className="text-[10px] text-text-muted font-heading uppercase tracking-wide">
                    Score
                  </span>
                </div>
              </div>
              <div className={`mt-4 px-3 py-1 rounded-full border text-xs font-heading font-semibold capitalize tracking-wide select-none ${getScoreColor(results.overallScore)}`}>
                {results.overallScore >= 75 ? 'Strong Match' : results.overallScore >= 50 ? 'Average Match' : 'Weak Match'}
              </div>
            </Card>

            {/* Keyword Match card */}
            <Card className="col-span-1 md:col-span-2 flex flex-col p-5 bg-dark-card border-dark-border">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border/40 mb-3 select-none">
                <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase">
                  Keyword Audit
                </span>
                <span className="text-xs font-mono font-bold text-accent">
                  Match: {results.keywordMatch?.score || 0}%
                </span>
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-40 pr-1">
                {/* Matched */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-heading font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 select-none">
                    <CheckCircle className="h-3 w-3" /> Matched Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {results.keywordMatch?.matchedKeywords?.length > 0 ? (
                      results.keywordMatch.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-sans">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-muted italic">No keyword matches found.</span>
                    )}
                  </div>
                </div>
                {/* Missing */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-heading font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 select-none">
                    <AlertTriangle className="h-3 w-3" /> Missing Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {results.keywordMatch?.missingKeywords?.length > 0 ? (
                      results.keywordMatch.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="text-xs bg-red-500/5 border border-red-500/10 text-red-400 px-2 py-0.5 rounded-md font-sans">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-text-muted italic">No missing keywords detected!</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Breakdown checklist grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format & Section completeness */}
            <Card className="p-5 bg-dark-card border-dark-border">
              <h4 className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase pb-2 border-b border-dark-border/40 mb-3 select-none">
                Structure & Format Audit
              </h4>
              <div className="flex flex-col gap-4 text-xs text-text-secondary">
                {/* Length check */}
                {results.lengthCheck && (
                  <div className="flex items-center justify-between bg-dark-input/50 p-2.5 rounded-lg border border-dark-border/40">
                    <span className="font-semibold select-none">Word Count:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{results.lengthCheck.wordCount} words</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-semibold uppercase text-[9px] ${
                        results.lengthCheck.status === 'good' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {results.lengthCheck.status}
                      </span>
                    </div>
                  </div>
                )}

                {/* Missing Sections */}
                <div className="flex flex-col gap-2">
                  <span className="font-heading font-semibold text-text-primary select-none">Section Completeness:</span>
                  {results.sectionCompleteness?.missing?.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {results.sectionCompleteness.missing.map((sec, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-red-400 font-sans">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span>Missing section: <strong className="underline">{sec}</strong></span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>All critical resume sections are present.</span>
                    </div>
                  )}
                </div>

                {/* Format Warnings */}
                <div className="flex flex-col gap-2">
                  <span className="font-heading font-semibold text-text-primary select-none">Formatting Warnings:</span>
                  {results.formatIssues?.length > 0 ? (
                    <ul className="flex flex-col gap-1.5 list-none pl-0">
                      {results.formatIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-text-secondary leading-normal">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>No formatting issues detected.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Phrasing & Action Verbs */}
            <Card className="p-5 bg-dark-card border-dark-border">
              <h4 className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase pb-2 border-b border-dark-border/40 mb-3 select-none">
                Phrasing & Weak Verbs
              </h4>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                {results.weakPhrasing?.length > 0 ? (
                  results.weakPhrasing.map((phrase, idx) => (
                    <div key={idx} className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-sans text-text-secondary leading-relaxed">
                          {phrase}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 py-4 justify-center text-xs">
                    <CheckCircle className="h-4 w-4" />
                    <span>Strong phrasing with excellent action verbs detected.</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Actionable Suggestions at the bottom */}
          <Card className="p-5 bg-dark-card border-accent/20 border shadow-lg shadow-accent/5">
            <h4 className="text-xs font-heading font-semibold text-accent tracking-wide uppercase pb-2 border-b border-dark-border/40 mb-3 select-none flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Actionable Recommendations
            </h4>
            <div className="flex flex-col gap-3.5">
              {results.suggestions?.length > 0 ? (
                results.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-text-primary">
                    <div className="w-5 h-5 rounded bg-accent/15 border border-accent/25 text-accent flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 select-none">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed font-sans">{suggestion}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted italic">No optimization recommendations needed. Excellent job!</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
