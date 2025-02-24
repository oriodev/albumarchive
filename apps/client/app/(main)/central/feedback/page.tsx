import PageHeader from "@/components/general/header";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <PageHeader
        title="Feedback"
        description="Your feedback helps us improve Album Archive. Please share your
          thoughts, suggestions, or any issues you encountered while using the
          app."
      />

      <p className="pl-3">
        Submit your feedback to: <strong>support@albumarchive.com</strong>
      </p>
    </main>
  );
}
