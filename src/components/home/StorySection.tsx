import Section from "@/components/ui/Section";
import { StoryTimeline } from "@/components/home/StoryTimeline";

interface StoryProps {
  dict: any;
}

export default function StorySection({ dict }: StoryProps) {
  return (
    <>
      <Section variant="default" spacing="md" className="pt-8 pb-20 sm:py-16 md:pb-32 animate-fade-in">
        <StoryTimeline dict={dict} />
      </Section>

      <svg
        className="w-full block bg-background relative z-20 -mb-1"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0,0 Q 600,100 1200,0 L 1200,120 L 0,120 Z"
          className="fill-background-soft"
        />
      </svg>
    </>
  );
}
