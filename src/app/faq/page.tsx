import Section from "@/components/ui/Section";
import HeroSection from "@/components/ui/HeroSection";
import FAQItem from "@/components/faq/FAQItem";
import Button from "@/components/ui/Button";
import {
  getFAQ,
  getFAQTranslation,
  FAQ as FAQType,
} from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Title from "@/components/ui/Title";

export const metadata = {
  title: "FAQ - Notre Mariage",
  description: "Questions fréquemment posées sur notre mariage",
};

export default async function FAQPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  // Récupération des données côté serveur
  const faqs = await getFAQ();

  // Fonction pour obtenir la traduction
  const getTranslatedFAQ = (faq: FAQType) => {
    return getFAQTranslation(faq, locale === "pt" ? "pt" : "fr");
  };

  // Grouper les FAQ par catégorie traduite
  const faqsByCategory = faqs.reduce(
    (acc, faq) => {
      const translated = getTranslatedFAQ(faq);
      const categoryName = translated.category;
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
      <HeroSection
        title={dict.faq.title}
        subtitle={dict.faq.subtitle}
        backgroundImage="/images/hero-bg-7.jpg"
        withBackgroundLetter
      />

      {/* FAQ par catégorie */}
      {Object.keys(faqsByCategory).length > 0 ? (
        <Section variant="default" spacing="lg">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-12">
            {Object.entries(faqsByCategory).map(([categoryName, categoryFaqs]) => (
              <div key={categoryName}>
                <h2 className="text-xl sm:text-2xl md:text-3xl text-foreground mb-3 sm:mb-6 pb-2 sm:pb-3 border-b border-primary/20 font-medium">
                  {categoryName}
                </h2>

                <div className="space-y-3">
                  {categoryFaqs.map((faq) => {
                    const translated = getTranslatedFAQ(faq);
                    return (
                      <FAQItem
                        key={faq.id}
                        question={translated.question}
                        answer={translated.answer}
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
        <div className="mx-auto text-center space-y-4 sm:space-y-6">
          <Title level="h2" align="center" withAccent>
            {dict.faq.contact.title}
          </Title>
          <p className="text-sm sm:text-base text-foreground-muted md:text-lg">
            {dict.faq.contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center pt-2 sm:pt-4">
            <a href="mailto:tavaresrafael93@gmail.com" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto flex items-center justify-center gap-2">
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
              </Button>
            </a>
            <a href="tel:+33695224932" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto flex items-center justify-center gap-2">
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
              </Button>
            </a>
          </div>

          {/* Navigation */}
          <div className="pt-4 sm:pt-8 border-t border-primary/10">
            <p className="text-sm sm:text-base text-foreground-muted mb-3 sm:mb-4">
              {dict.faq.see.title}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              <a
                href="/schedule"
                className="text-xs sm:text-sm text-primary hover:text-primary-dark underline"
              >
                {dict.faq.see.programme}
              </a>
              <span className="text-foreground-muted hidden sm:inline">•</span>
              <a
                href="/location"
                className="text-xs sm:text-sm text-primary hover:text-primary-dark underline"
              >
                {dict.faq.see.venue}
              </a>
              <span className="text-foreground-muted hidden sm:inline">•</span>
              <a
                href="/accommodations"
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
