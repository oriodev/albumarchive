import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.discogs.com",
      "st.discogs.com",
      "link-to-cover-image.com",
      "utfs.io",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
