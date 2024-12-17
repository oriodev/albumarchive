export interface Album {
  _id?: string;
  title: string;
  artist: string;
  genre: string;
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
}
