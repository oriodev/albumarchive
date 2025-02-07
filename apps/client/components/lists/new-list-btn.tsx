import { createList } from "@/api/list.api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { listToRender, AlbumType } from "@/types";
import { slugify } from "@/utils/global.utils";
import { useUser } from "@/utils/providers/UserProvider";
import { Headphones, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewListBtnProps {
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
  lists: listToRender[];
}

export default function NewListBtn({ setLists, lists }: NewListBtnProps) {
  const { user, updateUserInfo } = useUser();
  const router = useRouter();

  const handleCreateNewList = async () => {
    if (!user || !user?.lists) {
      throw new Error("no user");
    }

    const existingLists = lists || [];

    // Start with the base name
    const baseName = "New List";
    let newListName = baseName;
    let counter = 1;

    while (existingLists.some((list) => list.name === newListName)) {
      counter++;
      newListName = `${baseName} ${counter}`;
    }

    const newList = {
      name: newListName,
      slug: slugify(newListName),
      description: "",
      type: AlbumType.CUSTOM,
      user: user._id,
      albums: [],
      likes: 0,
    };

    const list = await createList(newList);

    // UPDATE USER PROVIDER.
    const updatedLists = [...user.lists, list];
    updateUserInfo({ lists: updatedLists });

    const listToRender: listToRender = {
      id: list.id,
      name: list.name,
      type: list.type,
      url: `/central/lists/${list.slug}`,
      icon: Headphones,
      description: "",
    };

    if (list) {
      setLists((prev) => [...prev, listToRender]);
      router.push(`/central/lists/${list.slug}/editing`);
    } else {
      throw new Error("could not create list");
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger onClick={handleCreateNewList}>
            <PlusCircleIcon className="text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new list</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
