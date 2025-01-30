import { z } from "zod";

export const createReviewSchema = z.object({
  vibes: z.string().array().max(3, {
    message: "enter a max of three vibes",
  }),
  reviewText: z
    .string()
    .min(10, {
      message: "review must be a minimum of 10 characters",
    })
    .max(5000, {
      message: "password must be a maximum of 5000 characters",
    }),
});

export type createReviewSchema = z.infer<typeof createReviewSchema>;
