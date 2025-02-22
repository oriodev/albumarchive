interface Props {
  title: string;
}

export default function RoomTopbar({ title }: Props) {
  return (
    <div className="w-full h-[60] p-5  flex flex-row justify-between items-center">
      <h1 className="text-2xl pl-3">{title}</h1>
    </div>
  );
}
