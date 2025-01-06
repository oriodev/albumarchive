import { createAlbum } from "@/api/albums.api";
import { removeAlbumFromList } from "@/api/list.api";
import { Album, List, Type, User } from "@/types";

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
 * @returns {Promise<{ [key: string]: { isInList: boolean; type: Type } }>} all lists the album is in with their type.
 */
export const findListsAlbumIsIn = async (
  lists: List[],
  album: Album,
): Promise<{ [key: string]: { isInList: boolean; type: Type } }> => {
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
    {} as { [key: string]: { isInList: boolean; type: Type } },
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

  if (selectedList.length > 1) {
    console.log("selectedList is bigger than 1 somehow");
    return null;
  }

  return selectedList[0];
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

  const lists = user?.lists || [];

  const listsAlbumIsIn = await findListsAlbumIsIn(lists, album);

  const listened = lists.filter((list) => list.type === "Listened")[0];

  if (!listened?._id) {
    return false;
  }

  return listened?._id in listsAlbumIsIn;
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

  const lists = user?.lists || [];

  const listsAlbumIsIn = await findListsAlbumIsIn(lists, album);

  const toListen = lists.filter((list) => list.type === "To Listen")[0];

  if (!toListen?._id) {
    return false;
  }

  return toListen?._id in listsAlbumIsIn;
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
  albumInLists: { [key: string]: { isInList: boolean; type: Type } },
): Promise<{ type: string; id: string } | null> => {
  // if we are adding to 'listened' and the album already in 'to listen':
  if (selectedList?.type === "Listened") {
    const toListen = lists.filter((list) => list.type === "To Listen")[0];

    if (toListen._id && toListen._id in albumInLists) {
      if (!album._id) {
        console.log("no album for some reason");
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
        console.log("no album for some reason");
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
  albums: Album[],
  setAlbums: (albums: Album[]) => void,
  updateState: boolean,
) => {
  await removeAlbumFromList(listToDeleteFromId, albumId);

  console.log("updateState: ", updateState);

  if (updateState) {
    const updatedAlbums = albums.filter(
      (existingAlbum) => existingAlbum._id !== albumId,
    );
    setAlbums(updatedAlbums);
  }
};