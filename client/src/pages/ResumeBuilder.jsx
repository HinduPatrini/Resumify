import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Check, CloudLightning, Copy, Download, Eye, Globe, 
  Loader2, Menu, QrCode, RefreshCw, Save, Share2, Sparkles, LayoutGrid, GripVertical, ChevronDown, Activity 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

// Zustand Store
import { useResumeStore } from '../store/resumeStore';

// Forms
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import SummaryForm from '../components/forms/SummaryForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import SkillsForm from '../components/forms/SkillsForm';
import ProjectsForm from '../components/forms/ProjectsForm';

// Live Preview
import ResumePreview from '../components/preview/ResumePreview';

// UI
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import AtsCheckerPanel from '../components/ai/AtsCheckerPanel';
import LinkedinImportModal from '../components/ai/LinkedinImportModal';

// DND Kit Core
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- PDF StyleSheet & Document ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#334155', lineHeight: 1.5 },
  header: { borderBottomWidth: 1.5, borderBottomColor: '#cbd5e1', paddingBottom: 10, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase', tracking: 1 },
  subHeader: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, color: '#64748b', fontSize: 8, marginTop: 4 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 3, marginBottom: 6, textTransform: 'uppercase', tracking: 0.5 },
  entry: { marginBottom: 8 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b' },
  entrySub: { flexDirection: 'row', justifyContent: 'space-between', color: '#475569', fontSize: 9, marginTop: 1 },
  bulletList: { marginTop: 4, paddingLeft: 8 },
  bulletItem: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 8, fontSize: 10, color: '#64748b' },
  bulletText: { flex: 1, fontSize: 9, color: '#334155' },
  skillsText: { fontSize: 9, color: '#334155' },
  projectTitle: { fontWeight: 'bold', color: '#1e293b' }
});

