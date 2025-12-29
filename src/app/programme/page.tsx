import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import ProgrammeItem from "@/components/programme/ProgrammeItem";
import type { Programme } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Programme - Notre Mariage",
  description: "Déroulé de notre journée de mariage",
};

/**
 * Mock programme pour le mode portfolio
 */
const MOCK_PROGRAMME: Programme[] = [
  {
    id: "prog-1",
    title: "Arrivée des invités",
    title_fr: "Arrivée des invités",
    title_pt: "Chegada dos convidados",
    description: null,
    description_fr: null,
    description_pt: null,
    event_time: "13:00:00",
    duration_minutes: 30,
    location: "Parking & Entrée",
    address: null,
    icon: "arrival",
    display_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-2",
    title: "Cérémonie",
    title_fr: "Cérémonie",
    title_pt: "Cerimônia",
    description: "Échange des vœux",
    description_fr: "Échange des vœux",
    description_pt: "Troca de votos",
    event_time: "14:00:00",
    duration_minutes: 45,
    location: "Jardin principal",
    address: null,
    icon: "ceremony",
    display_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-3",
    title: "Cocktail de bienvenue",
    title_fr: "Cocktail de bienvenue",
    title_pt: "Coquetel de boas-vindas",
    description: "Boissons et amuse-bouches",
    description_fr: "Boissons et amuse-bouches",
    description_pt: "Bebidas e acompanhamentos",
    event_time: "15:00:00",
    duration_minutes: 60,
    location: "Terrasse",
    address: null,
    icon: "cocktail",
    display_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-4",
    title: "Dîner",
    title_fr: "Dîner",
    title_pt: "Jantar",
    description: "Service du repas",
    description_fr: "Service du repas",
    description_pt: "Serviço de refeições",
    event_time: "16:30:00",
    duration_minutes: 120,
    location: "Salle des festins",
    address: null,
    icon: "dinner",
    display_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-5",
    title: "Toasts et discours",
    title_fr: "Toasts et discours",
    title_pt: "Brindes e discursos",
    description: "Moments d'émotion",
    description_fr: "Moments d'émotion",
    description_pt: "Momentos de emoção",
    event_time: "18:30:00",
    duration_minutes: 45,
    location: "Salle des festins",
    address: null,
    icon: "toasts",
    display_order: 5,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-6",
    title: "Gâteau & Moments sucrés",
    title_fr: "Gâteau & Moments sucrés",
    title_pt: "Bolo & Momentos doces",
    description: "Découpe du gâteau",
    description_fr: "Découpe du gâteau",
    description_pt: "Corte do bolo",
    event_time: "19:30:00",
    duration_minutes: 30,
    location: "Salle des festins",
    address: null,
    icon: "cake",
    display_order: 6,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prog-7",
    title: "Danse & Célébration",
    title_fr: "Danse & Célébration",
    title_pt: "Dança & Celebração",
    description: "Première danse et bal",
    description_fr: "Première danse et bal",
    description_pt: "Primeira dança e baile",
    event_time: "20:30:00",
    duration_minutes: 180,
    location: "Piste de danse",
    address: null,
    icon: "party",
    display_order: 7,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
  // PORTFOLIO: Utilisation de mock données au lieu de Supabase
  const programme = MOCK_PROGRAMME;

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
              // Pour les mocks avec title_fr/title_pt, utiliser directement
              const title = locale === "pt" ? (item.title_pt || item.title) : (item.title_fr || item.title);
              const description = locale === "pt" ? (item.description_pt || item.description) : (item.description_fr || item.description);
              
              return (
                <ProgrammeItem 
                  key={item.id} 
                  item={{ ...item, title, description }}
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
