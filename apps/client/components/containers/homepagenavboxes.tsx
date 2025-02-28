"use client";

import Link from "next/link";

export default function HomePageNavBoxes() {
  type ColorClass = {
    base: string;
  };

  type NavLink = {
    title: string;
    url: string;
    colour: keyof typeof colorClasses;
  };

  const colorClasses: Record<string, ColorClass> = {
    cyan: {
      base: "bg-cyan-950 hover:bg-cyan-900",
    },
    rose: {
      base: "bg-rose-950 hover:bg-rose-900",
    },
    emerald: {
      base: "bg-emerald-950 hover:bg-emerald-900",
    },
  };

  const navLinks: NavLink[] = [
    {
      title: "Albums",
      url: "/central/albums",
      colour: "cyan",
    },
    {
      title: "Lists",
      url: "/central/discover",
      colour: "cyan",
    },
    {
      title: "Listened",
      url: "/central/lists/listened",
      colour: "rose",
    },
    {
      title: "To Listen",
      url: "/central/lists/to-listen",
      colour: "rose",
    },
    {
      title: "Users",
      url: "/central/users",
      colour: "cyan",
    },
    {
      title: "Rooms",
      url: "/central/rooms",
      colour: "cyan",
    },
    {
      title: "Profile",
      url: "/central/profile",
      colour: "emerald",
    },
    {
      title: "Account",
      url: "/central/account",
      colour: "emerald",
    },
  ];
  return (
    <div className="pl-3 grid grid-cols-2 md:grid-cols-4 gap-4 ">
      {navLinks.map((link) => (
        <Link
          key={link.title}
          className={`${colorClasses[link.colour].base} shadow-lg rounded-md p-5 font-bold hover:cursor-pointer transition`}
          href={link.url}
        >
          <div>{link.title}</div>
        </Link>
      ))}
    </div>
  );
}
