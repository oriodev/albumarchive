import { z } from "zod";

export const albumRecSchema = z.object({
  user: z.string().min(1),
  message: z
    .string()
    .max(250, {
      message: "message must be a maximum of 250 characters",
    })
    .optional(),
});

export type albumRecSchema = z.infer<typeof albumRecSchema>;
