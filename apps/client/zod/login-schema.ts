import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(5, {
      message: "email must be a minimum of 6 characters",
    })
    .max(100, {
      message: "email must be a maximum of 100 characters",
    }),
  password: z
    .string()
    .min(6, {
      message: "password must be a minimum of 6 characters",
    })
    .max(100, {
      message: "password must be a maximum of 100 characters",
    }),
});

export type signupSchema = z.infer<typeof loginSchema>;
