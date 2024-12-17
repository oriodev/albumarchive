"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();

  const handleReturn = () => {
    router.push("/central");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-2xl">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <Button onClick={handleReturn}>Return Home</Button>
    </div>
  );
}
