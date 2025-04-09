import { createAlbum, getAlbumByTitle } from "@/apis/albums.api";
import {
  addAlbumToList,
  createList,
  getListsByUserId,
  removeAlbumFromList,
} from "@/apis/list.api";
import { Album, AlbumType, List, listToRender, User } from "@/types";
import { makeUpdatedAlbumInListUser } from "./user.utils";
import { slugify } from "./global.utils";
import { Headphones } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * checks whether the album is in a list
 * @param {List} list A list
 * @param {Album} album An album.
 * @returns {Boolean} true or false
 */
export const isAlbumInList = (list: List, album: Album): boolean => {
  if (!album._id) {
    return false;
  }
  return list.albums.includes(album._id);
};

/**
 * find out what lists an album is in.
 * @param {List[]} lists All lists from that user.
 * @param {Album} album An album.
 * @returns {Promise<{ [key: string]: { isInList: boolean; type: AlbumType } }>} all lists the album is in with their type.
 */
export const findListsAlbumIsIn = async (
  lists: List[],
  album: Album,
): Promise<{ [key: string]: { isInList: boolean; type: AlbumType } }> => {
  const results = await Promise.all(
    lists.map(async (list) => {
      if (list._id && album._id) {
        const isInList = isAlbumInList(list, album);
        return { id: list._id, type: list.type, isInList };
      }
      return { id: list._id, type: list.type, isInList: false };
    }),
  );

  const albumStatusMap = results.reduce(
    (acc, { id, type, isInList }) => {
      if (id && isInList) {
        acc[id] = { isInList, type };
      }
      return acc;
    },
    {} as { [key: string]: { isInList: boolean; type: AlbumType } },
  );

  return albumStatusMap;
};

/**
 * grab specific list from id and all user lists.
 * @param {List[]} lists All lists from that user.
 * @param {string} listId A list id.
 * @returns {List | null} A list or null.
 */
export const getListFromId = (lists: List[], listId: string): List | null => {
  const selectedList = lists.filter((list) => list._id === listId);

  if (selectedList.length === 1) {
    return selectedList[0];
  }

  return null;
};

/**
 * tells you if the album is in Listened
 * @param {User} user The user.
 * @param {Album} album The album we are maybe deleting from a list.
 * @returns {Promise<boolean>} Boolean.
 */
export const isAlbumInListened = async (
  user: User | null,
  album: Album,
): Promise<boolean> => {
  if (!user) {
    return false;
  }

  const lists = user.lists;

  const isFullListObjects = lists.length > 0 && lists[0]._id !== undefined;

  const listsToCheck = isFullListObjects
    ? lists
    : await getListsByUserId(user._id);

  const listened = listsToCheck.find((list: List) => list.type === "Listened");

  if (!listened || !listened._id) {
    return false;
  }

  const listsAlbumIsIn = await findListsAlbumIsIn(listsToCheck, album);

  return listened._id in listsAlbumIsIn;
};

/**
 * tells you if the album is in Listened
 * @param {User} user The user.
 * @param {Album} album The album we are maybe deleting from a list.
 * @returns {Promise<boolean>} Boolean.
 */
export const isAlbumInToListen = async (
  user: User | null,
  album: Album,
): Promise<boolean> => {
  if (!user) {
    return false;
  }

  const lists = user.lists;

  const toListen = lists.filter((list: List) => list.type === "To Listen")[0];

  if (!toListen || !toListen._id) {
    return false;
  }

  const listsAlbumIsIn = await findListsAlbumIsIn(lists, album);

  return toListen._id in listsAlbumIsIn;
};

/**
 * tells you what list you need to delete the album from, if any.
 * @param {List} selectedList The list we are adding to.
 * @param {Album} album The album we are maybe deleting from a list.
 * @param {List[]} lists All the lists the user has.
 * @param {} albumInLists a map of all the lists that the album is in.
 * @returns {Promise<{ type: string, id: string }>} An object { type: string, id: string }
 */
export const shouldWeDeleteFromList = async (
  selectedList: List | null,
  album: Album,
  lists: List[],
  albumInLists: { [key: string]: { isInList: boolean; type: AlbumType } },
): Promise<{ type: string; id: string } | null> => {
  // if we are adding to 'listened' and the album already in 'to listen':
  if (selectedList?.type === "Listened") {
    const toListen = lists.filter((list) => list.type === "To Listen")[0];

    if (toListen._id && toListen._id in albumInLists) {
      if (!album._id) {
        return null;
      }

      return { type: "toListen", id: toListen._id };
    }
  }

  //   if the album is already in 'listened'
  if (selectedList?.type === "To Listen") {
    const listened = lists.filter((list) => list.type === "Listened")[0];

    if (listened._id && listened._id in albumInLists) {
      if (!album._id) {
        return null;
      }

      return { type: "listened", id: listened._id };
    }
  }

  return null;
};

/**
 * adds album to the local database.
 * @param {Album} album The album we are adding.
 * @returns {Promise<Album>} The album we added.
 */
