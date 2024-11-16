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
  setSkills: (list1, list2) =>
    set((state) => ({
      skills: { list1: list1 || state.skills.list1, list2: list2 || state.skills.list2 },
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
  setTemplate: (template) => set({ selectedTemplate: template }),
}));
