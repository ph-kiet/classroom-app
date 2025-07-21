import { Request, Response } from "express";
import { db } from "../config/firebase";
import {
  createAccessCodeSchema,
  setupAccountSchema,
  studentSignInSchema,
  updateProfileSchema,
  validateAccessCodeSchema,
} from "../schemas/authSchema";
import {
  addVerificationCode,
  deleteVerificationCode,
  getCodeById,
  hasVerificationCode,
} from "./verificationCodeController";
import generateVerificationCode from "../utils/generateVerificationCode";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { sendSMS } from "../api/twilio";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../utils/passwordHasher";
import { email } from "zod";

const UserCollection = db.collection("users");

// POST /api/auth/createAccessCode
// Body: phoneNumber
export const createAccessCode = async (req: Request, res: Response) => {
  const { success, data } = createAccessCodeSchema.safeParse(req.body);

  // Return if phone number wrong format
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to perform your request! Please try again.",
      },
    });
    return;
  }

  try {
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      data.phoneNumber
    ).limit(1); // Find user by phone number
    const snapshot = await query.get();

    // Return error message if user is not found
    if (snapshot.empty) {
      res.status(400).json({
        error: {
          type: "phoneNumber",
          message: "Phone number is not exist!",
        },
      });
      return;
    }

    // Check if user has a verification code in db
    const hasCode = await hasVerificationCode(data.phoneNumber);
    if (hasCode) {
      await deleteVerificationCode(data.phoneNumber); // Delete the existing code
    }

    // Generate new code
    const code = generateVerificationCode(6);

    // Add new code to database
    await addVerificationCode(data.phoneNumber, code);

    // Send the code to user's phone numebr
    const message = `Your one-time passcode for Classroom App is: ${code}`;
    await sendSMS(data.phoneNumber, message);

    res.status(200).json({
      success: true,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/validateAccessCode
// Body: id (phone number), code
export const validateAccessCode = async (req: Request, res: Response) => {
  const { success, data } = validateAccessCodeSchema.safeParse(req.body);

  // Return if phone number and code wrong format
  if (!success) {
    res.status(400).json({
      error: {
        type: "system",
        message: "Unable to perform your request! Please try again.",
      },
    });
    return;
  }

  try {
    // Check if user has a verification code in db
    const code = await getCodeById(data.id);

    // Return if user does't have code
    if (!code) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Compare codes
    if (code !== data.code) {
      res.status(400).json({
        error: {
          type: "code",
          message: "Verification code is not correct! Please try again.",
        },
      });
      return;
    }

    // Delete verification code
    await deleteVerificationCode(data.id);

    // Find user by phone number
    const query = UserCollection.where("phoneNumber", "==", data.id).limit(1);
    const snapshot = await query.get();
    const user = snapshot.docs[0].data() as User;

    // Generate JWT token
    const token = jwt.sign(
      {
        phoneNumber: data.id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h", // Valid for 1 hour
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      success: true,
      user: {
        phoneNumber: data.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/user
export const getAuthUser = async (req: Request, res: Response) => {
  try {
    // Find user by phone number
    const query = UserCollection.where(
      "phoneNumber",
      "==",
      req.phoneNumber
    ).limit(1);
    const snapshot = await query.get();
    const user = snapshot.docs[0].data() as User;

    res.status(200).json({
      success: true,
      user: {
        phoneNumber: req.phoneNumber,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// POST /api/auth/setupAccount
// Body: token, username, password, confirmPassword

interface JwtPayload {
  email: string;
  studentId: string;
}

export const setupAccount = async (req: Request, res: Response) => {
  try {
    const { success, data } = setupAccountSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      data.token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    // Verify username
    const query = UserCollection.where("username", "==", data.username);
    const snapshot = await query.get();
    if (snapshot.docs[0]) {
      res.status(400).json({
        error: {
          type: "username",
          message: "Username is taken",
        },
      });
      return;
    }

    // Find User with decoded
    const userDoc = UserCollection.doc(decoded.studentId);
    const userSnapshot = await userDoc.get();
    if (!userSnapshot.exists) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Hash password
    const salt = generateSalt();
    const hasedPassword = await hashPassword(data.password, salt);

    await userDoc.update({
      username: data.username,
      password: hasedPassword,
      salt: salt,
      status: "active",
    });

    res.status(200).json({
      success: true,
      message: "Account set up successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      type: "system",
      message: "Unable to perform your request! Please try again.",
    });
  }
};

// POST /api/auth/sign-in
// Body: username, password
export const studentSignIn = async (req: Request, res: Response) => {
  try {
    const { success, data } = studentSignInSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Find student by username
    const query = UserCollection.where("username", "==", data.username).limit(
      1
    );
    const snapshot = await query.get();

    if (!snapshot.docs[0]) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Username or password is not correct!",
        },
      });
      return;
    }

    // Compare password
    const user = snapshot.docs[0].data();

    const valid = await comparePasswords({
      password: data.password,
      salt: user.salt,
      hashedPassword: user.password,
    });

    if (!valid) {
      res.status(400).json({
        error: {
          type: "root",
          message: "Username or password is not correct!",
        },
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h", // Valid for 1 hour
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      success: true,
      user: {
        phoneNumber: user.phoneNumber,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/auth/profile
// Body: name, phoneNumber
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { success, data } = updateProfileSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    // Update details
    const userrQuery = UserCollection.where(
      "phoneNumber",
      "==",
      req.phoneNumber
    ).limit(1);
    const userSnapshot = await userrQuery.get();

    const userDoc = UserCollection.doc(userSnapshot.docs[0].id);
    await userDoc.update({
      email: data.email,
      name: data.name,
    });

    res.status(200).json({
      success: true,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/sign-up
// Body: name, phoneNumber, email
export const signUp = async (req: Request, res: Response) => {
  try {
    const { success, data } = updateProfileSchema.safeParse(req.body);

    if (!success) {
      res.status(400).json({
        error: {
          type: "system",
          message: "Unable to perform your request! Please try again.",
        },
      });
      return;
    }

    const query = UserCollection.where(
      "phoneNumber",
      "==",
      data.phoneNumber
    ).limit(1);
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

    await UserCollection.add({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: "instructor",
    });

    res.status(200).json({
      success: true,
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
