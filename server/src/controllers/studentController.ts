import { Request, Response } from "express";
import { db } from "../config/firebase";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../schemas/studentSchema";
import jwt from "jsonwebtoken";
import { sendSetupLink } from "../api/postmark";

const UserCollection = db.collection("users");

// GET /api/student/
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const authUser = req.phoneNumber;

    const query = UserCollection.where("instructor", "==", authUser);
    const snapshot = await query.get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/student/
// Body: name, phone number, email
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { success, data } = createStudentSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Check if phone number is exist
    const query = UserCollection.where("phoneNumber", "==", data.phoneNumber);
    const snapshot = await query.get();
    if (snapshot.docs[0]) {
      res.status(400).json({
        error: {
          type: "phoneNumber",
          message: "This phone number is associated to another user.",
        },
      });
      return;
    }

    const authUser = req.phoneNumber;

    const newStudentRef = await UserCollection.add({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      status: "pending",
      role: "student",
      instructor: authUser,
    });

    const newStudentDoc = await newStudentRef.get();

    // Create jwt for verifying student account
    const token = jwt.sign(
      { studentId: newStudentDoc.id, email: data.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    // Send setup link to student
    const link = `${process.env.CLIENT_URL}/account-setup?t=${token}`;
    await sendSetupLink(data.email, link);

    res.status(200).json({
      success: true,
      student: {
        id: newStudentDoc.id,
        ...newStudentDoc.data(),
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/student/:studentPhoneNumber
// Body: name, phone number
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { studentPhoneNumber } = req.params;
    const { success, data } = updateStudentSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Find user by phone number
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      studentPhoneNumber
    ).limit(1);
    const snapshot = await query.get();

    // Get the first matching document
    const userDoc = snapshot.docs[0];
    const userRef = UserCollection.doc(userDoc.id);
    const user = await userRef.get();

    // Update the user document
    await userRef.update({
      name: data.name,
      phoneNumber: data.phoneNumber,
    });

    // Retrieve the updated document
    const updatedDoc = await userRef.get();
    const updatedStudent = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    res.status(200).json({
      success: true,
      updatedStudent: updatedStudent,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/student/:studentPhoneNumber
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentPhoneNumber } = req.params;

    // Find user by phone number
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      studentPhoneNumber
    ).limit(1);
    const snapshot = await query.get();

    // Get the first matching document
    const studentDoc = snapshot.docs[0];
    const studentData = {
      id: studentDoc.id,
      ...studentDoc.data(),
    };

    // Delete the user document
    await UserCollection.doc(studentDoc.id).delete();

    res.status(200).json({
      success: true,
      deletedStudent: studentData,
    });
  } catch (error) {}
};
