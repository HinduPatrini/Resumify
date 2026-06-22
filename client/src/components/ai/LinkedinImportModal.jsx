import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Clipboard, Loader2, Check, AlertCircle, 
  User, Briefcase, GraduationCap, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function LinkedinImportModal({
  isOpen,
  onClose,
  onConfirm,
  confirmMessage = "This will overwrite your current resume data. Continue?",
}) {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are supported.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are supported.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (activeTab === 'paste' && !rawText.trim()) {
      toast.error('Please paste your profile text first.');
      return;
    }
    if (activeTab === 'upload' && !file) {
      toast.error('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setParsedData(null);

    try {
      let response;
      if (activeTab === 'upload') {
        const formData = new FormData();
        formData.append('file', file);
        response = await api.post('/ai/parse-linkedin', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/ai/parse-linkedin', {
          rawText: rawText,
        });
      }

      setParsedData(response.data);
      toast.success('Profile parsed successfully!');
    } catch (error) {
      console.error('LinkedIn parsing failed:', error);
      toast.error(error.response?.data?.message || 'Could not read profile. Please try pasting text instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (parsedData) {
      onConfirm(parsedData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔗 Import from LinkedIn"
      className="max-w-xl md:max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {!parsedData ? (
          <>
            {/* Tab switchers */}
            <div className="flex border border-dark-border bg-dark-card/25 rounded-xl p-1 select-none">
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'paste' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Clipboard className="h-3.5 w-3.5" />
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'upload' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload PDF
              </button>
            </div>

            {/* Tab Content: Paste Text */}
            {activeTab === 'paste' && (
              <div className="flex flex-col gap-3">
                <div className="text-xs text-text-secondary leading-relaxed bg-dark-input/30 border border-dark-border/40 p-3 rounded-lg font-sans">
                  <strong>How to get your text:</strong> Go to your LinkedIn profile → click <strong>More</strong> (in the intro block) → click <strong>Save to PDF</strong>. Open the PDF, select all text (Ctrl+A), copy it, and paste it below. Or copy your profile text directly.
                </div>
                <textarea
                  placeholder="Paste your LinkedIn profile text here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={8}
                  disabled={loading}
                  className="w-full bg-dark-input text-text-primary border border-dark-border rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200 resize-y min-h-[160px]"
                />
              </div>
            )}

            {/* Tab Content: Upload PDF */}
            {activeTab === 'upload' && (
              <div className="flex flex-col gap-4">
                <div className="text-xs text-text-secondary leading-relaxed bg-dark-input/30 border border-dark-border/40 p-3 rounded-lg font-sans">
                  <strong>How to get PDF:</strong> Go to your LinkedIn profile page → click the <strong>More</strong> button → select <strong>Save to PDF</strong> from the dropdown menu.
                </div>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-dark-hover/30 hover:border-accent/45 ${
                    file ? 'border-accent/60 bg-accent/5' : 'border-dark-border/80 bg-dark-card/10'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    disabled={loading}
                  />
                  
                  {file ? (
                    <div className="flex items-center gap-3 bg-dark-input/80 border border-dark-border/80 px-4 py-3 rounded-xl max-w-full">
                      <FileText className="h-7 w-7 text-accent shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-text-primary truncate max-w-[200px] sm:max-w-[320px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="text-text-secondary hover:text-red-400 p-1 rounded-lg hover:bg-dark-hover shrink-0 transition-colors"
                        title="Clear file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-dark-input border border-dark-border flex items-center justify-center text-text-secondary">
                        <Upload className="h-5 w-5 text-text-muted" />
                      </div>
                      <div className="text-center flex flex-col gap-1 select-none">
                        <span className="text-xs font-heading font-semibold text-text-primary">
                          Drag and drop your LinkedIn PDF
                        </span>
                        <span className="text-[10px] text-text-muted">
                          or click to browse from device (PDF only)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-dark-border/40 mt-1">
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                variant="primary"
                size="sm"
                isLoading={loading}
                className="shadow-lg shadow-accent/20"
              >
                {loading ? 'Reading profile...' : 'Import Profile'}
              </Button>
            </div>
          </>
        ) : (
          /* Preview state after successful parsing */
          <div className="flex flex-col gap-5">
            {/* Extraction summary Header */}
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 select-none">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-heading font-bold uppercase tracking-wider">
                  Extraction Complete
                </span>
                <span className="text-[11px] text-emerald-500/90 font-medium">
                  We parsed the following sections successfully from your profile.
                </span>
              </div>
            </div>

            {/* Section Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 bg-dark-input/40 border border-dark-border/50 p-3.5 rounded-xl">
                <User className="h-4.5 w-4.5 text-accent shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-text-primary truncate">
                    {parsedData.personalInfo?.fullName || 'No Name found'}
                  </span>
                  <span className="text-[10px] text-text-muted truncate">
                    {parsedData.personalInfo?.email || parsedData.personalInfo?.location || 'Personal details'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-dark-input/40 border border-dark-border/50 p-3.5 rounded-xl">
                <Briefcase className="h-4.5 w-4.5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-primary">
                    {parsedData.experience?.length || 0} Work Entries
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Positions & Achievements
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-dark-input/40 border border-dark-border/50 p-3.5 rounded-xl">
                <GraduationCap className="h-4.5 w-4.5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-primary">
                    {parsedData.education?.length || 0} Schools
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Degrees & Studies
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-dark-input/40 border border-dark-border/50 p-3.5 rounded-xl">
                <FileText className="h-4.5 w-4.5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-text-primary">
                    {parsedData.skills?.length || 0} Skills
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Keywords extracted
                  </span>
                </div>
              </div>
            </div>

            {/* Warning block */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg text-xs text-amber-400 flex items-start gap-2 select-none leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{confirmMessage}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-dark-border/40 pt-4 mt-1">
              <Button
                type="button"
                onClick={() => setParsedData(null)}
                variant="ghost"
                size="sm"
              >
                Back / Re-upload
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  variant="primary"
                  size="sm"
                  className="shadow-lg shadow-accent/20"
                >
                  Confirm & Import
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
