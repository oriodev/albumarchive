export const truncateString = (str: string = "", maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

export const slugify = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end
};

/**
 * capitalises the first letter in a string
 * @param value string
 * @returns
 */
export const capitalizeFirstLetter = (value: string) => {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};
