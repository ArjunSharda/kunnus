import type { MetadataRoute } from "next"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: "Educator Grant Finder",
    short_name: "Grant Finder",
    description: "Discover and track grants for educators",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}