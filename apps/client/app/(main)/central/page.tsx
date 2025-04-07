"use client";

// COMPONENTS.
import PageHeader from "@/components/general/header";
import HomePageNavBoxes from "@/components/containers/homepagenavboxes";
import ScrollContainer from "@/components/containers/scrollcontainer";
import { getUserLikedLists } from "@/apis/likes.api";
import { ImageType, List } from "@/types";
import Link from "next/link";
import ScrollableImageCard from "@/components/cards/scrollableimagecard";
import { getTrendingLists } from "@/apis/list.api";
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

// TYPES.

export default function Page() {
  const { user } = useUser();

  const [likedLists, setLikedLists] = useState<List[]>();
  const [trendingLists, setTrendingLists] = useState<List[]>();

  useEffect(
    function fetchInformation() {
      if (!user) return;

      const fetchingInformation = async () => {
        const fetchedLikedLists: List[] = await getUserLikedLists(user._id);
        const fetchedTrendingLists: List[] = await getTrendingLists();
        console.log("fetched: ", fetchedTrendingLists);
        setLikedLists(fetchedLikedLists);
        setTrendingLists(fetchedTrendingLists);
      };

      fetchingInformation();
    },
    [user],
  );

  // RENDER PAGE.
  return (
    <main className="flex flex-col gap-4">
      <PageHeader
        title="Album Archive Central"
        description="Track your albums. Make new friends. Savour your music."
      />

      <HomePageNavBoxes />

      {likedLists && likedLists.length > 0 && (
        <ScrollContainer title="Jump Back In.">
          {likedLists &&
            likedLists.map((list) => {
              return (
                <Link
                  key={list._id}
                  href={`/central/users/${list.user.username}/${list.slug}`}
                  className=""
                >
                  <ScrollableImageCard
                    key={`${list.name}+${list.user}`}
                    image={list.listCoverImg}
                    title={list.name}
                    imageType={ImageType.list}
                  />
                </Link>
              );
            })}
        </ScrollContainer>
      )}

      <ScrollContainer title="Trending Now.">
        {trendingLists &&
          trendingLists.map((list) => (
            <Link
              key={list._id}
              href={`/central/users/${list.user.username}/${list.slug}`}
            >
              <ScrollableImageCard
                key={`${list.name}+${list.user}`}
                image={list.listCoverImg}
                title={list.name}
                imageType={ImageType.list}
              />
            </Link>
          ))}
      </ScrollContainer>
    </main>
  );
}
