import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import FAQItem from "@/components/faq/FAQItem";
import type { FAQ as FAQType } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
  title: "FAQ - Notre Mariage",
  description: "Questions fréquemment posées sur notre mariage",
};

/**
 * Mock FAQ pour le mode portfolio
 */
const MOCK_FAQS: FAQType[] = [
  {
    id: "faq-1",
    category_fr: "Présence",
    category_pt: "Presença",
    question_fr: "Que dois-je porter?",
    question_pt: "O que devo vestir?",
    answer_fr: "Une tenue habillée ou formelle est recommandée. La cérémonie se déroule en plein air, donc des chaussures confortables sont appréciées.",
    answer_pt: "Recomenda-se roupas elegantes ou formais. A cerimônia ocorre ao ar livre, portanto sapatos confortáveis são bem-vindos.",
    created_at: new Date().toISOString(),
    display_order: 1,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-2",
    category_fr: "Logistique",
    category_pt: "Logística",
    question_fr: "Y a-t-il un parking?",
    question_pt: "Há estacionamento disponível?",
    answer_fr: "Oui, un parking gratuit est disponible sur place avec environ 200 places.",
    answer_pt: "Sim, estacionamento gratuito está disponível no local com aproximadamente 200 lugares.",
    created_at: new Date().toISOString(),
    display_order: 2,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-3",
    category_fr: "Hébergement",
    category_pt: "Alojamento",
    question_fr: "Quand dois-je arriver?",
    question_pt: "Quando devo chegar?",
    answer_fr: "Veuillez arriver 15 minutes avant l'heure du début de la cérémonie pour être assis confortablement.",
    answer_pt: "Por favor, chegue 15 minutos antes do início da cerimônia para ser acomodado confortavelmente.",
    created_at: new Date().toISOString(),
    display_order: 3,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-4",
    category_fr: "Menu & Régime",
    category_pt: "Menu & Dieta",
    question_fr: "Pouvez-vous adapter les restrictions alimentaires?",
    question_pt: "Pode acomodar restrições dietéticas?",
    answer_fr: "Absolument! Veuillez indiquer toute restriction alimentaire dans le formulaire RSVP afin que nous puissions préparer en conséquence.",
    answer_pt: "Absolutamente! Indique qualquer restrição dietética no formulário RSVP para que possamos preparar adequadamente.",
    created_at: new Date().toISOString(),
    display_order: 4,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-5",
    category_fr: "Présence",
    category_pt: "Presença",
    question_fr: "Puis-je amener un accompagnant?",
    question_pt: "Posso trazer um acompanhante?",
    answer_fr: "Si votre invitation inclut un plus-one, oui! Sinon, veuillez nous contacter pour en discuter.",
    answer_pt: "Se seu convite inclui um acompanhante, sim! Caso contrário, entre em contato conosco para discutir.",
    created_at: new Date().toISOString(),
    display_order: 5,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
];

/**
 * PAGE : FAQ (Questions Fréquentes - Multilingue)
 * 
 * Server Component qui récupère les FAQ depuis Supabase
 * et les affiche groupées par catégorie avec traductions.
 */
export default async function FAQPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  // Utiliser les mock FAQs au lieu de Supabase
  const faqs = MOCK_FAQS;

  // Fonction pour obtenir la traduction
  const getTranslatedFAQ = (faq: FAQType) => {
    if (locale === "pt") {
      return {
        category: faq.category_pt,
        question: faq.question_pt,
        answer: faq.answer_pt,
      };
    }
    return {
      category: faq.category_fr,
      question: faq.question_fr,
      answer: faq.answer_fr,
    };
  };

  // Grouper les FAQ par catégorie traduite
  const faqsByCategory = faqs.reduce(
    (acc: Record<string, FAQType[]>, faq) => {
      const translated = getTranslatedFAQ(faq);
      const categoryName = translated.category || "Autres";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(faq);
      return acc;
    },
    {} as Record<string, FAQType[]>
  );

  return (
    <main className="min-h-screen animate-page-enter">
      {/* Hero Section */}
      <Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-7.jpg">
        <div className="text-center space-y-2 sm:space-y-4 animate-slide-up">
          <Title level="h1" align="center" withAccent>
            {dict.faq.title}
          </Title>
          <p className="text-base sm:text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto px-4">
            {dict.faq.subtitle}
          </p>
        </div>
      </Section>

      {/* FAQ par catégorie */}
      {Object.keys(faqsByCategory).length > 0 ? (
        <Section variant="default" spacing="lg">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-12 px-4">
            {Object.entries(faqsByCategory).map(([categoryName, categoryFaqs]) => (
              <div key={categoryName}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-primary/20">
                  {categoryName}
                </h2>

                <div className="space-y-3">
                  {categoryFaqs.map((faq) => {
                    const translated = getTranslatedFAQ(faq);
                    return (
                      <FAQItem
                        key={faq.id}
                        question={translated.question ?? ""}
                        answer={translated.answer ?? ""}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : (
        // Message si aucune FAQ
        <Section variant="default" spacing="lg">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-foreground-muted">
              {dict.faq.empty}
            </p>
          </div>
        </Section>
      )}

      {/* Contact */}
      <Section variant="soft" spacing="lg">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 px-4">
          <Title level="h2" align="center" withAccent>
            {dict.faq.contact.title}
          </Title>
          <p className="text-sm sm:text-base text-foreground-muted md:text-lg">
            {dict.faq.contact.subtitle}
          </p>

          <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center pt-2 sm:pt-4">
            <a
              href="mailto:tavaresrafael93@gmail.com"
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium text-sm sm:text-base bg-primary text-white hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {dict.faq.contact.email}
            </a>
            <a
              href="tel:+33695224932"
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md font-medium text-sm sm:text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {dict.faq.contact.phone}
            </a>
          </div>

          {/* Navigation */}
          <div className="pt-4 sm:pt-8 border-t border-primary/10">
            <p className="text-sm sm:text-base text-foreground-muted mb-3 sm:mb-4">
              {dict.faq.see.title}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              <a
                href="/programme"
                className="text-xs sm:text-sm text-primary hover:text-primary-dark underline"
              >
                {dict.faq.see.programme}
              </a>
              <span className="text-foreground-muted hidden sm:inline">•</span>
              <a
                href="/lieu"
                className="text-xs sm:text-sm text-primary hover:text-primary-dark underline"
              >
                {dict.faq.see.venue}
              </a>
              <span className="text-foreground-muted hidden sm:inline">•</span>
              <a
                href="/hebergements"
                className="text-xs sm:text-sm text-primary hover:text-primary-dark underline"
              >
                {dict.faq.see.accommodation}
              </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
