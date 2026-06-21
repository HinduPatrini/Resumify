import React from 'react';
import TemplateMinimal from './TemplateMinimal';
import TemplateModern from './TemplateModern';
import TemplateClassic from './TemplateClassic';

export default function ResumePreview({ data }) {
  if (!data) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center text-slate-400 p-6 select-none font-sans text-center">
        <p className="text-sm">Fill in your information to start previewing.</p>
      </div>
    );
  }

  const template = data.template || 'minimal';

  switch (template.toLowerCase()) {
    case 'modern':
      return <TemplateModern data={data} />;
    case 'classic':
      return <TemplateClassic data={data} />;
    case 'minimal':
    default:
      return <TemplateMinimal data={data} />;
  }
}
