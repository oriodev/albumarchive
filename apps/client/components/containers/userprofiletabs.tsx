"use client";

// COMPONENTS.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListCard } from "../cards/listcard";

// API CALLS.
import { getUserLikedLists } from "@/api/likes.api";

// TYPES.
import { ImageType, List, User } from "@/types";
import { useEffect, useState } from "react";
import { getUsersBatch } from "@/api/user.api";
import Link from "next/link";

interface Props {
  user: User;
}

export function UserProfileTabs({ user }: Props) {
  const [likedLists, setLikedLists] = useState<List[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  useEffect(
    function fetchLikedLists() {
      const subFetchLikedLists = async () => {
        const fetchedLikedLists = await getUserLikedLists(user._id);
        if (!fetchedLikedLists) return;
        setLikedLists(fetchedLikedLists);
      };

      subFetchLikedLists();
    },
    [user],
  );

  useEffect(
    function fetchFollowData() {
      const subFetchFollowData = async () => {
        const followerData = await getUsersBatch(user.followers || []);
        setFollowers(followerData);

        const followingData = await getUsersBatch(user.following || []);
        setFollowing(followingData);
      };

      subFetchFollowData();
    },
    [user],
  );

  type ProfileTabs = {
    title: string;
    value: string;
    description: string;
    items: {
      id: string;
      image: string | undefined;
      title: string;
      description: string;
      link: string;
    }[];
    imageType: ImageType;
  };

  const profileTabs: ProfileTabs[] = [
    {
      title: `Lists (${user.lists.length})`,
      value: "lists",
      description: "See all of the lists you have created!",
      items: user.lists.map((list) => ({
        id: list._id || "",
        image: list.listCoverImg,
        title: list.name,
        description: list.description,
        link: `/central/users/${user.username}/${list.slug}`,
      })),
      imageType: ImageType.list,
    },
    {
      title: `Liked Lists (${likedLists.length})`,
      value: "liked-lists",
      description: "See all of the lists you have liked!",
      items: likedLists.map((list) => ({
        id: list._id || "",
        image: list.listCoverImg,
        title: list.name,
        description: list.description,
        link: `/central/users/${user.username}/${list.slug}`,
      })),
      imageType: ImageType.list,
    },
    {
      title: `Followers (${followers.length})`,
      value: "followers",
      description: "See all of the people you have followed!",
      items: followers.map((user) => ({
        id: user._id,
        image: user.profileImg,
        title: user.username,
        description: user.description,
        link: `/central/users/${user.username}`,
      })),
      imageType: ImageType.user,
    },
    {
      title: `Following (${following.length})`,
      value: "following",
      description: "See all of the people you are following!",
      items: following.map((user) => ({
        id: user._id,
        image: user.profileImg,
        title: user.username,
        description: user.description,
        link: `/central/users/${user.username}`,
      })),
      imageType: ImageType.user,
    },
  ];

  return (
    <Tabs defaultValue="lists" className="w-full">
      <TabsList className="grid h-[50px] w-full grid-cols-4">
        {profileTabs.map((profileTab) => (
          <TabsTrigger
            key={profileTab.value}
            value={profileTab.value}
            className="h-[40px]"
          >
            {profileTab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {profileTabs.map((profileTab) => (
        <TabsContent key={profileTab.value} value={profileTab.value}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{profileTab.title}</CardTitle>
              <CardDescription>{profileTab.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {profileTab.items.map((item) => (
                <Link key={item.id} href={item.link}>
                  <ListCard
                    image={item.image}
                    imageType={profileTab.imageType}
                    title={item.title}
                    description={item.description}
                  />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
