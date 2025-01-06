import { createList } from "@/api/list.api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { listToRender, Type } from "@/types";
import { slugify } from "@/utils/global.utils";
import { useUser } from "@/utils/providers/UserProvider";
import { Headphones, PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewListBtnProps {
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>;
  lists: listToRender[];
}

export default function NewListBtn({ setLists, lists }: NewListBtnProps) {
  const { user } = useUser();
  const router = useRouter();

  const handleCreateNewList = async () => {
    if (!user?._id) {
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
      type: Type.CUSTOM,
      user: user?._id,
      albums: [],
    };

    const list = await createList(newList);

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
      router.push(`/central/lists/${list.slug}`);
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
