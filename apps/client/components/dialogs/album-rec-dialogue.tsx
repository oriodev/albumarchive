// COMPONENTS.
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// TYPES.
import { Album, NotificationPayload, NotificationType, User } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { albumRecSchema } from "@/zod/album-rec-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { getUser } from "@/api/user.api";
import {
  checkNotification,
  sendNotification,
} from "@/utils/notifications.utils";
import { useToast } from "@/hooks/use-toast";
import { WebsocketContext } from "@/utils/providers/WebsocketProvider";

export function AlbumRecDialogue({ album }: { album: Album }) {
  // HOOKS.
  const { user } = useUser();
  const { toast } = useToast();
  const socket = useContext(WebsocketContext);

  // STATES.
  const [users, setUsers] = useState<User[]>([]);
  const [receiver, setReceiver] = useState<User>();

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user) return;

      const following = user.following;

      if (!following) return;

      const fullFollowing = await Promise.all(
        following.map((userId) => getUser(userId)),
      );

      const finalFollowing = fullFollowing.filter((list) => list !== null);

      setUsers(finalFollowing);
    };

    fetchFollowing();
  }, [user]);

  const form = useForm<z.infer<typeof albumRecSchema>>({
    resolver: zodResolver(albumRecSchema),
    defaultValues: {
      user: "",
      message: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof albumRecSchema>) => {
    if (!user || !receiver) return;

    const notificationPayload: NotificationPayload = {
      sender: user,
      receiver: receiver,
      type: NotificationType.ALBUMREC,
      album: album,
      message: values.message,
    };

    const checkedNotification = await checkNotification(notificationPayload);

    if (checkedNotification) {
      toast({
        title: "you have already recommended this album to this user",
      });

      return;
    }

    sendNotification(socket, notificationPayload);

    toast({
      title: "sent album rec",
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button data-cy="albumRec">Send Album Rec</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl" data-cy="title">
              Album Rec
            </DialogTitle>
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
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col w-1/3"
              >
                <div className="text-l flex flex-col gap-4">
                  {/* POPUP FOR LIST SELECTION */}
                  <div>
                    <FormLabel>Select a user to send a rec to.</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={false}
                          className="w-full justify-between"
                        >
                          {form.watch("user")
                            ? users.find(
                                (user) => user._id === form.watch("user"),
                              )?.username
                            : "Select a user"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandList>
                            <CommandEmpty>No user found.</CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  key={user.username}
                                  value={user._id}
                                  onSelect={() => {
                                    form.setValue("user", user._id);
                                    setReceiver(user);
                                  }}
                                >
                                  {user.username}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    {/* MESSAGE */}
                    <FormLabel>Enter your message.</FormLabel>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              id="message"
                              placeholder="Enter your message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <Button type="submit" className="mt-4">
                  Send Recommendation
                </Button>
              </form>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
