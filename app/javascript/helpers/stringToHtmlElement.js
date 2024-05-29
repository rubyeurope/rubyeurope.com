export const stringToHtmlElement = (htmlString) => {
  return new DOMParser().parseFromString(htmlString, "text/html").documentElement;
};
