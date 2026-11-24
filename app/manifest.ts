import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudyFlow",
    short_name: "StudyFlow",
    description:
      "Atur tugas, jadwal, dan progres belajar dalam satu tempat.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F8FAFF",
    theme_color: "#2563EB",
    lang: "id",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}
