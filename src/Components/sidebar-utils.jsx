export function isActive(pathname, itemUrl) {
  if (!itemUrl) return false;
  if (pathname.startsWith(itemUrl)) return true;

  if (itemUrl.endsWith("s")) {
    if (pathname.startsWith(itemUrl.slice(0, -1))) return true;
  } else {
    if (pathname.startsWith(itemUrl + "s")) return true;
  }

  return false;
}