export interface Album {
  _id?: string;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string;
  coverImageUrl: string;
  overallRating: number;
  reviews: [];
}

export interface User {
  _id?: string;
  username?: string;
  email: string;
  password?: string;
}
