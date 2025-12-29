import Link from "next/link";
import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import Countdown from "@/components/home/Countdown";
import { StoryTimeline } from "@/components/home/StoryTimeline";
import PracticalInfo from "@/components/infos/PracticalInfo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { MdCalendarMonth, MdLocationOn, MdHotel, MdPhotoCamera, MdMailOutline, MdQuestionAnswer } from "react-icons/md";

/**
 * PAGE D'ACCUEIL MULTILINGUE
 * 
 * Utilise les cookies pour déterminer la langue (pas de [lang] dans l'URL)
 */

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen animate-page-enter">
      {/* Hero Section avec image de fond */}
      <div className="relative w-full min-h-[550px] sm:min-h-[750px] bg-cover bg-bottom sm:bg-fixed flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg')",
          backgroundPosition: "center center",
          backgroundSize: "cover"
        }}>
        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 text-white px-3 sm:px-4 py-6 sm:py-8 md:py-0 max-w-3xl animate-slide-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif italic font-normal" style={{ fontFamily: "var(--font-parisienne)" }}>
            {dict.home.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl font-serif italic text-gray-100">
            {dict.home.hero.subtitle}
          </p>
          <p className="text-sm sm:text-base md:text-xl text-gray-100">
            {dict.home.hero.date}
          </p>
          <div className="flex gap-2 sm:gap-4 justify-center pt-4 sm:pt-6 flex-col sm:flex-row sm:flex-wrap md:flex-nowrap md:max-w-2xl md:mx-auto">
            <Link href="/rsvp" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full text-sm sm:text-base">
                {dict.home.hero.confirmPresence}
              </Button>
            </Link>
            <Link href="/programme" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-sm sm:text-base">
                {dict.home.hero.seeProgramme}
              </Button>
            </Link>
          </div>
        </div>
        {/* Courbe qui monte et redescend au bas */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ marginBottom: "-1px" }}
        >
          <path
            d="M 0,120 Q 600,20 1200,120 L 1200,120 L 0,120 Z"
            className="fill-background-soft"
          />
        </svg>
      </div>

      {/* Section Compteur */}
      <Section variant="soft" spacing="none" className="animate-fade-in">
        <div className="max-w-3xl mx-auto text-center pb-8 sm:pb-16 pt-12 sm:pt-6 px-3 sm:px-4">
          {/* Titre principal */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-foreground font-normal">
              {dict.home.countdown.title.split(/<br\s*\/?>/g).map((text, index, array) => (
                <span key={index}>
                  {text}
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-foreground font-serif leading-relaxed font-light">
              {dict.home.countdown.description.split(/<br\s*\/?>/g).map((part, index, array) => (
                <span key={index}>
                  {part.split(/<\/?strong>/g).map((text, i) =>
                    i % 2 === 1 ? (
                      <strong key={`${index}-${i}`} className="text-primary font-semibold">
                        {text}
                      </strong>
                    ) : (
                      <span key={`${index}-${i}`}>{text}</span>
                    )
                  )}
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          {/* Countdown */}
          <div className="pb-6 sm:pb-8 pt-8 sm:pt-12">
            <Countdown />
          </div>
        </div>
      </Section>

      {/* Section Notre Histoire */}
      <Section variant="default" spacing="md" className="pt-8 pb-20 sm:py-16 animate-fade-in">
        <StoryTimeline dict={dict} />
      </Section>

      <svg
        className="w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ marginTop: "-1px" }}
      >
        <path
          d="M 0,0 Q 600,100 1200,0 L 1200,120 L 0,120 Z"
          className="fill-background-soft"
        />
      </svg>


      {/* Section Informations Pratiques */}
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
            ]}
          />
        </div>
      </Section>

      {/* Section CTA Finale */}
      <Section variant="default" spacing="none" className="py-16 sm:py-24 md:py-32 px-3 sm:px-4 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
          <Title level="h2" align="center" withAccent>
            {dict.home.cta.title}
          </Title>
          <p className="text-foreground-muted text-base sm:text-lg leading-relaxed">
            {dict.home.cta.text}
          </p>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-2 sm:pt-4">
            <Link href="/rsvp" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.home.cta.confirmPresence}
              </Button>
            </Link>
            <Link href="/faq" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.home.cta.seeQuestions}
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
