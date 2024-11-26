import { getSession } from "@/api/session.api";
import { getUser } from "@/api/user.api";

export default async function Page() {
  const token = await getSession();

  console.log("c: ", token);

  if (token) {
    const user = await getUser(token);
    console.log("user: ", user);
  }

  return <div>home</div>;
}
