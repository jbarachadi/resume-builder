import { create } from 'zustand';

export const useStore = create((set) => ({
  data: null,
  skills: {
    list1: [],
    list2: [],
  },
  selectedTemplate: 'Template1',
  setData: (newData) =>
    set((state) => ({
      data: newData,
      skills: {
        list1: newData?.sections?.missing_skills?.items?.map((item) => item.name) || [],
        list2: newData?.sections?.current_skills?.items?.map((item) => item.name) || [],
      },
    })),
  setSkills: (skills) =>
    set((state) => ({
      skills: skills,
    })),
  resetData: () => {
    localStorage.removeItem("uploadResponse");
    set({
      data: null,
      skills: {
        list1: [],
        list2: [],
      },
    });
  },
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));
