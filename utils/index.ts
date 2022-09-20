export const formatFieldLabel = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const kebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export const kebabParser = (str) => {
  return str
    .replace(/[`~!@#$%^&*()_|+=?;:'",.<>{}[]\\\/]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
};

export const formatDate = (date, locale = "en-US") => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const now = new Date(date).toLocaleDateString(locale, options);

  return now;
};

export const countPhotos = (serie: any) => {
  const photosLength = serie._body.children
    .filter((child) => child.type === "p")
    .map((child) => child.children)
    .filter((child) => child[0].type === "img").length;
  const result =
    photosLength > 1
      ? `${photosLength} photos`
      : photosLength === 1
      ? `${photosLength} photo`
      : "";
  return result;
};
