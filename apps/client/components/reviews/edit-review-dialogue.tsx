// TYPES.
import { Album, ReviewWithUser } from "@/types";

// HOOKS.
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/utils/providers/UserProvider";
import { useState } from "react";

// COMPONENTS.
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialogue";
import { Textarea } from "../ui/textarea";

// FORMS.
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { z } from "zod";
import { createReviewSchema } from "@/zod/create-review-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "../ui/badge";
import { editReview } from "@/api/reviews.api";
import EditStarRating from "../albums/editStarRating";
import { presetVibes } from "@/utils/text.utils";

interface EditReviewDialogueProps {
  album: Album;
  review: ReviewWithUser;
}

export function EditReviewDialogue({ album, review }: EditReviewDialogueProps) {
  // HOOKS.
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();

  //   STATES.
  const [setVibes, setSetVibes] = useState<string[]>(review.vibes);

  const handleSetVibes = (vibe: string) => {
    if (setVibes.includes(vibe)) {
      setSetVibes((prev) => prev.filter((prevVibe) => prevVibe !== vibe));
      return;
    }

    if (setVibes.length > 2) return;
    setSetVibes((prev) => [...prev, vibe]);
  };

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      vibes: review.vibes,
      reviewText: review.reviewText,
    },
  });

  const handleSubmit = async (values: z.infer<typeof createReviewSchema>) => {
    if (!user?._id || !album?._id || !values.reviewText || !review?._id) return;

    const reviewPayload = {
      vibes: setVibes,
      reviewText: values.reviewText,
    };

    const editedReview = await editReview(review._id, reviewPayload);

    if (!editedReview?._id || !user?.reviews) return;

    const updatedUser = {
      reviews: [
        ...user.reviews.filter((review) => review !== editedReview._id),
        editedReview,
      ],
    };

    updateUserInfo(updatedUser);

    if (editedReview) {
      toast({
        title: "album review edited",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Album Review</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex gap-5">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-3 items-center">
            <Image
              alt={album.title}
              src={album.coverImage}
              width={300}
              height={300}
            />
            <div className="flex flex-col gap-1 items-center">
              <p className="text-xl font-bold">{album.title}</p>
              <p>{album.artist}</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-3 w-full">
            <EditStarRating album={album} />

            <div className="flex flex-wrap gap-2">
              {setVibes.map((vibe, index) => (
                <Badge
                  key={vibe}
                  className={`text-md text-white hover:cursor-pointer ${(index === 0 && "bg-purple-600 hover:bg-purple-700") || (index === 1 && "bg-sky-600 hover:bg-sky-700") || (index === 2 && "bg-pink-600 hover:bg-pink-700")}`}
                  onClick={() => handleSetVibes(vibe)}
                >
                  {vibe}
                </Badge>
              ))}
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-2 w-full"
              >
                <div className="text-l flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={false}
                        className="w-full justify-between"
                      >
                        {`Pick 3 vibes (${setVibes.length}/3)`}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No vibe found.</CommandEmpty>
                          <CommandGroup>
                            {presetVibes.map((presetVibe) => (
                              <CommandItem
                                key={presetVibe}
                                value={presetVibe}
                                onSelect={() => {
                                  handleSetVibes(presetVibe);
                                }}
                              >
                                {presetVibe}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* MESSAGE */}
                  <FormField
                    control={form.control}
                    name="reviewText"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            id="reviewText"
                            placeholder="Write your review here..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  {/* BUTTON */}
                  <Button type="submit" className="mt-4">
                    Edit Review
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
