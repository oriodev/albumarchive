import { SignUpForm } from "@/components/forms/signup-form";

export default async function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignUpForm />
    </div>
  );
}
