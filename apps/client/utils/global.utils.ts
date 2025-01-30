/**
 * truncate a string to a given length.
 * @param str given string
 * @param maxLength length to truncate to
 * @returns
 */
export const truncateString = (str: string = "", maxLength: number) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

/**
 * take a string and turn it into a slug.
 * @param str string to turn into a slug
 * @returns
 */
export const slugify = (str: string) => {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/[^\w\-]+/g, "") // remove all non-word chars
    .replace(/\-\-+/g, "-") // replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // trim hyphens from start
    .replace(/-+$/, ""); // trim hyphens from end
};

/**
 * capitalises the first letter in a string.
 * @param value string
 * @returns
 */
export const capitalizeFirstLetter = (value: string) => {
  const trimmedValue = String(value).trim();
  return trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1);
};
