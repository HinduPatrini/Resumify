import React from 'react';

export default function TemplateMinimal({ data }) {
  const { personalInfo = {}, summary = '', education = [], experience = [], skills = [], projects = [], sectionOrder = [] } = data || {};
  const activeOrder = sectionOrder.length > 0 ? sectionOrder : ['summary', 'experience', 'projects', 'skills', 'education'];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderSummary = () => summary && (
    <div key="summary" className="flex flex-col gap-1">
      <h2 className="text-[10px] font-bold text-slate-900 tracking-wider uppercase font-mono border-b border-slate-100 pb-1 select-none">
        Summary
      </h2>
      <p className="text-slate-600 text-[11px] text-justify">{summary}</p>
    </div>
  );

  const renderExperience = () => experience.length > 0 && (
    <div key="experience" className="flex flex-col gap-2">
      <h2 className="text-[10px] font-bold text-slate-900 tracking-wider uppercase font-mono border-b border-slate-100 pb-1 select-none">
        Experience
      </h2>
      <div className="flex flex-col gap-3">
        {experience.map((exp, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900">
                {exp.role || 'Role'} <span className="font-normal text-slate-500">at</span> {exp.company || 'Company'}
              </h3>
              <span className="text-[9px] text-slate-500 font-mono shrink-0">
                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
              </span>
            </div>
            {exp.bullets && exp.bullets.length > 0 && (
              <ul className="list-disc list-outside text-slate-600 pl-4 flex flex-col gap-0.5 mt-1 text-[11px]">
                {exp.bullets.map((bullet, bIdx) => bullet.trim() && (
                  <li key={bIdx} className="text-justify">{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => projects.length > 0 && (
    <div key="projects" className="flex flex-col gap-2">
      <h2 className="text-[10px] font-bold text-slate-900 tracking-wider uppercase font-mono border-b border-slate-100 pb-1 select-none">
        Projects
      </h2>
      <div className="flex flex-col gap-3">
        {projects.map((proj, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>{proj.title || 'Project Title'}</span>
                {proj.link && (
                  <span className="text-[9px] text-slate-400 font-mono font-normal">
                    ({proj.link})
                  </span>
                )}
              </h3>
            </div>
            {proj.description && <p className="text-slate-600 text-[11px] text-justify">{proj.description}</p>}
            {proj.techStack && proj.techStack.length > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold text-slate-500 font-mono">Tech Stack:</span>
                <span className="text-[9px] text-slate-500 font-mono">{proj.techStack.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => skills.length > 0 && (
    <div key="skills" className="flex flex-col gap-1">
      <h2 className="text-[10px] font-bold text-slate-900 tracking-wider uppercase font-mono border-b border-slate-100 pb-1 select-none">
        Skills
      </h2>
      <p className="text-slate-600 text-[11px]">
        {skills.join(' • ')}
      </p>
    </div>
  );

  const renderEducation = () => education.length > 0 && (
    <div key="education" className="flex flex-col gap-2">
      <h2 className="text-[10px] font-bold text-slate-900 tracking-wider uppercase font-mono border-b border-slate-100 pb-1 select-none">
        Education
      </h2>
      <div className="flex flex-col gap-2.5">
        {education.map((edu, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900">
                {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </h3>
              <span className="text-[9px] text-slate-500 font-mono shrink-0">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>{edu.institution || 'Institution'}</span>
              {edu.gpa && <span className="font-mono text-[9px]">GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSections = () => {
    const sectionMap = {
      summary: renderSummary(),
      experience: renderExperience(),
      projects: renderProjects(),
      skills: renderSkills(),
      education: renderEducation()
    };
    return activeOrder.map(sectionId => sectionMap[sectionId]);
  };

  return (
    <div className="p-8 bg-white text-slate-800 h-full font-sans text-xs flex flex-col gap-5 select-none overflow-y-auto leading-relaxed text-left">
      {/* Header Info */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-950">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[10px] font-mono mt-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.portfolio && <span className="underline">{personalInfo.portfolio}</span>}
          {personalInfo.linkedin && <span className="underline">{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="underline">{personalInfo.github}</span>}
        </div>
      </div>

      {/* Render Dynamic Sorted Sections */}
      {renderSections()}
    </div>
  );
}
