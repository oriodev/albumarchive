"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src="/aalogo4.png" width={300} height={300} alt="logo" />
      <h1 className="text-5xl">ALBUM ARCHIVE.</h1>
      <p className="text-xl">Slow down and savour the music you listen to.</p>

      <div className="flex gap-2 pt-5">
        <Button
          className="text-xl pl-10 pr-10"
          onClick={() => router.push("/login")}
          data-cy="login"
        >
          LOG IN
        </Button>
        <Button
          className="text-xl pl-10 pr-10"
          onClick={() => router.push("/signup")}
          data-cy="signup"
        >
          SIGN UP
        </Button>
      </div>
    </div>
  );
}
