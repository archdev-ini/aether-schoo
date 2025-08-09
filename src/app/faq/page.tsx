import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is Aether?",
    answer: "Aether is a global-facing, locally empowering platform for architects, designers, and students. We provide learning programs, project opportunities, and a vibrant community focused on culturally rooted, climate-conscious design.",
  },
  {
    question: "Who can join the Aether Community?",
    answer: "Anyone passionate about architecture, urban design, or creative problem-solving is welcome — whether you’re a student, practicing professional, or an enthusiast exploring the field.",
  },
  {
    question: "What’s the difference between Aether School and Horizon Studio?",
    answer: "Aether School → Our learning arm, offering courses, workshops, and resources to help you grow your skills. \n\n Horizon Studio → Our project lab, where members collaborate on real-world challenges, competitions, and commissions.",
  },
  {
    question: "How do I start learning with Aether School?",
    answer: "Join the waitlist on our website, confirm your email, and create your Basic Plan account. Once inside, you’ll get access to course previews, schedules, and upcoming enrollment dates.",
  },
  {
    question: "I’m a student. Can Aether help me with my portfolio?",
    answer: "Yes. Our courses and studio challenges are designed to help you produce strong, culturally informed, and climate-conscious work you can showcase in your portfolio.",
  },
  {
    question: "I’m a practicing architect. What’s in it for me?",
    answer: "You can: \n- Join high-level project collaborations \n- Network with other professionals \n- Mentor emerging designers \n- Access resources and research to stay ahead in sustainable and locally relevant architecture.",
  },
  {
    question: "Does Aether offer certifications?",
    answer: "Yes — we provide Proof-of-Skill Credentials for selected programs and studio projects, which you can showcase in your portfolio or LinkedIn profile.",
  },
  {
    question: "Do I need to be in Nigeria to join?",
    answer: "No. While our roots are in Nigeria and Africa, Aether is built to connect designers worldwide. Our community and programs are accessible online, and our roadmap includes physical chapters in multiple regions.",
  },
  {
    question: "How does Horizon Studio select its projects?",
    answer: "Projects come from: \n- Industry partners \n- Design competitions \n- Internal Aether initiatives \n- Member proposals that align with our mission.",
  },
  {
    question: "Is there a membership fee?",
    answer: "The community is free to join. Some advanced courses, studio programs, and exclusive events may require a paid plan.",
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
              <AccordionContent className="text-muted-foreground text-base whitespace-pre-line">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
