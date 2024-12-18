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
}

export enum Type {
  LISTENED = "Listened",
  TOLISTEN = "To Listen",
  CUSTOM = "Custom",
}

export interface List {
  name: string;
  description: string;
  type: Type;
  user: string;
  albums: string[];
}
