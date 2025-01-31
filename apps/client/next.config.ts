import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.discogs.com",
      "st.discogs.com",
      "link-to-cover-image.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
