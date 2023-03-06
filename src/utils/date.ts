export function formatDate(date?: string, locales = "en-US") {
  if (!date || date.length < 1) return null;
  if (new Date(date).toString() === "Invalid Date") return null;

  return new Intl.DateTimeFormat(locales).format(new Date(date));
}
