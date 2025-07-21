import { create, StateCreator } from "zustand";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface IStudent {
  id: string;
  name: string;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  completed: boolean;
  students: IStudent[];
}

interface Store {
  lessons: ILesson[];
  loadLessons: () => Promise<void>;
  addLesson: (lesson: ILesson) => void;
  makeDone: (lessonId: string) => void;
}

const lessonStore: StateCreator<Store> = (set) => ({
  lessons: [],
  loadLessons: async () => {
    try {
      const response = await fetch(`${SERVER_URL}/lessons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      set({ lessons: data.lessons });
    } catch (error) {
      console.error(error);
    }
  },
  addLesson: (lesson) =>
    set((state) => ({ lessons: [...state.lessons, lesson] })),
  makeDone: (lessonId) =>
    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ),
    })),
});

const useLessonStore = create(lessonStore);

export default useLessonStore;
