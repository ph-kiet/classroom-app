import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid phone number",
  }),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid phone number",
  }),
});
