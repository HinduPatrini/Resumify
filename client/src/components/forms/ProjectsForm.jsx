import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import Input from '../ui/Input';
import Button from '../ui/Button';
import TagInput from '../TagInput';

export default function ProjectsForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionList = useResumeStore((state) => state.updateSectionList);

  if (!currentResume) return null;
  const projects = currentResume.projects || [];

  const handleAdd = () => {
    const newEntry = {
      title: '',
      description: '',
      techStack: [],
      link: '',
    };
    updateSectionList('projects', [...projects, newEntry]);
  };

  const handleRemove = (index) => {
    const updated = projects.filter((_, idx) => idx !== index);
    updateSectionList('projects', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = projects.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSectionList('projects', updated);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {projects.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-dark-border rounded-xl bg-dark-card/20 select-none">
          <p className="text-sm text-text-secondary">No projects added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((item, idx) => (
            <div 
              key={item._id || idx} 
              className="relative p-5 border border-dark-border rounded-xl bg-dark-card/40 flex flex-col gap-4"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-4 right-4 text-text-secondary hover:text-red-400 p-1.5 rounded-lg hover:bg-dark-hover transition-colors focus:outline-none"
                title="Remove project"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>

              <h4 className="text-xs font-heading font-bold text-accent uppercase tracking-wider select-none">
                Project #{idx + 1}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <Input
                  label="Project Title"
                  placeholder="e.g. Resumify E-commerce"
                  value={item.title || ''}
                  onChange={(e) => handleChange(idx, 'title', e.target.value)}
                />

                <Input
                  label="Project Link / URL"
                  placeholder="e.g. github.com/username/project"
                  value={item.link || ''}
                  onChange={(e) => handleChange(idx, 'link', e.target.value)}
                />

                <Input
                  label="Description"
                  type="textarea"
                  placeholder="Outline key project deliverables, features built, achievements, or performance improvements..."
                  value={item.description || ''}
                  onChange={(e) => handleChange(idx, 'description', e.target.value)}
                  className="sm:col-span-2"
                  rows={3}
                />

                <div className="flex flex-col gap-1.5 sm:col-span-2 w-full">
                  <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none mb-1">
                    Tech Stack / Technologies Used
                  </label>
                  <TagInput
                    value={item.techStack || []}
                    onChange={(updatedStack) => handleChange(idx, 'techStack', updatedStack)}
                    placeholder="Type technology & press Enter (e.g. React, Docker, Redis)..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleAdd}
        variant="secondary"
        className="w-full border-dashed"
        icon={Plus}
      >
        Add Project Entry
      </Button>
    </div>
  );
}
