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

export interface UserSignUp {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserPayload {
  username: string;
  description: string;
  email: string;
  profileImg?: string;
  password?: string;
  private: boolean;
  lists: List[];
  following: string[];
  followers: string[];
  reviews: Review[];
}

export interface User extends UserPayload {
  _id: string;
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
  listCoverImg?: string;
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
  RESPONSE = "response",
}

export interface NotificationPayload {
  sender: User;
  receiver: User;
  type: NotificationType;
  album?: Album;
  list?: List;
  message?: string;
  timestamp?: Date;
}

export interface Notification extends NotificationPayload {
  _id: string;
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

export interface ReviewPayload {
  user: string;
  album: string;
  vibes: string[];
  reviewText: string;
  rating: string;
}

export interface Review extends Omit<ReviewPayload, "rating"> {
  _id: string;
  user: string;
  album: string;
  vibes: string[];
  reviewText: string;
  rating: Rating;
}

export interface ReviewWithUser extends Omit<Review, "user"> {
  user: User;
}

export interface Room {
  _id: string;
  title: string;
  slug: string;
  description: string;
  users: User[];
}

export enum MessageType {
  MESSAGE = "message",
  ALBUM = "album",
  LIST = "list",
}

export interface Message {
  room: string;
  sender: User;
  content: string;
  timestamp: string;
  type: MessageType;
  likes?: number;
  album?: Album;
  list?: List;
}

export interface MessagePayload {
  room: string;
  sender: User;
  content: string;
  timestamp: string;
  type: MessageType;
  album?: string;
  list?: string;
}

export enum ImageType {
  user = "USER",
  album = "ALBUM",
  list = "LIST",
}
