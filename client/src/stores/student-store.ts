import { create, StateCreator } from "zustand";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface IStudent {
  id: string;
  phoneNumber: string;
  name: string;
  email: string;
  status: string;
}

interface Store {
  students: IStudent[];
  selectedStudent: IStudent | null;
  setSelectedStudent: (student: IStudent) => void;
  loadStudents: () => Promise<void>;
  addStudent: (student: IStudent) => void;
  updateStudent: (updatedStudent: IStudent) => void;
  deleteStudent: (targetedStudent: IStudent) => void;
}

const studentStore: StateCreator<Store> = (set) => ({
  students: [],
  selectedStudent: null,
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  loadStudents: async () => {
    try {
      const response = await fetch(`${SERVER_URL}/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      set({ students: data.students });
    } catch (error) {
      console.error(error);
    }
  },
  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),
  updateStudent: (updatedStudent) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      ),
    })),
  deleteStudent: (targetedStudent) =>
    set((state) => ({
      students: state.students.filter(
        (student) => student.id !== targetedStudent.id
      ),
    })),
});

const useStudentStore = create(studentStore);

export default useStudentStore;
