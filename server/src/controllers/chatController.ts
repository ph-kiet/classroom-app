import { Request, Response } from "express";
import { db } from "../config/firebase";
import { User } from "../models/user";

const UserCollection = db.collection("users");

// GET /api/chats/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const query = UserCollection.where("phoneNumber", "!=", req.phoneNumber);
    const snapshot = await query.get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserNameByPhoneNumber = async (phoneNumber: string) => {
  try {
    const query = UserCollection.where("phoneNumber", "==", phoneNumber).limit(
      1
    );
    const snapshot = await query.get();
    const user = snapshot.docs[0].data() as User;
    return user.name;
  } catch (error: any) {
    console.log(error.message);
  }
};
