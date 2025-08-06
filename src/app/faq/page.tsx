import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the Aether Ecosystem?",
    answer: "The Aether Ecosystem is a community and platform dedicated to fostering innovation. It comprises Aether School for education, Horizon Studio for project incubation, and a network of partners and collaborators.",
  },
  {
    question: "Who is eligible to join Aether School?",
    answer: "Aether School is open to individuals from all backgrounds who are passionate about technology and innovation. We look for curiosity, a collaborative spirit, and a drive to build. Specific cohorts may have prerequisites, which will be listed in the application materials.",
  },
  {
    question: "How does Horizon Studio select projects?",
    answer: "Horizon Studio has a competitive application process. We evaluate projects based on their potential for impact, technical feasibility, team strength, and alignment with the Aether mission. We are particularly interested in projects in AI, decentralized systems, and biotechnology.",
  },
  {
    question: "Is there a cost to participate?",
    answer: "Aether School has a tuition fee, with scholarship and financing options available. Horizon Studio typically invests in projects in exchange for equity, and does not charge a fee for participation.",
  },
    {
    question: "Can I participate remotely?",
    answer: "Yes, both Aether School and Horizon Studio offer remote and hybrid participation models to accommodate a global community of innovators.",
  },
];

export default function FaqPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Frequently Asked Questions</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Find answers to common questions about Aether Space.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
