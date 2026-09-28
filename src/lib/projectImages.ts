export function projectImages(imageUrl: string | null): string[] {
  if (!imageUrl) return []
  return imageUrl
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter((part) => part.startsWith("http://") || part.startsWith("https://") || part.startsWith("/"))
}
