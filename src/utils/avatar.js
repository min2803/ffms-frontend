export function getAvatarUrl(name, size = 128) {
  const encoded = encodeURIComponent(name || "?");
  return `https://ui-avatars.com/api/?name=${encoded}&background=random&color=fff&size=${size}&bold=true&format=svg`;
}
