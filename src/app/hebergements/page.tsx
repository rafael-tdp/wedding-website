import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import HebergementCard from "@/components/hebergements/HebergementCard";
import type { Hebergement } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Link from "next/link";
import { MdLocalOffer, MdDirectionsCar, MdLocationOn, MdQuestionAnswer } from "react-icons/md";
import { Button } from "@/components/ui";

export const metadata = {
  title: "Hébergements - Notre Mariage",
  description: "Hébergements recommandés près du lieu du mariage",
};

/**
 * Mock hébergements pour le mode portfolio
 */
const MOCK_HEBERGEMENTS: Hebergement[] = [
  {
    id: "hotel-1",
    name: "Hotel Grand Luxe",
    type: "hotel",
    description: "Un hôtel 4 étoiles avec vue panoramique",
    address: "123 Rue de la Paix",
    city: "Beaumont",
    postal_code: "75001",
    distance_km: 2,
    phone: "+33 1 23 45 67 89",
    email: "contact@grandluxe.fr",
    website: "https://www.grandluxe.fr",
    price_range: "€€€",
    price_note: "À partir de 150€/nuit",
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    is_recommended: true,
    display_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "gite-1",
    name: "Gîte Champêtre",
    type: "gite",
    description: "Un charmant gîte en montagne avec piscine",
    address: "456 Route de la Montagne",
    city: "Valmont",
    postal_code: "75002",
    distance_km: 8,
    phone: "+33 1 98 76 54 32",
    email: "contact@gite-champetre.fr",
    website: "https://www.gite-champetre.fr",
    price_range: "€€",
    price_note: "À partir de 80€/nuit",
    image_url: "https://images.unsplash.com/photo-1547561993-9fe9f2af3fd4?w=500",
    is_recommended: true,
    display_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "chambre-1",
    name: "Chambres d'Hôtes Le Verger",
    type: "chambres_hotes",
    description: "Chambres cosy dans une maison d'époque",
    address: "789 Chemin des Fleurs",
    city: "Villeneuve",
    postal_code: "75003",
    distance_km: 5,
    phone: "+33 1 55 44 33 22",
    email: "contact@leverger.fr",
    website: "https://www.leverger.fr",
    price_range: "€",
    price_note: "À partir de 60€/nuit",
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    is_recommended: false,
    display_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "airbnb-1",
    name: "Appartement avec Vue",
    type: "airbnb",
    description: "Apartement moderne avec balcon vue lac",
    address: "321 Boulevard du Lac",
    city: "Lakeview",
    postal_code: "75004",
    distance_km: 3,
    phone: "+33 1 77 88 99 00",
    email: "contact@apartement-lac.fr",
    website: "https://www.apartement-lac.fr",
    price_range: "€€",
    price_note: "À partir de 90€/nuit",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    is_recommended: true,
    display_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * PAGE : HÉBERGEMENTS (Multilingue)
 * 
 * Server Component qui récupère la liste des hébergements
 * depuis Supabase et les affiche par catégorie avec traductions.
 */
export default async function HebergementsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  // Utiliser les mock hébergements au lieu de Supabase
  const hebergements = MOCK_HEBERGEMENTS;
  const recommended = MOCK_HEBERGEMENTS.filter(h => h.is_recommended);

  // Grouper par type
  const hebergementsByType = hebergements.reduce(
    (acc, h) => {
      if (!acc[h.type]) {
        acc[h.type] = [];
      }
      acc[h.type].push(h);
      return acc;
    },
    {} as Record<Hebergement["type"], Hebergement[]>
  );

  return (
    <main className="min-h-screen bg-white animate-page-enter">
      {/* Hero Section */}
      <Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-4.jpg">
        <div className="text-center space-y-3 sm:space-y-4 px-4 animate-slide-up">
          <Title level="h1" align="center" withAccent>
            {dict.accommodation.title}
          </Title>
          <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto">
            {dict.accommodation.subtitle}
          </p>
        </div>
      </Section>

      {/* Hébergements recommandés */}
      {recommended.length > 0 && (
        <Section variant="default" spacing="lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-0">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 sm:mb-3">
                {dict.accommodation.recommended}
              </h2>
              <p className="text-sm sm:text-base text-foreground-muted">
                {dict.accommodation.recommendedText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommended.map((hebergement) => (
                <HebergementCard
                  key={hebergement.id}
                  hebergement={hebergement}
                />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Tous les hébergements par type */}
      {hebergements.length > 0 && (
        <Section variant="soft" spacing="lg">
          <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14 px-4 sm:px-0">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 sm:mb-3">
                {dict.accommodation.recommended}
              </h2>
              <p className="text-sm sm:text-base text-foreground-muted">
                {dict.accommodation.recommendedText}
              </p>
            </div>

            {/* Par type */}
            {Object.entries(hebergementsByType).map(([type, items]) => (
              <div key={type} className="space-y-4 sm:space-y-6">
                {/* Type Header */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-serif text-foreground">
                    {getTypeLabel(type as Hebergement["type"])}
                    <span className="text-foreground-muted text-sm sm:text-lg ml-2 font-normal">
                      ({items.length})
                    </span>
                  </h3>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {items.map((hebergement) => (
                    <HebergementCard
                      key={hebergement.id}
                      hebergement={hebergement}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Message si aucun hébergement */}
      {hebergements.length === 0 && (
        <Section variant="default" spacing="lg">
          <div className="text-center py-12">
            <p className="text-foreground-muted">
              {dict.accommodation.comingSoon}
            </p>
          </div>
        </Section>
      )}
      {/* Conseils pratiques */}
      <Section variant="default" spacing="lg">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 px-4 sm:px-0">
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 sm:mb-3">
              {dict.accommodation.practicalTips}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Réservez tôt */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0 text-primary">
                  <MdLocalOffer />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">
                    {dict.accommodation.bookEarly.title}
                  </h3>
                  <p className="text-foreground-muted text-xs sm:text-sm">
                    {dict.accommodation.bookEarly.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Covoiturage */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0 text-primary">
                  <MdDirectionsCar />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">
                    {dict.accommodation.carpooling.title}
                  </h3>
                  <p className="text-foreground-muted text-xs sm:text-sm">
                    {dict.accommodation.carpooling.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Distance */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0 text-primary">
                  <MdLocationOn />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">
                    {dict.accommodation.distance.title}
                  </h3>
                  <p className="text-foreground-muted text-xs sm:text-sm">
                    {dict.accommodation.distance.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl flex-shrink-0 text-primary">
                  <MdQuestionAnswer />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">
                    {dict.accommodation.questions.title}
                  </h3>
                  <p className="text-foreground-muted text-xs sm:text-sm">
                    {dict.accommodation.questions.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4">
            <Link href="/lieu" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.accommodation.seeVenue}
              </Button>
            </Link>
            <Link href="/programme" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.accommodation.seeProgramme}
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}

/**
 * Helper pour traduire les types d'hébergement
 */
function getTypeLabel(type: Hebergement["type"]): string {
  const labels: Record<Hebergement["type"], string> = {
    hotel: "Hôtels",
    gite: "Gîtes",
    chambres_hotes: "Chambres d'Hôtes",
    airbnb: "Locations de Vacances",
  };
  return labels[type] || type;
}
