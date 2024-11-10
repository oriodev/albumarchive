import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: "username must be a minimum of 6 characters",
    })
    .max(20, {
      message: "username must be a maximum of 20 characters",
    }),
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

export type signupSchema = z.infer<typeof signupSchema>;
