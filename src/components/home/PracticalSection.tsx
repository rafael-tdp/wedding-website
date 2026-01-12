import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import PracticalInfo from "@/components/infos/PracticalInfo";
import { MdCalendarMonth, MdLocationOn, MdHotel, MdPhotoCamera, MdMailOutline, MdQuestionAnswer } from "react-icons/md";

interface PracticalSectionProps {
  dict: any;
}

export default function PracticalSection({ dict }: PracticalSectionProps) {
  return (
    <Section variant="soft" spacing="sm" className="px-3 sm:px-4 pb-16 sm:pb-24 md:pb-32 animate-fade-in">
      <Title level="h2" align="center" withAccent>
        {dict.home.info.title}
      </Title>
      <p className="text-foreground-muted text-xs sm:text-sm mt-3 sm:mt-4 text-center max-w-2xl mx-auto">
        {dict.home.info.subtitle}
      </p>

      <div className="mt-8 sm:mt-12">
        <PracticalInfo 
          items={[
            {
              icon: <MdCalendarMonth className="text-2xl md:text-4xl" />,
              title: dict.home.info.programme.title,
              description: dict.home.info.programme.description,
              href: "/programme",
            },
            {
              icon: <MdLocationOn className="text-2xl md:text-4xl" />,
              title: dict.home.info.venue.title,
              description: dict.home.info.venue.description,
              href: "/lieu",
            },
            {
              icon: <MdHotel className="text-2xl md:text-4xl" />,
              title: dict.home.info.accommodation.title,
              description: dict.home.info.accommodation.description,
              href: "/hebergements",
            },
            {
              icon: <MdPhotoCamera className="text-2xl md:text-4xl" />,
              title: dict.home.info.gallery.title,
              description: dict.home.info.gallery.description,
              href: "/galerie",
            },
            {
              icon: <MdMailOutline className="text-2xl md:text-4xl" />,
              title: dict.home.info.rsvp.title,
              description: dict.home.info.rsvp.description,
              href: "/rsvp",
            },
            {
              icon: <MdQuestionAnswer className="text-2xl md:text-4xl" />,
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
