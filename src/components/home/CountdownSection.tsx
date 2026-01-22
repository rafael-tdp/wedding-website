import Section from "@/components/ui/Section";
import Countdown from "@/components/home/Countdown";

interface CountdownSectionProps {
  dict: any;
}

export default function CountdownSection({ dict }: CountdownSectionProps) {
  return (
    <Section variant="soft" spacing="none" className="animate-fade-in">
      <div className="max-w-3xl mx-auto text-center pb-8 sm:pb-12 pt-12 sm:pt-16 space-y-6 sm:space-y-8">
        {/* Titre principal */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-foreground font-normal">
            {dict.home.countdown.title.split(/<br\s*\/?>/g).map((text: string, index: number, array: string[]) => (
              <span key={index}>
                {text}
                {index < array.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-foreground font-serif leading-relaxed font-light">
            {dict.home.countdown.description.split(/<br\s*\/?>/g).map((part: string, index: number, array: string[]) => (
              <span key={index}>
                {part.split(/<\/?strong>/g).map((text: string, i: number) =>
                  i % 2 === 1 ? (
                    <strong key={`${index}-${i}`} className="text-primary font-semibold">
                      {text}
                    </strong>
                  ) : (
                    <span key={`${index}-${i}`}>{text}</span>
                  )
                )}
                {index < array.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* Countdown */}
        <div className="pb-6 sm:pb-8 pt-8 sm:pt-12">
          <Countdown />
        </div>
      </div>
    </Section>
  );
}
