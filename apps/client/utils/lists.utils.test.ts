// albumUtils.test.ts
import { isAlbumInList, findListsAlbumIsIn } from "./lists.utils";
import { Album, List, AlbumType } from "@/types";

describe("Album Utility Functions", () => {
  describe("isAlbumInList", () => {
    it("should return true if the album is in the list", () => {
      const album: Album = {
        _id: "1",
        title: "Album 1",
        artist: "Artist 1",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const list: List = {
        _id: "list1",
        name: "My List",
        slug: "my-list",
        description: "A list of albums",
        type: AlbumType.LISTENED,
        user: "user1",
        albums: ["1", "2"],
      };

      expect(isAlbumInList(list, album)).toBe(true);
    });

    it("should return false if the album is not in the list", () => {
      const album: Album = {
        _id: "3",
        title: "Album 3",
        artist: "Artist 3",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const list: List = {
        _id: "list1",
        name: "My List",
        slug: "my-list",
        description: "A list of albums",
        type: AlbumType.LISTENED,
        user: "user1",
        albums: ["1", "2"],
      };

      expect(isAlbumInList(list, album)).toBe(false);
    });

    it("should return false if the album has no id", () => {
      const album: Album = {
        title: "Album 4",
        artist: "Artist 4",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const list: List = {
        _id: "list1",
        name: "My List",
        slug: "my-list",
        description: "A list of albums",
        type: AlbumType.LISTENED,
        user: "user1",
        albums: ["1", "2"],
      };

      expect(isAlbumInList(list, album)).toBe(false);
    });
  });

  describe("findListsAlbumIsIn", () => {
    it("should return a map of lists with album presence status", async () => {
      const album: Album = {
        _id: "1",
        title: "Album 1",
        artist: "Artist 1",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const lists: List[] = [
        {
          _id: "list1",
          name: "List 1",
          slug: "list-1",
          description: "First list",
          type: AlbumType.LISTENED,
          user: "user1",
          albums: ["1"],
        },
        {
          _id: "list2",
          name: "List 2",
          slug: "list-2",
          description: "Second list",
          type: AlbumType.TOLISTEN,
          user: "user1",
          albums: [],
        },
      ];

      const result = await findListsAlbumIsIn(lists, album);
      expect(result).toEqual({
        list1: { isInList: true, type: AlbumType.LISTENED },
      });
    });

    it("should return an empty map if the album is not in any lists", async () => {
      const album: Album = {
        _id: "3",
        title: "Album 3",
        artist: "Artist 3",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const lists: List[] = [
        {
          _id: "list1",
          name: "List 1",
          slug: "list-1",
          description: "First list",
          type: AlbumType.LISTENED,
          user: "user1",
          albums: ["1"],
        },
        {
          _id: "list2",
          name: "List 2",
          slug: "list-2",
          description: "Second list",
          type: AlbumType.TOLISTEN,
          user: "user1",
          albums: [],
        },
      ];

      const result = await findListsAlbumIsIn(lists, album);
      expect(result).toEqual({});
    });

    it("should handle lists with no albums", async () => {
      const album: Album = {
        _id: "1",
        title: "Album 1",
        artist: "Artist 1",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const lists: List[] = [
        {
          _id: "list1",
          name: "List 1",
          slug: "list-1",
          description: "First list",
          type: AlbumType.LISTENED,
          user: "user1",
          albums: [],
        },
        {
          _id: "list2",
          name: "List 2",
          slug: "list-2",
          description: "Second list",
          type: AlbumType.TOLISTEN,
          user: "user1",
          albums: [],
        },
      ];

      const result = await findListsAlbumIsIn(lists, album);
      expect(result).toEqual({});
    });

    it("should return correct status for multiple lists", async () => {
      const album: Album = {
        _id: "1",
        title: "Album 1",
        artist: "Artist 1",
        genre: [],
        releaseDate: "",
        coverImage: "",
        overallRating: 0,
        reviews: [],
      };
      const lists: List[] = [
        {
          _id: "list1",
          name: "List 1",
          slug: "list-1",
          description: "First list",
          type: AlbumType.LISTENED,
          user: "user1",
          albums: ["1"],
        },
        {
          _id: "list2",
          name: "List 2",
          slug: "list-2",
          description: "Second list",
          type: AlbumType.TOLISTEN,
          user: "user1",
          albums: [],
        },
        {
          _id: "list3",
          name: "List 3",
          slug: "list-3",
          description: "Third list",
          type: AlbumType.CUSTOM,
          user: "user1",
          albums: ["1", "2"],
        },
      ];

      const result = await findListsAlbumIsIn(lists, album);
      expect(result).toEqual({
        list1: { isInList: true, type: AlbumType.LISTENED },
        list3: { isInList: true, type: AlbumType.CUSTOM },
      });
    });
  });
});
