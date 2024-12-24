import { z } from "zod";

export const editListSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "list name must be at least 1 character",
    })
    .max(50, {
      message: "list name must be a maximum of 50 characters",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "list name must be alphanumeric",
    }),
  description: z
    .string()
    .max(200, {
      message: "list description must be a maximum of 200 characters",
    })
    .optional(),
});

export type editListSchema = z.infer<typeof editListSchema>;
