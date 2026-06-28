import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResumeStore } from '../store/resumeStore';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LinkedinImportModal from '../components/ai/LinkedinImportModal';
import api from '../api/axios';

const Linkedin = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Dashboard() {
  const { resumes, fetchResumes, createResume, deleteResume, loading } = useResumeStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a resume title.');
      return;
    }
    setActionLoading(true);
    const newResume = await createResume(newTitle.trim());
    setActionLoading(false);
    setIsModalOpen(false);
    setNewTitle('');
    if (newResume) {
      toast.success('Resume created successfully!');
      navigate(`/builder/${newResume._id}`);
    } else {
      toast.error('Failed to create resume.');
    }
  };

  const handleLinkedinImport = async (parsedData) => {
    setImportLoading(true);
    try {
      // Create a new resume with a title from parsed name
      const importTitle = parsedData.personalInfo?.fullName
        ? `${parsedData.personalInfo.fullName}'s Resume`
        : 'LinkedIn Import';
      const newResume = await createResume(importTitle);
      if (!newResume) throw new Error('Failed to create resume.');

      // Populate with parsed LinkedIn data
      const mergedData = {
        ...newResume,
        personalInfo: parsedData.personalInfo || {},
        summary: parsedData.summary || '',
        education: parsedData.education || [],
        experience: parsedData.experience || [],
        skills: parsedData.skills || [],
        projects: parsedData.projects || [],
      };
      await api.put(`/resumes/${newResume._id}`, mergedData);
      toast.success('Resume created from LinkedIn profile!');
      navigate(`/builder/${newResume._id}`);
    } catch (error) {
      console.error('LinkedIn import failed:', error);
      toast.error('Failed to import from LinkedIn. Please try again.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      const success = await deleteResume(id);
      if (success) {
        toast.success('Resume deleted.');
      } else {
        toast.error('Failed to delete resume.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar />
      
      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title="My Resumes">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsLinkedinModalOpen(true)}
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex text-xs"
            >
              <Linkedin className="h-3.5 w-3.5 mr-1.5" />
              Import LinkedIn
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="sm"
              icon={Plus}
            >
              Create Resume
            </Button>
          </div>
        </Navbar>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Mobile Only: Create Floating Button replacement */}
          <div className="md:hidden mb-6 flex flex-col gap-3">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              className="w-full shadow-lg shadow-accent/20 py-3"
              icon={Plus}
            >
              Create New Resume
            </Button>
            <Button
              onClick={() => setIsLinkedinModalOpen(true)}
              variant="secondary"
              className="w-full py-3"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              Import from LinkedIn
            </Button>
          </div>

          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-text-secondary font-medium font-sans">Loading your dashboard...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 border border-dashed border-dark-border rounded-2xl bg-dark-card/10 max-w-xl mx-auto mt-6">
              <div className="w-14 h-14 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent mb-5 shadow-lg shadow-accent/10">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-text-primary mb-2">No resumes found</h3>
              <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
                Start crafting your professional story. Create a resume template and customize it with details, project tags, and AI bullet suggestions.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                icon={Plus}
                className="shadow-lg shadow-accent/20"
              >
                Create New Resume
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card
                  key={resume._id}
                  onClick={() => navigate(`/builder/${resume._id}`)}
                  className="flex flex-col justify-between group h-44 hover:border-accent/40 bg-dark-card/90"
                >
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="text-sm md:text-base font-heading font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                      {resume.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-medium tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-md uppercase">
                        {resume.template || 'minimal'}
                      </span>
                      {resume.isPublic && (
                        <span className="text-[10px] font-mono font-medium tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md uppercase">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-border/60">
                    <div className="flex items-center gap-1.5 text-text-secondary select-none">
                      <Calendar className="h-3.5 w-3.5 text-text-muted" />
                      <span className="text-[11px] font-sans font-medium text-text-muted">
                        Edited {formatDate(resume.updatedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/builder/${resume._id}`);
                        }}
                        className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-dark-hover transition-all focus:outline-none"
                        title="Edit Resume"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume._id, e)}
                        className="p-1.5 text-text-secondary hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all focus:outline-none"
                        title="Delete Resume"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Resume"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Resume Title"
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant="primary"
              size="sm"
              isLoading={actionLoading}
              className="shadow-lg shadow-accent/25"
            >
              Create Resume
            </Button>
          </div>
        </div>
      </Modal>

      {/* LinkedIn Import Modal */}
      <LinkedinImportModal
        isOpen={isLinkedinModalOpen}
        onClose={() => setIsLinkedinModalOpen(false)}
        onConfirm={handleLinkedinImport}
        confirmMessage="This will create a new resume pre-filled with your LinkedIn profile data. Continue?"
      />
    </div>
  );
}
