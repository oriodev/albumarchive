import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode
}

export default function ScrollContainer({ title, children }: Props) {
  return (
    <div className="rounded-lg m-3 flex flex-col">
      <h2 className="pl-3 text-2xl font-bold">{ title }</h2>

      <section className="w-[75vw] overflow-x-scroll overflow-y-hidden whitespace-nowrap p-5 pt-1 h-[300px] flex items-center gap-5">
          { children }
      </section>
    </div>
  );
}
