import { z } from "zod";

export const editUserSchema = z.object({
  description: z
    .string()
    .max(500, {
      message: "User description must be a maximum of 500 characters",
    })
    .optional(),
});

export type editListSchema = z.infer<typeof editUserSchema>;
