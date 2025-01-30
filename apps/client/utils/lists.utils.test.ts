import { Album, AlbumType, List, User } from "@/types";
import {
  findListsAlbumIsIn,
  getListFromId,
  isAlbumInList,
  isAlbumInListened,
} from "./lists.utils";

const album: Album = {
  _id: "album1",
  title: "Test Album",
  artist: "Test Artist",
  genre: ["Rock"],
  releaseDate: "2023-01-01",
  coverImage: "http://example.com/cover.jpg",
  overallRating: 4.5,
  reviews: [],
};

const list: List = {
  _id: "list1",
  name: "My Favorite Albums",
  slug: "my-favorite-albums",
  description: "A list of my favorite albums.",
  type: AlbumType.LISTENED,
  user: "user1",
  albums: ["album1", "album2", "album3"],
  totalLikes: 10,
};

const lists: List[] = [
  {
    _id: "list1",
    name: "My Favorite Albums",
    slug: "my-favorite-albums",
    description: "A list of my favorite albums.",
    type: AlbumType.LISTENED,
    user: "user1",
    albums: ["album1", "album2", "album3"],
    totalLikes: 10,
  },
  {
    _id: "list2",
    name: "To Listen",
    slug: "to-listen",
    description: "Albums I want to listen to.",
    type: AlbumType.TOLISTEN,
    user: "user1",
    albums: ["album4", "album5"],
    totalLikes: 5,
  },
  {
    _id: "list3",
    name: "Empty List",
    slug: "empty-list",
    description: "A list with no albums.",
    type: AlbumType.CUSTOM,
    user: "user1",
    albums: [],
  },
  {
    _id: "list4",
    name: "List Without ID",
    slug: "list-without-id",
    description: "A list without an ID.",
    type: AlbumType.LISTENED,
    user: "user1",
    albums: ["album6"],
  },
  {
    _id: "list4",
    name: "List Without ID",
    slug: "list-without-id",
    description: "A list without an ID.",
    type: AlbumType.LISTENED,
    user: "user1",
    albums: ["album6"],
  },
];

const user: User = {
  _id: "user1",
  username: "testuser",
  email: "test@example.com",
  lists: lists,
};

describe("isAlbumInList", () => {
  it("should return true if the album is in the list", () => {
    expect(isAlbumInList(list, album)).toBe(true);
  });

  it("should return false if the album is not in the list", () => {
    const anotherAlbum: Album = {
      _id: "album4",
      title: "Another Album",
      artist: "Another Artist",
      genre: ["Pop"],
      releaseDate: "2023-02-01",
      coverImage: "http://example.com/another-cover.jpg",
      overallRating: 4.0,
      reviews: [],
    };
    expect(isAlbumInList(list, anotherAlbum)).toBe(false);
  });

  it("should return false if the album does not have an _id", () => {
    const albumWithoutId: Album = {
      title: "Album Without ID",
      artist: "Unknown Artist",
      genre: ["Jazz"],
      releaseDate: "2023-03-01",
      coverImage: "http://example.com/no-id-cover.jpg",
      overallRating: 3.5,
      reviews: [],
    };
    expect(isAlbumInList(list, albumWithoutId)).toBe(false);
  });

  it("should return false if the list has no albums", () => {
    const emptyList: List = {
      _id: "list2",
      name: "Empty List",
      slug: "empty-list",
      description: "A list with no albums.",
      type: AlbumType.CUSTOM,
      user: "user2",
      albums: [],
    };
    expect(isAlbumInList(emptyList, album)).toBe(false);
  });
});

describe("findListsAlbumIsIn", () => {
  it("should return lists with album presence status", async () => {
    const result = await findListsAlbumIsIn(lists, album);
    expect(result).toEqual({
      list1: { isInList: true, type: AlbumType.LISTENED },
    });
  });

  it("should return an empty object if the album is not in any lists", async () => {
    const anotherAlbum: Album = {
      _id: "album7",
      title: "Another Album",
      artist: "Another Artist",
      genre: ["Pop"],
      releaseDate: "2023-02-01",
      coverImage: "http://example.com/another-cover.jpg",
      overallRating: 4.0,
      reviews: [],
    };
    const result = await findListsAlbumIsIn(lists, anotherAlbum);
    expect(result).toEqual({});
  });

  it("should handle lists with no albums", async () => {
    const result = await findListsAlbumIsIn(lists, album);
    expect(result).toEqual({
      list1: { isInList: true, type: AlbumType.LISTENED },
    });
  });

  it("should return false for lists without an ID", async () => {
    const listWithoutId: List = {
      _id: undefined,
      name: "List Without ID",
      slug: "list-without-id",
      description: "A list without an ID.",
      type: AlbumType.LISTENED,
      user: "user1",
      albums: ["album6"],
    };
    const result = await findListsAlbumIsIn([listWithoutId], album);
    expect(result).toEqual({});
  });

  it("should return correct status for multiple lists", async () => {
    const result = await findListsAlbumIsIn(lists, album);
    expect(result).toEqual({
      list1: { isInList: true, type: AlbumType.LISTENED },
    });
  });
});

describe("getListFromId", () => {
  it("should return the list if it exists", () => {
    const result = getListFromId(lists, "list1");
    expect(result).toEqual(lists[0]);
  });

  it("should return null if the list does not exist", () => {
    const result = getListFromId(lists, "nonexistent-list");
    expect(result).toBeNull();
  });

  it("should return null if there are multiple lists with the same ID", () => {
    const result = getListFromId(lists, "list4");
    expect(result).toBeNull();
  });

  it("should return null if the listId is an empty string", () => {
    const result = getListFromId(lists, "");
    expect(result).toBeNull();
  });

  it("should return null if the lists array is empty", () => {
    const result = getListFromId([], "list1");
    expect(result).toBeNull();
  });
});

describe("isAlbumInListened", () => {
  it("should return true if the album is in a listened list", async () => {
    const result = await isAlbumInListened(user, album);
    expect(result).toBe(true);
  });

  it("should return false if the user is null", async () => {
    const result = await isAlbumInListened(null, album);
    expect(result).toBe(false);
  });

  it("should return false if there are no listened lists", async () => {
    const userWithoutListened = {
      ...user,
      lists: [
        {
          _id: "list2",
          name: "To Listen",
          slug: "to-listen",
          description: "Albums I want to listen to.",
          type: AlbumType.TOLISTEN,
          user: "user1",
          albums: ["album4", "album5"],
          totalLikes: 5,
        },
      ],
    };
    const result = await isAlbumInListened(userWithoutListened, album);
    expect(result).toBe(false);
  });

  it("should return false if the album is not in the listened list", async () => {
    const anotherAlbum: Album = {
      _id: "album4",
      title: "Another Album",
      artist: "Another Artist",
      genre: ["Pop"],
      releaseDate: "2023-02-01",
      coverImage: "http://example.com/another-cover.jpg",
      overallRating: 4.0,
      reviews: [],
    };
    const result = await isAlbumInListened(user, anotherAlbum);
    expect(result).toBe(false);
  });

  it("should return false if the listened list has no albums", async () => {
    const userWithEmptyListened = {
      ...user,
      lists: [
        {
          _id: "list1",
          name: "Empty Listened",
          slug: "empty-listened",
          description: "A listened list with no albums.",
          type: AlbumType.LISTENED,
          user: "user1",
          albums: [],
        },
      ],
    };
    const result = await isAlbumInListened(userWithEmptyListened, album);
    expect(result).toBe(false);
  });
});
