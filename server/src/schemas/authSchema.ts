import { z } from "zod";

export const createAccessCodeSchema = z.object({
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid phone number",
  }),
});

export const validateAccessCodeSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(6),
});

export const setupAccountSchema = z
  .object({
    token: z.string().min(1),
    username: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export const studentSignInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$")),
});

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$")),
});
