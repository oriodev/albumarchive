import { type LucideIcon } from "lucide-react";

export interface Album {
  _id?: string;
  title: string;
  artist: string;
  genre: string[];
  releaseDate: string;
  coverImage: string;
  overallRating: number;
  reviews: string[];
}

export interface User {
  _id?: string;
  username?: string;
  description?: string;
  email: string;
  profileImg?: string;
  password?: string;
  private?: boolean;
  lists?: List[];
  following?: string[];
  followers?: string[];
  reviews?: Review[];
}

export enum AlbumType {
  LISTENED = "Listened",
  TOLISTEN = "To Listen",
  CUSTOM = "Custom",
}

export interface List {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  type: AlbumType;
  user: string;
  albums: string[];
  totalLikes?: number;
}

export interface listToRender {
  id: string;
  name: string;
  type: AlbumType;
  url: string;
  icon: LucideIcon;
  description: string;
}

export enum Dialogs {
  delete = "delete",
  edit = "edit",
}

export enum NotificationType {
  FRIENDREQUEST = "friendRequest",
  ALBUMREC = "albumRec",
  LISTLIKE = "listlike",
  RESPONSE = "response",
}

export interface Notification {
  _id?: string;
  sender: string;
  receiver: string;
  type: NotificationType;
  albumId?: string;
  listId?: string;
  message?: string;
  timestamp?: Date;
}

export interface Rating {
  _id?: string;
  album: string;
  user: string;
  rating: number;
}

export interface RatingsCount {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  total: number;
}

export interface Likes {
  _id?: string;
  user: string;
  list: string;
}

export interface Review {
  _id?: string;
  user: string;
  album: string;
  vibes: string[];
  reviewText: string;
  rating: Rating;
}

export interface ReviewWithUser extends Omit<Review, "user"> {
  user: User;
}
