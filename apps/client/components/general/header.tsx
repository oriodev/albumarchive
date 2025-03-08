interface Props {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: Props) {
  return (
    <header className="pl-3 flex flex-col gap-1" data-cy="pageHeader">
      <h1 className="text-3xl font-bold">{title}.</h1>
      <p className="text-gray-200">{description}</p>
    </header>
  );
}
