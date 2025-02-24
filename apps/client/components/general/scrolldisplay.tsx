interface Props {
  children: React.ReactNode;
}

export function ScrollDisplay({ children }: Props) {
  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hidden">
      <div className="flex space-x-4 p-3">{children}</div>
    </div>
  );
}
