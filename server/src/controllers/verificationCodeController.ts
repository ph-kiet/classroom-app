import { db } from "../config/firebase";
import { VerificationCode } from "../models/verificationCode";

const VerificationCodeCollection = db.collection("verification-codes");

// Return true if user has a verification code, false otherwise
export const hasVerificationCode = async (id: string) => {
  try {
    const docRef = VerificationCodeCollection.doc(id);
    const docSnapshot = await docRef.get();

    return docSnapshot.exists;
  } catch (error: any) {
    console.error(error.message);
  }
};

// Delete the existing code
export const deleteVerificationCode = async (id: string) => {
  try {
    await VerificationCodeCollection.doc(id).delete();
  } catch (error: any) {
    console.error(error.message);
  }
};

// Add new code
export const addVerificationCode = async (id: string, code: string) => {
  try {
    const docRef = VerificationCodeCollection.doc(id);
    await docRef.set({
      code,
    });
  } catch (error: any) {
    console.error(error.message);
  }
};

// Get code by id
export const getCodeById = async (id: string) => {
  try {
    const docRef = VerificationCodeCollection.doc(id);
    const docSnapshot = await docRef.get();

    const { code } = docSnapshot.data() as VerificationCode;
    return code;
  } catch (error: any) {
    console.error(error.message);
  }
};
