import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import TagInput from '../TagInput';

export default function SkillsForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionList = useResumeStore((state) => state.updateSectionList);

  if (!currentResume) return null;
  const skills = currentResume.skills || [];

  const handleSkillsChange = (updated) => {
    updateSectionList('skills', updated);
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none mb-1">
        Skills & Technologies
      </label>
      <TagInput
        value={skills}
        onChange={handleSkillsChange}
        placeholder="Type skill & press Enter (e.g. React, Node.js, AWS)..."
      />
    </div>
  );
}
