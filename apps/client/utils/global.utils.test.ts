import { truncateString, slugify, capitalizeFirstLetter } from "./global.utils";

describe("Utility Functions", () => {
  describe("truncateString", () => {
    it("should truncate the string and add ellipsis if it exceeds maxLength", () => {
      const result = truncateString("Hello, World!", 5);
      expect(result).toBe("Hello...");
    });

    it("should return the original string if it does not exceed maxLength", () => {
      const result = truncateString("Hello", 10);
      expect(result).toBe("Hello");
    });

    it("should return an empty string if input is empty", () => {
      const result = truncateString("", 5);
      expect(result).toBe("");
    });
  });

  describe("slugify", () => {
    it("should convert a string to a slug format", () => {
      const result = slugify("Hello World! This is a Test.");
      expect(result).toBe("hello-world-this-is-a-test");
    });

    it("should handle multiple spaces and special characters", () => {
      const result = slugify("  Multiple   Spaces & Special #Characters!  ");
      expect(result).toBe("multiple-spaces-special-characters");
    });

    it("should return an empty string if input is empty", () => {
      const result = slugify("");
      expect(result).toBe("");
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      const result = capitalizeFirstLetter("hello");
      expect(result).toBe("Hello");
    });

    it("should return the same string if the first character is already uppercase", () => {
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
  });
});
