import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import PracticalInfo from "@/components/home/PracticalInfo";
import { CiCalendar, CiCamera, CiLocationOn, CiMail } from "react-icons/ci";
import { PiBedLight, PiChatCenteredDotsLight } from "react-icons/pi";

interface PracticalSectionProps {
  dict: any;
}

export default function PracticalSection({ dict }: PracticalSectionProps) {
  return (
    <Section variant="soft" spacing="sm" className="pb-16 pt-16 sm:pb-24 md:pb-32 animate-fade-in -mt-1">
      <Title level="h2" align="center" withAccent>
        {dict.home.info.title}
      </Title>
      <p className="text-foreground-muted text-sm md:text-base mt-3 sm:mt-4 text-center max-w-2xl mx-auto">
        {dict.home.info.subtitle}
      </p>

      <div className="mt-8 sm:mt-12">
        <PracticalInfo 
          items={[
            {
              icon: <CiCalendar className="text-2xl md:text-4xl" />,
              title: dict.home.info.programme.title,
              description: dict.home.info.programme.description,
              href: "/schedule",
            },
            {
              icon: <CiLocationOn className="text-2xl md:text-4xl" />,
              title: dict.home.info.venue.title,
              description: dict.home.info.venue.description,
              href: "/location",
            },
            {
              icon: <PiBedLight className="text-2xl md:text-4xl" />,
              title: dict.home.info.accommodation.title,
              description: dict.home.info.accommodation.description,
              href: "/accommodations",
            },
            {
              icon: <CiCamera className="text-2xl md:text-4xl" />,
              title: dict.home.info.gallery.title,
              description: dict.home.info.gallery.description,
              href: "/galerie",
            },
            {
              icon: <CiMail className="text-2xl md:text-4xl" />,
              title: dict.home.info.rsvp.title,
              description: dict.home.info.rsvp.description,
              href: "/rsvp",
            },
            {
              icon: <PiChatCenteredDotsLight className="text-2xl md:text-4xl" />,
              title: dict.home.info.faq.title,
              description: dict.home.info.faq.description,
              href: "/faq",
            },
          ]}
          learnMoreText={dict.common.learnMore}
        />
      </div>
    </Section>
  );
}
