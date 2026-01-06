import Link from "next/link";
import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";

interface CTASectionProps {
  dict: any;
}

export default function CTASection({ dict }: CTASectionProps) {
  return (
    <Section variant="default" spacing="none" className="py-16 sm:py-24 md:py-32 px-3 sm:px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <Title level="h2" align="center" withAccent>
          {dict.home.cta.title}
        </Title>
        <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
          {dict.home.cta.text}
        </p>
        <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-2 sm:pt-4">
          <Link href="/rsvp" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {dict.home.cta.confirmPresence}
            </Button>
          </Link>
          <Link href="/programme" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              {dict.home.cta.seeProgram}
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
