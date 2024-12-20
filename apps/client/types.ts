import { type LucideIcon } from "lucide-react";

export interface Album {
  _id?: string;
  title: string;
  artist: string;
  genre: string[];
  releaseDate: string;
  coverImage: string;
  overallRating: number;
  reviews: [];
}

export interface User {
  id?: string;
  username?: string;
  email: string;
  password?: string;
  private?: boolean;
  lists?: List[];
}

export enum Type {
  LISTENED = "Listened",
  TOLISTEN = "To Listen",
  CUSTOM = "Custom",
}

export interface List {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  type: Type;
  user: string;
  albums: string[];
}

export interface listToRender {
  id: string;
  name: string;
  type: Type;
  url: string;
  icon: LucideIcon;
}
