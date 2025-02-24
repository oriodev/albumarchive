import { DeleteButton } from "@/components/buttons/delete-user-button";
import PageHeader from "@/components/general/header";
import { PrivacyButton } from "@/components/buttons/privacy-button";

export default async function Page() {
  return (
    <main className="flex flex-col gap-3 w-1/4">
      <PageHeader title="Account" description="Manage your account here." />
      <DeleteButton />
      <PrivacyButton />
    </main>
  );
}
