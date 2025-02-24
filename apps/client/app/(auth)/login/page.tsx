import { LoginForm } from "@/components/forms/login-form";

export default async function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
