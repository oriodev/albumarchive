import { z } from "zod"

export const signupSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().min(1).max(100),
  password: z.string().min(6).max(100)
})


export type signupSchema = z.infer<typeof signupSchema>;