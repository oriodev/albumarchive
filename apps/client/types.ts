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
  password?: string;
  private?: boolean;
  lists?: List[];
  following?: string[];
  followers?: string[];
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
}

export interface Notification {
  id: string;
  type: NotificationType;
  receiverId: string;
  senderId: string;
  message: string;
  timestamp?: Date;
}
