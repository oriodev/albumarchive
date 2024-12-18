import { DeleteButton } from "@/components/delete-button";
import { PrivacyButton } from "@/components/privacy-button";

export default async function Page() {
  return (
    <div>
      <div className="flex flex-col gap-3 w-1/4">
        <DeleteButton />
        <PrivacyButton />
      </div>
    </div>
  );
}
