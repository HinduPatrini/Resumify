import { create } from 'zustand';
import api from '../api/axios';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  loading: false,
  saving: false,

  fetchResumes: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/resumes');
      set({ resumes: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching resumes:', error);
      set({ loading: false });
    }
  },

  fetchResumeById: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/resumes/${id}`);
      set({ currentResume: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching resume by ID:', error);
      set({ loading: false, currentResume: null });
      return null;
    }
  },

  createResume: async (title) => {
    set({ loading: true });
    try {
      const response = await api.post('/resumes', { title });
      const newResume = response.data;
      set((state) => ({
        resumes: [newResume, ...state.resumes],
        currentResume: newResume,
        loading: false,
      }));
      return newResume;
    } catch (error) {
      console.error('Error creating resume:', error);
      set({ loading: false });
      return null;
    }
  },

  updateResume: async (id, updatedData) => {
    set({ saving: true });
    try {
      const response = await api.put(`/resumes/${id}`, updatedData);
      set((state) => ({
        currentResume: response.data,
        resumes: state.resumes.map((r) => (r._id === id ? response.data : r)),
        saving: false,
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating resume:', error);
      set({ saving: false });
      return null;
    }
  },

  deleteResume: async (id) => {
    try {
      await api.delete(`/resumes/${id}`);
      set((state) => ({
        resumes: state.resumes.filter((r) => r._id !== id),
        currentResume: state.currentResume?._id === id ? null : state.currentResume,
      }));
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      return false;
    }
  },

  setResume: (resume) => {
    set({ currentResume: resume });
  },

  resetResume: () => {
    set({ currentResume: null });
  },

  // State local modifiers (syncs state instantly, trigger auto-save next)
  updateField: (field, value) => {
    set((state) => {
      if (!state.currentResume) return {};
      return {
        currentResume: {
          ...state.currentResume,
          [field]: value,
        },
      };
    });
  },

  updatePersonalInfo: (field, value) => {
    set((state) => {
      if (!state.currentResume) return {};
      const personalInfo = state.currentResume.personalInfo || {};
      return {
        currentResume: {
          ...state.currentResume,
          personalInfo: {
            ...personalInfo,
            [field]: value,
          },
        },
      };
    });
  },

  updateSectionList: (section, newList) => {
    set((state) => {
      if (!state.currentResume) return {};
      return {
        currentResume: {
          ...state.currentResume,
          [section]: newList,
        },
      };
    });
  },

  saveCurrentResume: async () => {
    const { currentResume } = get();
    if (!currentResume || !currentResume._id) return;
    set({ saving: true });
    try {
      const response = await api.put(`/resumes/${currentResume._id}`, currentResume);
      // Only set if the saving operation is still relevant
      set((state) => {
        if (state.currentResume?._id !== currentResume._id) return {};
        return {
          currentResume: response.data,
          saving: false,
        };
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      set({ saving: false });
    }
  },
}));
