// COMPONENTS.
import PageHeader from "@/components/general/header";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <main className="p-5 pl-3 flex flex-col gap-5">
      <PageHeader
        title="Documentation"
        description="Here to help you navigate Album Archive and answer your questions."
      />

      <div className="flex flex-col gap-5 pl-3">
        <section aria-labelledby="album-search">
          <h2 id="album-search" className="text-2xl">
            Album Search
          </h2>
          <p>Album Archive finds albums from two places:</p>
          <ol className="list-decimal list-inside">
            <li>Discogs external music database</li>
            <li>Our local database</li>
          </ol>
          <p>
            If you cannot find an album stored in our local database, you will
            need to search for it in the wider external database, and then we
            will add it to our local database.
          </p>
          <p>
            You can search the wider database by selecting wider in the dropdown
            box beside the search bar on the album search page.
          </p>
          <br />
          <Separator />
        </section>

        <section aria-labelledby="lists">
          <h2 id="lists" className="text-2xl">
            Lists
          </h2>
          <p>Everybody has two default lists:</p>
          <ol className="list-decimal list-inside">
            <li>Listened: to store all the albums you have listened to</li>
            <li>To Listen: to store all the albums you want to listen to</li>
          </ol>
          <p>
            You can also create custom lists. These can be renamed, decorated
            with a cover image, and you can add any album you like to it. Lists
            can be seen by other users and can be shared with friends. You can
            also link people to your lists in the group chats with our built-in
            list-sending feature.
          </p>
          <br />
          <Separator />
        </section>

        <section aria-labelledby="finding-friends">
          <h2 id="finding-friends" className="text-2xl">
            Finding Your Friends
          </h2>
          <p>
            You can search for your friends by their username; just select Users
            on the sidebar.
          </p>
          <p>
            Remember: private users will need to accept your friend request
            before you can view their profile page. You can accept friend
            requests in your activity page.
          </p>
          <br />
          <Separator />
        </section>

        <section aria-labelledby="chatrooms">
          <h2 id="chatrooms" className="text-2xl">
            Chatrooms
          </h2>
          <p>
            Chatrooms are a fun way to meet people who love the same artist as
            you. You can join a room on the Rooms page, send messages, check out
            the other members, and share your favorite albums and lists with one
            another.
          </p>
          <br />
          <Separator />
        </section>
      </div>
    </main>
  );
}
