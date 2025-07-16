/*** @param {string} queryValue */
export default function parseQueryValue(queryValue) {
  if (!queryValue) {
    return [];
  }

  return queryValue.split(';');
}