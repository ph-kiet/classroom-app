import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Load service account credentials from environment variables
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
export const db = getFirestore(app);
