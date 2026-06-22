import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Check, ArrowRight, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ImproveBulletModal({
  isOpen,
  onClose,
  bulletText,
  jobTitle = '',
  onSelect,
}) {
  const [tone, setTone] = useState('metrics-focused');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async () => {
    if (!bulletText || !bulletText.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/ai/improve-bullet', {
        bulletText: bulletText,
        jobTitle: jobTitle,
        tone: tone,
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      toast.error(error.response?.data?.message || 'Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions when modal opens or tone changes
  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, tone]);

  const toneOptions = [
    { id: 'concise', label: 'Concise' },
    { id: 'detailed', label: 'Detailed' },
    { id: 'metrics-focused', label: 'Metrics-focused' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ AI Bullet Suggestions"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Original Bullet */}
        <div className="flex flex-col gap-1.5 bg-dark-input/50 border border-dark-border/40 p-4 rounded-xl">
          <span className="text-[10px] font-heading font-semibold text-text-muted uppercase tracking-wider select-none">
            Original Bullet
          </span>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            "{bulletText}"
          </p>
          {jobTitle && (
            <div className="mt-2 text-[11px] text-accent/80 font-medium">
              Context Target Role: <span className="underline">{jobTitle}</span>
            </div>
          )}
        </div>

        {/* Tone Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
            Choose Suggestion Tone
          </span>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTone(opt.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold font-heading transition-all ${
                  tone === opt.id
                    ? 'bg-accent text-white border border-accent shadow-md shadow-accent/15'
                    : 'bg-dark-input text-text-secondary border border-dark-border/60 hover:bg-dark-hover hover:text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="flex flex-col gap-3 min-h-[120px] justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
              AI Rewrites (Click to Select)
            </span>
            <Button
              onClick={fetchSuggestions}
              variant="ghost"
              size="sm"
              disabled={loading}
              className="text-accent hover:text-white text-xs hover:bg-accent/10 px-2 py-1"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 w-full rounded-xl bg-dark-input/30 border border-dark-border/40 animate-pulse flex items-center px-4">
                  <div className="h-4 bg-dark-border rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-dark-border rounded-xl bg-dark-card/25">
              <p className="text-sm text-text-muted">No suggestions generated yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelect(suggestion);
                    toast.success('Selected new bullet point!');
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-xl bg-dark-input/20 border border-dark-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-200 group flex items-start gap-3.5 focus:outline-none"
                >
                  <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors mt-0.5">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <p className="text-sm text-text-primary group-hover:text-white transition-colors leading-relaxed font-sans">
                      {suggestion}
                    </p>
                    <span className="text-[10px] text-text-muted flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Use this suggestion <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-dark-border/40">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="sm"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
