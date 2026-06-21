import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EducationForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionList = useResumeStore((state) => state.updateSectionList);

  if (!currentResume) return null;
  const education = currentResume.education || [];

  const handleAdd = () => {
    const newEntry = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    updateSectionList('education', [...education, newEntry]);
  };

  const handleRemove = (index) => {
    const updated = education.filter((_, idx) => idx !== index);
    updateSectionList('education', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = education.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSectionList('education', updated);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {education.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-dark-border rounded-xl bg-dark-card/20 select-none">
          <p className="text-sm text-text-secondary">No education entries added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {education.map((item, idx) => (
            <div 
              key={item._id || idx} 
              className="relative p-5 border border-dark-border rounded-xl bg-dark-card/40 flex flex-col gap-4 group"
            >
              {/* Delete button top right */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-4 right-4 text-text-secondary hover:text-red-400 p-1.5 rounded-lg hover:bg-dark-hover transition-colors focus:outline-none"
                title="Remove education"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>

              <h4 className="text-xs font-heading font-bold text-accent uppercase tracking-wider select-none">
                Education #{idx + 1}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <Input
                  label="School / Institution"
                  placeholder="e.g. Stanford University"
                  value={item.institution || ''}
                  onChange={(e) => handleChange(idx, 'institution', e.target.value)}
                  className="sm:col-span-2"
                />
                
                <Input
                  label="Degree"
                  placeholder="e.g. Bachelor of Science"
                  value={item.degree || ''}
                  onChange={(e) => handleChange(idx, 'degree', e.target.value)}
                />

                <Input
                  label="Field of Study"
                  placeholder="e.g. Computer Science"
                  value={item.fieldOfStudy || ''}
                  onChange={(e) => handleChange(idx, 'fieldOfStudy', e.target.value)}
                />

                {/* Start Date Datepicker */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
                    Start Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={parseDate(item.startDate)}
                      onChange={(date) => handleChange(idx, 'startDate', date ? date.toISOString() : '')}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="MM/YYYY"
                      className="w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                    />
                    <Calendar className="absolute right-3 top-3 h-4.5 w-4.5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* End Date Datepicker */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
                    End Date (or Expected)
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={parseDate(item.endDate)}
                      onChange={(date) => handleChange(idx, 'endDate', date ? date.toISOString() : '')}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="MM/YYYY"
                      className="w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                    />
                    <Calendar className="absolute right-3 top-3 h-4.5 w-4.5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <Input
                  label="GPA / Grade"
                  placeholder="e.g. 3.8 / 4.0"
                  value={item.gpa || ''}
                  onChange={(e) => handleChange(idx, 'gpa', e.target.value)}
                  className="sm:col-span-2"
                />
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
        Add Education Entry
      </Button>
    </div>
  );
}