const formatDateHelper = (dateStr) => {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// React PDF Document rendering
const ResumePDFDocument = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], skills = [], projects = [], sectionOrder = [] } = data || {};
  const activeOrder = sectionOrder.length > 0 ? sectionOrder : ['summary', 'experience', 'projects', 'skills', 'education'];

  const renderHeader = () => (
    <View style={pdfStyles.header}>
      <Text style={pdfStyles.name}>{personalInfo.fullName || 'Name'}</Text>
      <View style={pdfStyles.subHeader}>
        {personalInfo.email && <Text>{personalInfo.email}</Text>}
        {personalInfo.phone && <Text>• {personalInfo.phone}</Text>}
        {personalInfo.location && <Text>• {personalInfo.location}</Text>}
        {personalInfo.portfolio && <Text>• {personalInfo.portfolio}</Text>}
        {personalInfo.linkedin && <Text>• {personalInfo.linkedin}</Text>}
        {personalInfo.github && <Text>• {personalInfo.github}</Text>}
      </View>
    </View>
  );

  const renderSummary = () => summary && (
    <View style={pdfStyles.section} key="summary">
      <Text style={pdfStyles.sectionTitle}>Summary</Text>
      <Text style={{ fontSize: 9, color: '#334155', textAlign: 'justify' }}>{summary}</Text>
    </View>
  );

  const renderExperience = () => experience.length > 0 && (
    <View style={pdfStyles.section} key="experience">
      <Text style={pdfStyles.sectionTitle}>Experience</Text>
      {experience.map((exp, idx) => (
        <View key={idx} style={pdfStyles.entry}>
          <View style={pdfStyles.entryHeader}>
            <Text style={{ fontWeight: 'bold' }}>{exp.role || 'Role'} at {exp.company || 'Company'}</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>
              {formatDateHelper(exp.startDate)} — {formatDateHelper(exp.endDate)}
            </Text>
          </View>
          {exp.bullets && exp.bullets.length > 0 && (
            <View style={pdfStyles.bulletList}>
              {exp.bullets.map((bullet, bIdx) => bullet.trim() && (
                <View key={bIdx} style={pdfStyles.bulletItem}>
                  <Text style={pdfStyles.bulletDot}>•</Text>
                  <Text style={pdfStyles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderProjects = () => projects.length > 0 && (
    <View style={pdfStyles.section} key="projects">
      <Text style={pdfStyles.sectionTitle}>Projects</Text>
      {projects.map((proj, idx) => (
        <View key={idx} style={pdfStyles.entry}>
          <View style={pdfStyles.entryHeader}>
            <Text style={pdfStyles.projectTitle}>{proj.title || 'Project'}</Text>
            {proj.link && <Text style={{ fontSize: 8, color: '#64748b' }}>{proj.link}</Text>}
          </View>
          {proj.description && <Text style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>{proj.description}</Text>}
          {proj.techStack && proj.techStack.length > 0 && (
            <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2, fontStyle: 'italic' }}>
              Technologies: {proj.techStack.join(', ')}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderSkills = () => skills.length > 0 && (
    <View style={pdfStyles.section} key="skills">
      <Text style={pdfStyles.sectionTitle}>Skills</Text>
      <Text style={pdfStyles.skillsText}>{skills.join(' • ')}</Text>
    </View>
  );

  const renderEducation = () => education.length > 0 && (
    <View style={pdfStyles.section} key="education">
      <Text style={pdfStyles.sectionTitle}>Education</Text>
      {education.map((edu, idx) => (
        <View key={idx} style={pdfStyles.entry}>
          <View style={pdfStyles.entryHeader}>
            <Text style={{ fontWeight: 'bold' }}>{edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>
              {formatDateHelper(edu.startDate)} — {formatDateHelper(edu.endDate)}
            </Text>
          </View>
          <View style={pdfStyles.entrySub}>
            <Text>{edu.institution || 'School'}</Text>
            {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
          </View>
        </View>
      ))}
    </View>
  );

  const sectionMap = {
    summary: renderSummary(),
    experience: renderExperience(),
    projects: renderProjects(),
    skills: renderSkills(),
    education: renderEducation()
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {renderHeader()}
        {activeOrder.map(secKey => sectionMap[secKey])}
      </Page>
    </Document>
  );
};

// --- Sortable Accordion Wrapper Component ---
function SortableAccordion({ id, title, isExpanded, onToggle, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="border border-dark-border rounded-xl bg-dark-card/40 overflow-hidden mb-4 transition-all"
    >
      {/* Accordion Trigger Head */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-dark-card select-none">
        <div className="flex items-center gap-3">
          {/* Grab Handle: Hidden on mobile to support clean scrolls */}
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab p-1 text-text-muted hover:text-white transition-colors hidden md:block shrink-0 focus:outline-none"
            title="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <button 
            type="button" 
            onClick={onToggle}
            className="font-heading font-semibold text-text-primary text-sm hover:text-accent transition-colors focus:outline-none text-left"
          >
            {title}
          </button>
        </div>
        
        <button 
          type="button" 
          onClick={onToggle}
          className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-dark-hover focus:outline-none transition-colors"
        >
          <ChevronDown className={`h-4.5 w-4.5 transition-transform duration-250 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Accordion Expandable Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-5 border-t border-dark-border bg-dark-card/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Builder Page ---
export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Zustand State
  const { 
    currentResume, fetchResumeById, updateField, updateSectionList, saveCurrentResume, saving, loading 
  } = useResumeStore();

  // Local UI State
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' vs 'preview' (mobile toggle)
  const [expandedSection, setExpandedSection] = useState('personal'); // accordion state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [isLinkedinModalOpen, setIsLinkedinModalOpen] = useState(false);

  // Sensors for Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch Resume details on Load
  useEffect(() => {
    fetchResumeById(id).then((data) => {
      if (data) {
        setTempTitle(data.title);
      }
    });
  }, [id, fetchResumeById]);

  // Debounced auto-save triggers whenever currentResume contents update
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!currentResume) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCurrentResume();
    }, 1500); // 1.5 seconds

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [currentResume, saveCurrentResume]);

  if (loading && !currentResume) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin text-accent" />
        <p className="text-sm text-text-secondary font-medium">Loading builder workspace...</p>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 gap-4">
        <h3 className="text-xl font-heading font-bold text-text-primary">Resume workspace not found</h3>
        <p className="text-sm text-text-secondary max-w-sm">The document either was removed or you lack permissions to view it.</p>
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Define sortable list keys for builder sections (major builder components)
  const sectionsConfig = {
    summary: { title: '💡 Summary / Objective', component: <SummaryForm /> },
    experience: { title: '💼 Professional Experience', component: <ExperienceForm /> },
    projects: { title: '🚀 Projects & Portfolio', component: <ProjectsForm /> },
    skills: { title: '🛠️ Skills & Technologies', component: <SkillsForm /> },
    education: { title: '🎓 Education History', component: <EducationForm /> },
  };

  const sectionOrder = currentResume.sectionOrder || ['summary', 'experience', 'projects', 'skills', 'education'];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);

    updateField('sectionOrder', newOrder);
  };

  // Share Actions
  const shareUrl = `${window.location.origin}/r/${currentResume.slug || currentResume._id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Public resume link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublic = async () => {
    const nextState = !currentResume.isPublic;
    updateField('isPublic', nextState);
    toast.success(nextState ? 'Resume is now public' : 'Resume is now private');
  };

  const handleRename = () => {
    if (!tempTitle.trim()) {
      toast.error('Title cannot be empty.');
      return;
    }
    updateField('title', tempTitle.trim());
    setIsRenaming(false);
    toast.success('Title updated (saving...)');
  };

  const handleLinkedinImport = (parsedData) => {
    if (!currentResume) return;
    
    // Merge parsed LinkedIn data into currentResume
    const updatedResume = {
      ...currentResume,
      personalInfo: {
        ...currentResume.personalInfo,
        ...parsedData.personalInfo
      },
      summary: parsedData.summary || currentResume.summary,
      education: parsedData.education || currentResume.education,
      experience: parsedData.experience || currentResume.experience,
      skills: parsedData.skills || currentResume.skills,
      projects: parsedData.projects || currentResume.projects,
    };
    
    // Update store state directly to trigger debounced auto-save
    useResumeStore.setState({ currentResume: updatedResume });
    toast.success('Resume fields updated from LinkedIn!');
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      
      {/* Top Builder Sticky Header */}
      <header className="bg-dark-card border-b border-dark-border py-3 px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-dark-hover transition-colors shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* Editable Title */}
          {isRenaming ? (
            <div className="flex items-center gap-2 max-w-xs sm:max-w-sm">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') {
                    setTempTitle(currentResume.title);
                    setIsRenaming(false);
                  }
                }}
                className="bg-dark-input text-text-primary text-sm font-heading font-semibold border border-accent rounded-lg px-2.5 py-1 focus:outline-none max-w-full"
                autoFocus
              />
              <Button onClick={handleRename} variant="primary" size="sm" className="px-2 py-1 h-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group min-w-0">
              <h2 
                onClick={() => setIsRenaming(true)}
                className="text-sm md:text-base font-heading font-bold text-text-primary truncate cursor-pointer hover:text-accent hover:underline decoration-dashed transition-colors"
                title="Click to rename"
              >
                {currentResume.title}
              </h2>
            </div>
          )}

          {/* Auto-Save Indicator status text */}
          <div className="flex items-center gap-1.5 ml-2 text-[11px] font-sans text-text-secondary select-none shrink-0 bg-dark-input/50 px-2.5 py-1 rounded-full border border-dark-border/40">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
                <span className="text-amber-400">Saving...</span>
              </>
            ) : (
              <>
                <Check className="h-3 w-3 text-green-400" />
                <span className="text-green-400">Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Action Panel: Share & PDF Export */}
        <div className="flex items-center gap-2 shrink-0">
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
            onClick={() => setIsShareModalOpen(true)}
            variant="secondary"
            size="sm"
            icon={Share2}
            className="hidden sm:inline-flex text-xs"
          >
            Share
          </Button>

          {/* Dynamic Export PDF Button using @react-pdf/renderer Link */}
          <PDFDownloadLink
            document={<ResumePDFDocument data={currentResume} />}
            fileName={`${(currentResume.title || 'resume').toLowerCase().replace(/\s+/g, '-')}.pdf`}
          >
            {({ blob, url, loading: pdfLoading, error }) => (
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                disabled={pdfLoading}
                className="text-xs shadow-md shadow-accent/25 focus:ring-accent/40"
              >
                {pdfLoading ? 'Loading PDF...' : 'Export PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </header>

      {/* Screen Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* Mobile Tab Control segment (only shows on small viewport < md) */}
        <div className="md:hidden flex border-b border-dark-border bg-dark-card/65 sticky top-0 z-10 shrink-0 select-none">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-3 text-xs font-heading font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'editor' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-text-secondary'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Editor Form
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 text-xs font-heading font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preview' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-text-secondary'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex-1 py-3 text-xs font-heading font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ats' ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-text-secondary'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            ATS Check
          </button>
        </div>

        {/* LEFT WORKSPACE: Forms editor */}
        <section 
          className={`
            flex-1 h-full overflow-y-auto p-4 md:p-6 md:border-r border-dark-border flex flex-col gap-4 max-w-full md:max-w-[50%] shrink-0
            ${activeTab === 'editor' || activeTab === 'ats' ? 'block' : 'hidden md:block'}
          `}
        >
          {/* Desktop Left Column Tab Switcher */}
          <div className="hidden md:flex border border-dark-border bg-dark-card/25 rounded-xl p-1 mb-2 select-none">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'editor' ? 'bg-accent text-white shadow-md font-bold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Editor Form
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ats' ? 'bg-accent text-white shadow-md font-bold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              ATS Audit Check
            </button>
          </div>
          {activeTab === 'editor' ? (
            <>
              {/* Template Switcher Ribbon inside the editor */}
              <div className="bg-dark-card/45 border border-dark-border rounded-xl p-4 flex flex-col gap-3 select-none">
                <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase">
                  Select Resume Template Layout
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['minimal', 'modern', 'classic'].map((styleName) => (
                    <button
                      key={styleName}
                      type="button"
                      onClick={() => updateField('template', styleName)}
                      className={`
                        py-2.5 px-2 rounded-lg font-heading text-xs font-semibold capitalize border transition-all text-center focus:outline-none
                        ${
                          (currentResume.template || 'minimal').toLowerCase() === styleName
                            ? 'bg-accent text-white border-accent shadow-md shadow-accent/15'
                            : 'bg-dark-input text-text-secondary border-dark-border hover:bg-dark-hover hover:text-text-primary'
                        }
                      `}
                    >
                      {styleName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible/Accordion Forms list */}
              <div className="flex flex-col">
                
                {/* Personal Details (Static, always at the top) */}
                <div className="border border-dark-border rounded-xl bg-dark-card/40 overflow-hidden mb-4">
                  <div 
                    onClick={() => setExpandedSection(expandedSection === 'personal' ? null : 'personal')}
                    className="flex items-center justify-between px-4 py-3.5 bg-dark-card cursor-pointer select-none"
                  >
                    <span className="font-heading font-semibold text-text-primary text-sm hover:text-accent transition-colors">
                      👤 Personal Information
                    </span>
                    <ChevronDown className={`h-4.5 w-4.5 text-text-secondary transition-transform duration-250 ${expandedSection === 'personal' ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence initial={false}>
                    {expandedSection === 'personal' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 border-t border-dark-border bg-dark-card/10">
                          <PersonalInfoForm />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* DND Context for other sections */}
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCenter} 
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map((sectionId) => {
                      const sectionData = sectionsConfig[sectionId];
                      if (!sectionData) return null;
                      return (
                        <SortableAccordion
                          key={sectionId}
                          id={sectionId}
                          title={sectionData.title}
                          isExpanded={expandedSection === sectionId}
                          onToggle={() => setExpandedSection(expandedSection === sectionId ? null : sectionId)}
                        >
                          {sectionData.component}
                        </SortableAccordion>
                      );
                    })}
                  </SortableContext>
                </DndContext>

              </div>
            </>
          ) : (
            <AtsCheckerPanel resumeId={id} />
          )}
        </section>

        {/* RIGHT WORKSPACE: Live Preview panel */}
        <section 
          className={`
            flex-1 h-full bg-[#1b1e2b]/50 p-4 md:p-6 overflow-y-auto items-center justify-center
            ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}
          `}
        >
          {/* A4 simulated box wrapping preview template */}
          <div className="w-full max-w-[800px] shadow-2xl rounded-xl border border-dark-border overflow-hidden bg-white shrink-0 mb-6">
            <div className="preview-container overflow-hidden w-full relative">
              <ResumePreview data={currentResume} />
            </div>
          </div>
        </section>

      </div>

      {/* Share / Make Public Drawer Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Resume"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-dark-input border border-dark-border p-4 rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-heading font-semibold text-text-primary flex items-center gap-1.5 select-none">
                <Globe className="h-4 w-4 text-accent" />
                Make Resume Public
              </span>
              <span className="text-xs text-text-secondary select-none">
                Anyone with the link can view this CV read-only.
              </span>
            </div>
            
            {/* Toggle switch */}
            <button
              onClick={handleTogglePublic}
              className={`
                w-11 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 focus:outline-none
                ${currentResume.isPublic ? 'bg-accent' : 'bg-dark-border'}
              `}
            >
              <div 
                className={`
                  w-4 h-4 rounded-full bg-white transition-transform duration-200
                  ${currentResume.isPublic ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {currentResume.isPublic && (
            <div className="flex flex-col gap-5 border-t border-dark-border/40 pt-5">
              {/* Copyable link input */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-heading font-semibold text-text-secondary uppercase select-none">
                  Shareable Public URL
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-dark-input text-text-primary text-xs font-mono border border-dark-border rounded-lg px-3 py-2.5 truncate select-all">
                    {shareUrl}
                  </div>
                  <Button 
                    onClick={copyToClipboard}
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
                  </Button>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center gap-3 bg-dark-input/30 border border-dark-border/60 rounded-xl p-5">
                <span className="text-xs font-heading font-semibold text-text-secondary uppercase select-none">
                  QR Code for Mobile Scanning
                </span>
                <div className="bg-white p-3 rounded-lg shadow-inner select-none shrink-0">
                  <QRCodeSVG 
                    value={shareUrl} 
                    size={128} 
                    bgColor={"#FFFFFF"}
                    fgColor={"#0e1015"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                <span className="text-[10px] text-text-muted select-none">
                  Scan to load preview on your device.
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Mobile Floating Action Bottom Menu */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <Button
          onClick={() => setIsLinkedinModalOpen(true)}
          variant="secondary"
          size="md"
          className="shadow-xl rounded-full px-4 h-12 flex items-center justify-center gap-2 border border-dark-border bg-dark-card"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn Import
        </Button>
        
        <Button
          onClick={() => setIsShareModalOpen(true)}
          variant="secondary"
          size="md"
          className="shadow-xl rounded-full px-4 h-12 flex items-center justify-center gap-2 border border-dark-border bg-dark-card"
          icon={Share2}
        >
          Share
        </Button>
      </div>

      {/* LinkedIn Import Modal */}
      <LinkedinImportModal
        isOpen={isLinkedinModalOpen}
        onClose={() => setIsLinkedinModalOpen(false)}
        onConfirm={handleLinkedinImport}
        confirmMessage="This will overwrite your current resume details with the parsed LinkedIn profile data. Continue?"
      />
    </div>
  );
}
