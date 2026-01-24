import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import HeroSection from "@/components/ui/HeroSection";
import ScheduleTimeline from "@/components/schedule/ScheduleTimeline";
import SchedulePractical from "@/components/schedule/SchedulePractical";
import { getProgramme, getProgrammeTranslation } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
  title: "Programme - Notre Mariage",
  description: "Déroulé de notre journée de mariage",
};

/**
 * PAGE : PROGRAMME
 * 
 * Server Component multilingue qui récupère le programme depuis Supabase
 * et l'affiche sous forme de timeline avec traductions.
 */
export default async function SchedulePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  // Récupération des données côté serveur
  const programme = await getProgramme();

  // Caso onde o programme est vide
  if (programme.length === 0) {
    return (
      <main className="min-h-screen">
        <Section variant="default" spacing="lg" isHero>
          <Title level="h1" align="center" withAccent>
            {dict.programme.title}
          </Title>
          <p className="text-center text-foreground-muted mt-6">
            {dict.programme.empty}
          </p>
        </Section>
      </main>
    );
  }

  // Préparer les données avec traductions
  const programmeWithTranslations = programme.map((item) => {
    const translated = getProgrammeTranslation(item, locale === "pt" ? "pt" : "fr");
    return {
      ...item,
      title: translated.title,
      description: translated.description,
    };
  });

  return (
    <main className="min-h-screen animate-page-enter">
      <HeroSection
        title={dict.programme.title}
        subtitle={dict.programme.subtitle}
        backgroundImage="/images/hero-bg-2.jpg"
        withBackgroundLetter
      />

      <ScheduleTimeline 
        items={programmeWithTranslations}
        eventTranslations={dict.programme.events}
      />

      <SchedulePractical
        title={dict.programme.practical}
        description={dict.programme.practicalDescription}
        venueButtonLabel={dict.programme.seeVenue}
        accommodationButtonLabel={dict.programme.seeAccommodation}
      />
    </main>
  );
}
