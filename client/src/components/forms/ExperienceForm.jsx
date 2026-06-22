import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Trash2, Plus, Calendar, Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

import ImproveBulletModal from '../ai/ImproveBulletModal';

export default function ExperienceForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updateSectionList = useResumeStore((state) => state.updateSectionList);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExpIdx, setActiveExpIdx] = useState(null);
  const [activeBulletIdx, setActiveBulletIdx] = useState(null);

  if (!currentResume) return null;
  const experience = currentResume.experience || [];

  const handleAddExperience = () => {
    const newEntry = {
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    };
    updateSectionList('experience', [...experience, newEntry]);
  };

  const handleRemoveExperience = (index) => {
    const updated = experience.filter((_, idx) => idx !== index);
    updateSectionList('experience', updated);
  };

  const handleChange = (index, field, value) => {
    const updated = experience.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateSectionList('experience', updated);
  };

  // Bullet CRUD
  const handleAddBullet = (expIdx) => {
    const expItem = experience[expIdx];
    const updatedBullets = [...(expItem.bullets || []), ''];
    handleChange(expIdx, 'bullets', updatedBullets);
  };

  const handleRemoveBullet = (expIdx, bulletIdx) => {
    const expItem = experience[expIdx];
    const updatedBullets = expItem.bullets.filter((_, idx) => idx !== bulletIdx);
    handleChange(expIdx, 'bullets', updatedBullets);
  };

  const handleBulletChange = (expIdx, bulletIdx, value) => {
    const expItem = experience[expIdx];
    const updatedBullets = expItem.bullets.map((b, idx) => (idx === bulletIdx ? value : b));
    handleChange(expIdx, 'bullets', updatedBullets);
  };

  const triggerImproveModal = (expIdx, bulletIdx) => {
    const currentBullet = experience[expIdx].bullets[bulletIdx];
    if (!currentBullet.trim()) {
      toast.error('Please type a bullet point before improving it.');
      return;
    }
    setActiveExpIdx(expIdx);
    setActiveBulletIdx(bulletIdx);
    setModalOpen(true);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {experience.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-dark-border rounded-xl bg-dark-card/20 select-none">
          <p className="text-sm text-text-secondary">No work experience entries added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {experience.map((item, expIdx) => (
            <div 
              key={item._id || expIdx} 
              className="relative p-5 border border-dark-border rounded-xl bg-dark-card/40 flex flex-col gap-4"
            >
              {/* Remove Entry button */}
              <button
                type="button"
                onClick={() => handleRemoveExperience(expIdx)}
                className="absolute top-4 right-4 text-text-secondary hover:text-red-400 p-1.5 rounded-lg hover:bg-dark-hover transition-colors focus:outline-none"
                title="Remove experience"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>

              <h4 className="text-xs font-heading font-bold text-accent uppercase tracking-wider select-none">
                Experience #{expIdx + 1}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <Input
                  label="Company Name"
                  placeholder="e.g. Google Inc."
                  value={item.company || ''}
                  onChange={(e) => handleChange(expIdx, 'company', e.target.value)}
                />

                <Input
                  label="Role / Title"
                  placeholder="e.g. Senior Software Engineer"
                  value={item.role || ''}
                  onChange={(e) => handleChange(expIdx, 'role', e.target.value)}
                />

                {/* Start Date */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
                    Start Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={parseDate(item.startDate)}
                      onChange={(date) => handleChange(expIdx, 'startDate', date ? date.toISOString() : '')}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="MM/YYYY"
                      className="w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                    />
                    <Calendar className="absolute right-3 top-3 h-4.5 w-4.5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
                    End Date (or Present)
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={parseDate(item.endDate)}
                      onChange={(date) => handleChange(expIdx, 'endDate', date ? date.toISOString() : '')}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      placeholderText="MM/YYYY"
                      className="w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200"
                    />
                    <Calendar className="absolute right-3 top-3 h-4.5 w-4.5 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bullets Sub-section */}
              <div className="flex flex-col gap-3 mt-2">
                <span className="text-xs font-heading font-semibold text-text-secondary tracking-wide uppercase select-none">
                  Responsibilities / Achievements
                </span>
                
                <div className="flex flex-col gap-3">
                  {(item.bullets || []).map((bullet, bulletIdx) => (
                    <div 
                      key={bulletIdx} 
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full bg-dark-input/20 border border-dark-border/40 p-2.5 rounded-lg"
                    >
                      <input
                        type="text"
                        placeholder="Detail an achievement (e.g. Led design of...)"
                        value={bullet}
                        onChange={(e) => handleBulletChange(expIdx, bulletIdx, e.target.value)}
                        className="flex-1 bg-transparent border-0 outline-none text-sm text-text-primary px-1 focus:ring-0"
                      />
                      
                      <div className="flex items-center justify-end gap-1.5 border-t border-dark-border/40 sm:border-0 pt-2 sm:pt-0 shrink-0">
                        {/* Improve Bullet Button */}
                        <Button
                          onClick={() => triggerImproveModal(expIdx, bulletIdx)}
                          variant="ghost"
                          size="sm"
                          className="text-[#a78bfa] hover:text-white hover:bg-accent/15 px-2.5 py-1 text-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1" />
                          AI Improve
                        </Button>
                        
                        {/* Remove Bullet Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(expIdx, bulletIdx)}
                          className="text-text-muted hover:text-red-400 p-1 rounded-lg hover:bg-dark-hover transition-colors focus:outline-none"
                          title="Remove bullet"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleAddBullet(expIdx)}
                  variant="ghost"
                  size="sm"
                  className="self-start text-xs border border-dashed border-dark-border/60 text-text-secondary hover:text-text-primary mt-1"
                  icon={Plus}
                >
                  Add Bullet Point
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleAddExperience}
        variant="secondary"
        className="w-full border-dashed"
        icon={Plus}
      >
        Add Work Experience
      </Button>

      {modalOpen && activeExpIdx !== null && activeBulletIdx !== null && (
        <ImproveBulletModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveExpIdx(null);
            setActiveBulletIdx(null);
          }}
          bulletText={experience[activeExpIdx]?.bullets[activeBulletIdx] || ''}
          jobTitle={experience[activeExpIdx]?.role || ''}
          onSelect={(selectedText) => {
            const expItem = experience[activeExpIdx];
            const updatedBullets = expItem.bullets.map((b, idx) => (idx === activeBulletIdx ? selectedText : b));
            handleChange(activeExpIdx, 'bullets', updatedBullets);
          }}
        />
      )}
    </div>
  );
}
