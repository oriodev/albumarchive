import { DeleteButton } from "@/components/delete-button";
import PageHeader from "@/components/header";
import { PrivacyButton } from "@/components/privacy-button";

export default async function Page() {
  return (
    <main className="flex flex-col gap-3 w-1/4">
      <PageHeader title="Account" description="Manage your account here." />
      <DeleteButton />
      <PrivacyButton />
    </main>
  );
}
