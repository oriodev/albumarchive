import { EditList } from "@/components/lists/edit-list";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <div>
      <EditList slug={slug} />
    </div>
  );
}
