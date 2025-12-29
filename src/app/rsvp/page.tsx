import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import RSVPForm from "@/components/rsvp/RSVPForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { MdCalendarMonth, MdRestaurant, MdMusicNote, MdHelpOutline } from "react-icons/md";

export const metadata = {
  title: "RSVP - Notre Mariage",
  description: "Confirmez votre présence à notre mariage",
};

/**
 * PAGE : RSVP (Multilingue)
 * 
 * Server Component qui affiche le formulaire de confirmation avec traductions.
 */
export default async function RSVPPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen animate-page-enter">
      {/* Hero Section */}
      <Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-6.jpg">
        <div className="text-center space-y-3 sm:space-y-4 px-4 animate-slide-up">
          <Title level="h1" align="center" withAccent>
            {dict.rsvp.title}
          </Title>
          <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto">
            {dict.rsvp.subtitle}
          </p>
        </div>
      </Section>

      {/* Formulaire */}
      <Section variant="default" spacing="lg">
        <div className="px-4 sm:px-0 max-w-2xl mx-auto">
          <RSVPForm />
        </div>
      </Section>

      {/* Informations complémentaires */}
      <Section variant="soft" spacing="md">
        <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground text-center mb-6 sm:mb-8">
            {dict.rsvp.important}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-background p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-serif text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary">
                <MdCalendarMonth className="text-lg sm:text-xl flex-shrink-0" />
                <span>{dict.rsvp.deadline}</span>
              </h3>
              <p className="text-foreground-muted text-xs sm:text-sm">
                {dict.rsvp.deadlineText}
              </p>
            </div>

            <div className="bg-background p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-serif text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary">
                <MdRestaurant className="text-lg sm:text-xl flex-shrink-0" />
                <span>{dict.rsvp.menu}</span>
              </h3>
              <p className="text-foreground-muted text-xs sm:text-sm">
                {dict.rsvp.menuText}
              </p>
            </div>

            <div className="bg-background p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-serif text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary">
                <MdMusicNote className="text-lg sm:text-xl flex-shrink-0" />
                <span>{dict.rsvp.music}</span>
              </h3>
              <p className="text-foreground-muted text-xs sm:text-sm">
                {dict.rsvp.musicText}
              </p>
            </div>

            <div className="bg-background p-4 sm:p-6 rounded-lg">
              <h3 className="text-base sm:text-lg font-serif text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary">
                <MdHelpOutline className="text-lg sm:text-xl flex-shrink-0" />
                <span>{dict.rsvp.questions}</span>
              </h3>
              <p className="text-foreground-muted text-xs sm:text-sm">
                {dict.rsvp.questionsText}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-6 sm:pt-8">
            <Link href="/programme" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.rsvp.seeProgramme}
              </Button>
            </Link>
            <Link href="/hebergements" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.rsvp.seeAccommodation}
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
