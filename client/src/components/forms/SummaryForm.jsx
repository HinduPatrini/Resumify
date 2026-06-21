import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import Input from '../ui/Input';

export default function SummaryForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateField = useResumeStore((state) => state.updateField);

  if (!currentResume) return null;
  const summary = currentResume.summary || '';

  const handleChange = (e) => {
    updateField('summary', e.target.value);
  };

  const charCount = summary.length;

  return (
    <div className="flex flex-col gap-2 py-2">
      <Input
        label="Professional Summary"
        type="textarea"
        placeholder="Write a brief, compelling summary describing your background, skills, and key achievements..."
        value={summary}
        onChange={handleChange}
        rows={6}
      />
      <div className="flex justify-end text-xs font-mono text-text-secondary select-none">
        <span>
          Characters: <span className="text-accent font-semibold">{charCount}</span>
        </span>
      </div>
    </div>
  );
}
