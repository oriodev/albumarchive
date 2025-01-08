// COMPONENTS.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Page() {
  return (
    <div className="p-5 pl-3 flex flex-col gap-5">
      <h1 className="text-3xl">Support</h1>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>1</AccordionTrigger>
            <AccordionContent>1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>2</AccordionTrigger>
            <AccordionContent>2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>3</AccordionTrigger>
            <AccordionContent>3</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <section className="mt-5">
        <h2 className="text-2xl">Contact Us</h2>
        <p>
          If you need further assistance, please reach out to our support team:
        </p>
        <p>
          <strong>Email:</strong> support@albumarchive.com
        </p>
        <p>
          <strong>Phone:</strong> 0000000000
        </p>
      </section>
    </div>
  );
}
