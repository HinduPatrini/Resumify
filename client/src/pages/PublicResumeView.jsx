import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ResumePreview from '../components/preview/ResumePreview';

export default function PublicResumeView() {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        setLoading(true);
        // Call the public non-authenticated endpoint on the server
        const response = await axios.get(`http://localhost:5000/api/resumes/public/${slug}`);
        setResume(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching public resume:', err);
        setError(err.response?.data?.message || 'This resume was not found or has been set to private.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicResume();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin text-accent"></div>
        <p className="text-sm text-text-secondary font-medium font-sans">Retrieving resume...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 gap-4">
        <h2 className="text-2xl font-heading font-bold text-text-primary tracking-tight">Resume Unavailable</h2>
        <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
          {error || 'The document you are looking for is private or does not exist.'}
        </p>
        <Link to="/" className="mt-4">
          <button className="bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-heading font-semibold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
            Visit Resumify
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* Top Branding Badge */}
      <div className="mb-6 flex items-center gap-2 select-none">
        <span className="text-xs text-text-secondary">Created with</span>
        <div className="flex items-center gap-1.5 bg-dark-card border border-dark-border px-2.5 py-1 rounded-lg">
          <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center font-heading font-bold text-white text-[11px] shadow-sm shadow-accent/20">
            R
          </div>
          <span className="font-heading font-bold text-text-primary text-[11px] tracking-tight">Resumify</span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="w-full max-w-[800px] shadow-2xl rounded-xl border border-dark-border overflow-hidden bg-white mb-6">
        <div className="preview-container overflow-hidden w-full relative">
          <ResumePreview data={resume} />
        </div>
      </div>
    </div>
  );
}
