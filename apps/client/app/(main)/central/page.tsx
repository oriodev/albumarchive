// COMPONENTS.
import PageHeader from "@/components/general/header";
import HomePageNavBoxes from "@/components/containers/homepagenavboxes";
import ScrollContainer from "@/components/containers/scrollcontainer";
import { getUserLikedLists } from "@/api/likes.api";
import { getUserId } from "@/api/user.api";
import { ImageType, List } from "@/types";
import Link from "next/link";
import ScrollableImageCard from "@/components/cards/scrollableimagecard";
import { getTrendingLists } from "@/api/list.api";

// TYPES.

export default async function Page() {
  const userId = await getUserId();
  const likedLists: List[] = await getUserLikedLists(userId);
  const trendingLists: List[] = await getTrendingLists();

  // RENDER PAGE.
  return (
    <main className="flex flex-col gap-4">
      <PageHeader
        title="Album Archive Central"
        description="Track your albums. Make new friends. Savour your music."
      />

      <HomePageNavBoxes />

      <ScrollContainer title="Jump Back In.">
        {likedLists.map((list) => (
          <Link key={list._id} href="#" className="">
            <ScrollableImageCard
              key={`${list.name}+${list.user}`}
              image={list.listCoverImg}
              title={list.name}
              imageType={ImageType.list}
            />
          </Link>
        ))}
      </ScrollContainer>

      <ScrollContainer title="Trending Now.">
        {trendingLists.map((list) => (
          <Link key={list._id} href="#" className="">
            <ScrollableImageCard
              key={`${list.name}+${list.user}`}
              image={list.listCoverImg}
              title={list.name}
              imageType={ImageType.list}
            />
          </Link>
        ))}
      </ScrollContainer>

      {/* albums in a genre the user likes. */}
      {/* figuring out what genres the user likes. */}
    </main>
  );
}
