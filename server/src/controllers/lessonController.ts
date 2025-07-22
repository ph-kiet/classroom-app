import { Request, Response } from "express";
import { createLessonSchema } from "../schemas/lessonSchema";
import { db } from "../config/firebase";
import { User } from "../models/user";

const LessonCollection = db.collection("lessons");
const StudentLessonCollection = db.collection("student-lessons");
const UserCollection = db.collection("users");

// GET /api/lessons
export const getAllLessons = async (req: Request, res: Response) => {
  try {
    // Get all lessons for instructor
    if (req.role === "instructor") {
      // Step 1: Query lessons where instructor is the auth instructor
      const lessonsQuery = LessonCollection.where(
        "instructor",
        "==",
        req.phoneNumber
      );
      const lessonsSnapshot = await lessonsQuery.get();

      // Step 2: Process each lesson and find assigned students
      const results = [];
      for (const lessonDoc of lessonsSnapshot.docs) {
        const lessonData = lessonDoc.data();
        const lessonId = lessonDoc.id;

        // Query in student-lessons for this lessonId
        const studentLessonsQuery = StudentLessonCollection.where(
          "lessonId",
          "==",
          lessonId
        );
        const studentLessonsSnapshot = await studentLessonsQuery.get();

        // Step 3: Get assigned students
        let students = [];
        for (const studentLessonDoc of studentLessonsSnapshot.docs) {
          const studentLessonData = studentLessonDoc.data();
          const studentId = studentLessonData.studentId;
          // Fetch student details from students collection
          const studentDoc = await UserCollection.doc(studentId).get();
          if (studentDoc.exists) {
            students.push({
              id: studentDoc.id,
              ...studentDoc.data(),
              completed: studentLessonData.completed,
            });
          }
        }

        // Add lesson with its students to results
        results.push({
          lesson_id: lessonId,
          ...lessonData,
          students,
        });
      }
      res.status(200).json({
        success: true,
        lessons: results,
      });
    } else {
      // Get all lessons for student

      // Get student id by phone number
      const query = UserCollection.where(
        "phoneNumber",
        "==",
        req.phoneNumber
      ).limit(1);
      const snapshot = await query.get();
      const studentId = snapshot.docs[0].id;

      // Step 1: Query in student-lessons by studentId
      const studentLessonsQuery = StudentLessonCollection.where(
        "studentId",
        "==",
        studentId
      );
      const studentLessonsSnapshot = await studentLessonsQuery.get();

      // Step 2: Process each student-lesson and find associated lesson
      const results = [];
      for (const studentLessonDoc of studentLessonsSnapshot.docs) {
        const studentLessonData = studentLessonDoc.data();
        const lessonId = studentLessonData.lessonId;

        const lessonDoc = await LessonCollection.doc(lessonId).get();

        if (lessonDoc.exists) {
          results.push({
            id: lessonDoc.id,
            completed: studentLessonData.completed,
            ...lessonDoc.data(),
            student: {},
          });
        }
      }

      res.status(200).json({
        success: true,
        lessons: results,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/lessons
// Boby: title, description, students
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { success, data } = createLessonSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Step 1: Get instructor id by phone number
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      req.phoneNumber
    ).limit(1);
    const snapshot = await query.get();
    const instructor = snapshot.docs[0].data();

    // Step 2: Add new lesson to lessons collection
    const newLessonRef = await LessonCollection.add({
      title: data.title,
      description: data.description,
      instructor: instructor.phoneNumber,
      instructorName: instructor.name,
    });

    const newLessonDoc = await newLessonRef.get();

    // Step 3: Add students to new lesson
    const students = [];
    for (const studentId of data.studentIds) {
      const studentDoc = await UserCollection.doc(studentId).get();
      students.push({
        id: studentDoc.id,
        ...studentDoc.data(),
      });

      await StudentLessonCollection.add({
        lessonId: newLessonRef.id,
        studentId: studentDoc.id,
        completed: false,
      });
    }

    res.status(200).json({
      success: true,
      lesson: {
        id: newLessonDoc.id,
        ...newLessonDoc.data(),
        students: students,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/lessons/makeCompleted/:lessonId
export const makeCompleted = async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  try {
    // Get student id by phone number
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      req.phoneNumber
    ).limit(1);
    const snapshot = await query.get();
    const studentId = snapshot.docs[0].id;

    const studentLessonsQuery = StudentLessonCollection.where(
      "lessonId",
      "==",
      lessonId
    )
      .where("studentId", "==", studentId)
      .limit(1);

    const studentLessonsSnapshot = await studentLessonsQuery.get();

    // Get the first matching document
    const studentLessonDoc = studentLessonsSnapshot.docs[0];
    const studentLessonRef = StudentLessonCollection.doc(studentLessonDoc.id);

    await studentLessonRef.update({ completed: true });

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
