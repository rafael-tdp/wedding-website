import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import ProgrammeItem from "@/components/programme/ProgrammeItem";
import { getProgramme, getProgrammeTranslation } from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Link from "next/link";
import Button from "@/components/ui/Button";

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
export default async function ProgrammePage() {
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

  return (
    <main className="min-h-screen animate-page-enter">
      {/* Hero Section */}
      <Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-2.jpg">
        <div className="text-center space-y-4 animate-slide-up">
          <Title level="h1" align="center" withAccent>
            {dict.programme.title}
          </Title>
          <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto">
            {dict.programme.subtitle}
          </p>
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="default" spacing="lg">
        <div className="max-w-6xl mx-auto px-4">
          {/* Liste des événements */}
          <div className="relative">
            {programme.map((item, index) => {
              const translated = getProgrammeTranslation(item, locale === "pt" ? "pt" : "fr");
              return (
                <ProgrammeItem 
                  key={item.id} 
                  item={{ ...item, title: translated.title, description: translated.description }}
                  index={index}
                  isLast={index === programme.length - 1}
                  eventTranslations={dict.programme.events}
                />
              );
            })}
          </div>
        </div>
      </Section>

      {/* Section info pratique */}
      <Section variant="soft" spacing="md">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-serif text-foreground">
            {dict.programme.practical}
          </h2>
          <p className="text-foreground-muted">
            {dict.programme.practicalDescription}
          </p>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4">
            <Link href="/lieu" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.programme.seeVenue}
              </Button>
            </Link>
            <Link href="/hebergements" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.programme.seeAccommodation}
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