export const addAlbumToLocalDb = async (album: Album): Promise<Album> => {
  const albumToAdd = {
    title: album.title,
    artist: album.artist,
    genre: album.genre,
    releaseDate: album.releaseDate,
    coverImage: album.coverImage,
    overallRating: 0,
    reviews: [],
  };

  const addAlbumToLocal = await createAlbum(albumToAdd);

  if (!addAlbumToLocal) {
    throw new Error("adding album to local db did not work");
  }

  return addAlbumToLocal;
};

/**
 * removes album from list and updates state.
 * @param {string} listToDeleteFromId The id of the list we are deleting from.
 * @param {string} albumId The id of the album we are deleting.
 * @param {Album[]} albums All the albums in the list.
 * @param {(albums: Album[]) => void} setAlbums Set state of all albums.
 * @param {string} currentList The slug of the current page
 * @param {boolean} updateState Optional: pass if we might not need to update the state.
 */
export const removeAlbum = async (
  listToDeleteFromId: string,
  albumId: string,
  updateState: boolean,
  albums?: Album[],
  setAlbums?: (albums: Album[]) => void,
) => {
  await removeAlbumFromList(listToDeleteFromId, albumId);

  if (updateState && albums && setAlbums) {
    const updatedAlbums = albums.filter(
      (existingAlbum) => existingAlbum._id !== albumId,
    );
    setAlbums(updatedAlbums);
  }
};

/**
 * handles the logic of switching between listened and to listen.
 * @param selectedList the list we are adding to
 * @param album the album we are adding to a list
 * @param lists all of the users lists
 * @param albumInLists the lists that the album is in
 * @param slug the page slug
 * @param albums
 * @param setAlbums
 * @returns
 */
export const handleListenedToListenSwitch = async (
  selectedList: List,
  album: Album,
  lists: List[],
  albumInLists: {
    [key: string]: { isInList: boolean; type: AlbumType };
  },
  slug: string,
  user: User,
  updateUserInfo: (update: Partial<User>) => void,
  albums?: Album[],
  setAlbums?: (albums: Album[]) => void,
) => {
  if (!selectedList._id || !album._id) return null;

  // CHECK IF NEED TO DELETE FROM A LIST.
  const listToDeleteFrom = await shouldWeDeleteFromList(
    selectedList,
    album,
    lists,
    albumInLists,
  );

  if (!listToDeleteFrom) return null;

  // HANDLING DELETION.
  const updateState =
    listToDeleteFrom.type === "toListen"
      ? slug === "to-listen"
      : slug === "listened";

  removeAlbum(listToDeleteFrom.id, album._id, updateState, albums, setAlbums);

  // // ADD TO THE NEW LIST.
  await addAlbumToList(selectedList._id, album._id);

  // UPDATE IN USER PROVIDER.
  const deletionUpdate = makeUpdatedAlbumInListUser(
    user,
    listToDeleteFrom.id,
    album._id,
  );

  if (!deletionUpdate) return;

  const additionUpdate = makeUpdatedAlbumInListUser(
    deletionUpdate,
    selectedList._id,
    album._id,
  );

  if (!additionUpdate) return;

  updateUserInfo(additionUpdate);

  // RETURN TOAST
  return {
    title: "title",
    description: "description",
  };
};

/**
 * returns album from local db and adds it to local db if necessary
 * @param album
 * @returns album or null
 */
export const getLocalDatabaseAlbum = async (
  album: Album,
): Promise<Album | null> => {
  const albumInLocal = await getAlbumByTitle(album.title);
  if (!albumInLocal) await addAlbumToLocalDb(album);
  const albumFromLocal = await getAlbumByTitle(album.title);

  if (!albumFromLocal) return null;
  return albumFromLocal;
};

/**
 *
 * @param list
 * @param albumInLists
 * @param slug
 * @param album
 * @param albums
 * @param setAlbums
 * @returns
 */
export const deleteAlbumFromList = async (
  list: List,
  albumInLists: { [key: string]: { isInList: boolean; type: AlbumType } },
  slug: string,
  album: Album,
  user: User,
  updateUserInfo: (update: Partial<User>) => void,
  albums: Album[] | undefined,
  setAlbums: ((albums: Album[]) => void) | undefined,
) => {
  if (!list._id) return;
  const isAlbumInList = list?._id in albumInLists;

  if (isAlbumInList && album._id) {
    const updateState = slugify(list.name) === slug;

    removeAlbum(list?._id, album._id, updateState, albums, setAlbums);

    // UPDATE THE LIST IN THE USER PROVIDER.
    const updatedUser = makeUpdatedAlbumInListUser(user, list?._id, album._id);

    if (!updatedUser) return;

    updateUserInfo(updatedUser);

    return {
      title: `Removed ${album.title} from ${list?.name}`,
    };
  }

  return null;
};

export const handleCreateNewList = async (
  user: User | null,
  lists: listToRender[],
  router: AppRouterInstance,
  updateUserInfo: (update: Partial<User>) => void,
  setLists: React.Dispatch<React.SetStateAction<listToRender[]>>,
) => {
  if (!user || !user?.lists) {
    throw new Error("no user");
  }

  const existingLists = lists || [];

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
