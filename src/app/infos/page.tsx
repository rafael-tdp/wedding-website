import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import PracticalInfo from "@/components/infos/PracticalInfo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { MdCalendarMonth, MdLocationOn, MdHotel, MdPhotoCamera, MdMailOutline, MdQuestionAnswer } from "react-icons/md";

export default async function InfosPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  const practicalItems = [
    {
      icon: <MdCalendarMonth className="text-4xl" />,
      title: dict.home.info.programme.title,
      description: dict.home.info.programme.description,
      href: "/programme",
    },
    {
      icon: <MdLocationOn className="text-4xl" />,
      title: dict.home.info.venue.title,
      description: dict.home.info.venue.description,
      href: "/lieu",
    },
    {
      icon: <MdHotel className="text-4xl" />,
      title: dict.home.info.accommodation.title,
      description: dict.home.info.accommodation.description,
      href: "/hebergements",
    },
    {
      icon: <MdPhotoCamera className="text-4xl" />,
      title: dict.home.info.gallery.title,
      description: dict.home.info.gallery.description,
      href: "/galerie",
    },
    {
      icon: <MdMailOutline className="text-4xl" />,
      title: dict.home.info.rsvp.title,
      description: dict.home.info.rsvp.description,
      href: "/rsvp",
    },
    {
      icon: <MdQuestionAnswer className="text-4xl" />,
      title: dict.home.info.faq.title,
      description: dict.home.info.faq.description,
      href: "/faq",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section avec titre */}
      <Section variant="soft" spacing="lg">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Title level="h1" align="center" withAccent>
            {dict.home.info.title}
          </Title>
          <p className="text-xl text-foreground-muted font-serif leading-relaxed">
            Retrouvez ici toutes les informations pratiques pour préparer votre venue à notre mariage.
          </p>
        </div>
      </Section>

      {/* Section Grille d'informations pratiques */}
      <Section variant="default" spacing="lg">
        <PracticalInfo items={practicalItems} learnMoreText={dict.common.learnMore} />
      </Section>

      {/* Section Recommandations supplémentaires */}
      <Section variant="soft" spacing="lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-serif text-primary">💡 Conseils Pratiques</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-serif text-primary mb-3">Préparation</h3>
              <ul className="space-y-2 text-foreground-muted text-sm">
                <li>✓ Consultez le programme détaillé</li>
                <li>✓ Confirmez votre présence avant la date limite</li>
                <li>✓ Réservez votre hébergement à l&apos;avance</li>
                <li>✓ Vérifiez les conditions d&apos;accès au lieu</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-serif text-primary mb-3">Le Jour J</h3>
              <ul className="space-y-2 text-foreground-muted text-sm">
                <li>✓ Arrivez 15 minutes avant l&apos;événement</li>
                <li>✓ Utilisez les parkings mis à disposition</li>
                <li>✓ Consultez le programme pour les horaires</li>
                <li>✓ N&apos;hésitez pas à nous contacter en cas de besoin</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Section Contact */}
      <Section variant="default" spacing="lg">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg">
          <h2 className="text-2xl font-serif text-primary">Des questions ?</h2>
          <p className="text-foreground-muted">
            Consultez notre FAQ pour trouver les réponses à vos questions, ou n&apos;hésitez pas à nous contacter directement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/faq"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary-dark"
            >
              Consulter la FAQ
            </a>
            <a 
              href="mailto:tavaresrafael93@gmail.com"
              className="inline-block px-6 py-3 border border-primary text-primary rounded-lg font-medium transition-colors hover:bg-primary/10"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
