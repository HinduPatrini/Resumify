import React from 'react';

export default function TemplateModern({ data }) {
  const { personalInfo = {}, summary = '', education = [], experience = [], skills = [], projects = [], sectionOrder = [] } = data || {};
  const activeOrder = sectionOrder.length > 0 ? sectionOrder : ['summary', 'experience', 'projects', 'skills', 'education'];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderSummary = () => summary && (
    <div key="summary" className="flex flex-col gap-1.5">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-1 select-none">
        Summary
      </h2>
      <p className="text-slate-600 text-[11px] leading-relaxed text-justify">{summary}</p>
    </div>
  );

  const renderExperience = () => experience.length > 0 && (
    <div key="experience" className="flex flex-col gap-2">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-1 select-none">
        Experience
      </h2>
      <div className="flex flex-col gap-3.5">
        {experience.map((exp, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 text-xs">{exp.role || 'Role'}</h3>
              <span className="text-[9px] text-slate-500 font-mono shrink-0">
                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
              </span>
            </div>
            <div className="text-slate-600 font-semibold">{exp.company || 'Company'}</div>
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
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-1 select-none">
        Projects
      </h2>
      <div className="flex flex-col gap-3.5">
        {projects.map((proj, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                <span>{proj.title || 'Project'}</span>
                {proj.link && (
                  <span className="text-[9px] text-slate-400 font-mono font-normal">
                    ({proj.link})
                  </span>
                )}
              </h3>
            </div>
            {proj.description && <p className="text-slate-600 text-[11px] text-justify">{proj.description}</p>}
            {proj.techStack && proj.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.techStack.map((tech, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Helper arrays for sidebar mapping
  const renderSidebarSkills = () => skills.length > 0 && (
    <div key="sidebar-skills" className="flex flex-col gap-2">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1 select-none">
        Skills
      </h2>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, idx) => (
          <span 
            key={idx} 
            className="bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded text-[9px] font-medium font-sans"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  const renderSidebarEducation = () => education.length > 0 && (
    <div key="sidebar-education" className="flex flex-col gap-3">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1 select-none">
        Education
      </h2>
      <div className="flex flex-col gap-3">
        {education.map((edu, idx) => (
          <div key={idx} className="flex flex-col gap-0.5 text-[10px]">
            <span className="font-bold text-slate-800">{edu.degree || 'Degree'}</span>
            {edu.fieldOfStudy && <span className="text-slate-600">{edu.fieldOfStudy}</span>}
            <span className="text-slate-500 font-mono text-[8px] mt-0.5 block">
              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
            </span>
            <span className="text-slate-600 italic block mt-0.5">{edu.institution}</span>
            {edu.gpa && <span className="font-mono text-[8px] text-slate-500">GPA: {edu.gpa}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // If skills or education are placed in the main body (due to sorting), render them there
  const renderSkills = () => skills.length > 0 && (
    <div key="skills" className="flex flex-col gap-1">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-1 select-none">
        Skills
      </h2>
      <p className="text-slate-600 text-[11px]">{skills.join(' • ')}</p>
    </div>
  );

  const renderEducation = () => education.length > 0 && (
    <div key="education" className="flex flex-col gap-2">
      <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-1 select-none">
        Education
      </h2>
      <div className="flex flex-col gap-3">
        {education.map((edu, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <div className="flex justify-between items-baseline">
              <h4 className="font-bold text-slate-800 text-[11px]">{edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h4>
              <span className="text-[8px] font-mono text-slate-500">{formatDate(edu.startDate)} — {formatDate(edu.endDate)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>{edu.institution}</span>
              {edu.gpa && <span>GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMainSections = () => {
    // For modern sidebar template, we render summary, experience, and projects in the main body.
    // If user orders skills or education, they will render in main. Otherwise, they appear in sidebar.
    const sectionMap = {
      summary: renderSummary(),
      experience: renderExperience(),
      projects: renderProjects(),
      skills: renderSkills(),
      education: renderEducation()
    };
    
    // To maintain sidebar design, filter out skills and education if they are NOT explicitly ordered,
    // but here we render whichever is in activeOrder.
    return activeOrder.map(id => sectionMap[id]);
  };

  return (
    <div className="grid grid-cols-3 bg-white text-slate-800 h-full font-sans text-xs select-none overflow-y-auto shadow-sm text-left">
      {/* Left Sidebar Pane (1/3 width) */}
      <div className="col-span-1 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase font-semibold select-none">
            Resume Profile
          </span>
        </div>

        {/* Contact info list */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[9px] font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1 select-none">
            Contact
          </h2>
          <div className="flex flex-col gap-2 text-[10px] text-slate-600 break-all">
            {personalInfo.email && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">Email</span>
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">Phone</span>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">Location</span>
                {personalInfo.location}
              </div>
            )}
            {personalInfo.portfolio && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">Website</span>
                <span className="underline">{personalInfo.portfolio}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">LinkedIn</span>
                <span className="underline">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <span className="font-semibold block text-slate-700 text-[9px] select-none">GitHub</span>
                <span className="underline">{personalInfo.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* Render Skills/Education in sidebar ONLY if not ordered in main list (or keep in sidebar to maintain template look) */}
        {renderSidebarSkills()}
        {renderSidebarEducation()}
      </div>

      {/* Right Main Body (2/3 width) */}
      <div className="col-span-2 p-6 flex flex-col gap-5">
        {/* Render other main components dynamically */}
        {renderMainSections().filter(item => {
          // If education or skills are rendering in main, we can let them.
          // However, to avoid duplicate rendering, we filter out what's already on sidebar unless the user drags it.
          // For simplicity, we just render the ordered list, which is highly robust.
          if (item?.key === 'skills' || item?.key === 'education') {
            return false; // already rendered in sidebar for modern template style
          }
          return true;
        })}
      </div>
    </div>
  );
}
