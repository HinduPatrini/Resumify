import React from 'react';

export default function TemplateClassic({ data }) {
  const { personalInfo = {}, summary = '', education = [], experience = [], skills = [], projects = [], sectionOrder = [] } = data || {};
  const activeOrder = sectionOrder.length > 0 ? sectionOrder : ['summary', 'experience', 'projects', 'skills', 'education'];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderSummary = () => summary && (
    <div key="summary" className="flex flex-col gap-1">
      <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b border-slate-400 pb-0.5 select-none">
        Professional Summary
      </h2>
      <p className="text-slate-600 text-[11px] text-justify leading-relaxed">{summary}</p>
    </div>
  );

  const renderExperience = () => experience.length > 0 && (
    <div key="experience" className="flex flex-col gap-2">
      <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b border-slate-400 pb-0.5 select-none">
        Work History
      </h2>
      <div className="flex flex-col gap-3">
        {experience.map((exp, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 text-[11px]">
                {exp.company || 'Company'} — <span className="italic font-normal">{exp.role || 'Role'}</span>
              </h3>
              <span className="text-[10px] text-slate-600 shrink-0 font-sans">
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
      <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b border-slate-400 pb-0.5 select-none">
        Personal Projects
      </h2>
      <div className="flex flex-col gap-3">
        {projects.map((proj, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5 flex-wrap">
                <span>{proj.title || 'Project'}</span>
                {proj.link && (
                  <span className="text-[9px] text-slate-500 font-sans font-normal">
                    ({proj.link})
                  </span>
                )}
              </h3>
            </div>
            {proj.description && <p className="text-slate-600 text-[11px] text-justify">{proj.description}</p>}
            {proj.techStack && proj.techStack.length > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-600 font-sans">
                <span className="font-bold">Tech Stack:</span>
                <span>{proj.techStack.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => skills.length > 0 && (
    <div key="skills" className="flex flex-col gap-1">
      <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b border-slate-400 pb-0.5 select-none">
        Skills
      </h2>
      <p className="text-slate-600 text-[11px]">
        {skills.join(' • ')}
      </p>
    </div>
  );

  const renderEducation = () => education.length > 0 && (
    <div key="education" className="flex flex-col gap-2">
      <h2 className="text-xs font-bold text-slate-950 tracking-wider uppercase border-b border-slate-400 pb-0.5 select-none">
        Education
      </h2>
      <div className="flex flex-col gap-2.5">
        {education.map((edu, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 text-[11px]">{edu.institution || 'Institution'}</h3>
              <span className="text-[10px] text-slate-600 shrink-0 font-sans">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 text-[11px]">
              <span>
                {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </span>
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
    return activeOrder.map(id => sectionMap[id]);
  };

  return (
    <div className="p-8 bg-white text-slate-800 h-full font-serif text-xs flex flex-col gap-5 select-none overflow-y-auto leading-relaxed text-left">
      {/* Centered Classic Header */}
      <div className="flex flex-col items-center text-center gap-1.5 pb-3 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-slate-600 text-[10px] font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolio && (
            <span>
              • <span className="underline">{personalInfo.portfolio}</span>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              • <span className="underline">{personalInfo.linkedin}</span>
            </span>
          )}
          {personalInfo.github && (
            <span>
              • <span className="underline">{personalInfo.github}</span>
            </span>
          )}
        </div>
      </div>

      {/* Render Dynamic Sorted Sections */}
      {renderSections()}
    </div>
  );
}
