import { truncateString, slugify, capitalizeFirstLetter } from "./global.utils";

describe("global utilities", () => {
  describe("truncateString", () => {
    it("should truncate a string longer than maxLength", () => {
      const result = truncateString("Hello, World!", 5);
      expect(result).toBe("Hello...");
    });

    it("should return the original string if it is within maxLength", () => {
      const result = truncateString("Hello", 10);
      expect(result).toBe("Hello");
    });

    it("should return an empty string if input is empty", () => {
      const result = truncateString("", 5);
      expect(result).toBe("");
    });

    it("should handle maxLength of 0", () => {
      const result = truncateString("Hello, World!", 0);
      expect(result).toBe("...");
    });
  });

  describe("slugify", () => {
    it("should convert a string to a slug", () => {
      const result = slugify("Hello World!");
      expect(result).toBe("hello-world");
    });

    it("should handle multiple spaces and special characters", () => {
      const result = slugify("  This is a test!  ");
      expect(result).toBe("this-is-a-test");
    });

    it("should remove non-word characters", () => {
      const result = slugify("Hello @ World #2023");
      expect(result).toBe("hello-world-2023");
    });

    it("should handle empty strings", () => {
      const result = slugify("");
      expect(result).toBe("");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      const result = capitalizeFirstLetter("hello");
      expect(result).toBe("Hello");
    });

    it("should return the same string if the first letter is already capitalized", () => {
      const result = capitalizeFirstLetter("Hello");
      expect(result).toBe("Hello");
    });

    it("should handle empty strings", () => {
      const result = capitalizeFirstLetter("");
      expect(result).toBe("");
    });

    it("should handle strings with only one character", () => {
      const result = capitalizeFirstLetter("a");
      expect(result).toBe("A");
    });

    it("should handle strings with leading whitespace", () => {
      const result = capitalizeFirstLetter("  hello");
      expect(result).toBe("Hello");
    });
  });
});
