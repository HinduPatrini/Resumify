import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import Input from '../ui/Input';

export default function PersonalInfoForm() {
  const currentResume = useResumeStore((state) => state.currentResume);
  const updatePersonalInfo = useResumeStore((state) => state.updatePersonalInfo);

  if (!currentResume) return null;
  const info = currentResume.personalInfo || {};

  const handleChange = (field, val) => {
    updatePersonalInfo(field, val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
      <Input
        label="Full Name"
        placeholder="Alexander Wright"
        value={info.fullName || ''}
        onChange={(e) => handleChange('fullName', e.target.value)}
        className="sm:col-span-2"
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="alexander@domain.com"
        value={info.email || ''}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <Input
        label="Phone Number"
        placeholder="+1 (555) 019-2834"
        value={info.phone || ''}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <Input
        label="Location"
        placeholder="San Francisco, CA"
        value={info.location || ''}
        onChange={(e) => handleChange('location', e.target.value)}
        className="sm:col-span-2"
      />
      <Input
        label="LinkedIn Profile"
        placeholder="linkedin.com/in/alexander"
        value={info.linkedin || ''}
        onChange={(e) => handleChange('linkedin', e.target.value)}
      />
      <Input
        label="GitHub Profile"
        placeholder="github.com/alexander"
        value={info.github || ''}
        onChange={(e) => handleChange('github', e.target.value)}
      />
      <Input
        label="Portfolio / Website"
        placeholder="alexander.dev"
        value={info.portfolio || ''}
        onChange={(e) => handleChange('portfolio', e.target.value)}
        className="sm:col-span-2"
      />
    </div>
  );
}
