"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import Card from "@/components/ui/Card";
import Map from "@/components/lieu/Map";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { SiGooglemaps, SiWaze, SiApple } from "react-icons/si";

// Configuration du lieu (à personnaliser)
const WEDDING_VENUE = {
  name: "Château de Vallée",
  address: "12 Route du Château, 75001 Paris, France",
  lat: 48.8566,
  lng: 2.3522,
  phone: "01 23 45 67 89",
  email: "contact@chateau-vallee.fr",
  website: "https://www.chateau-vallee.fr",
};

export default function LieuPageClient({ dict }: { dict: any }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Détecter si on est sur mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|android|ipad|ipod/.test(userAgent);
    setIsMobile(isMobileDevice);
    
    // Détecter spécifiquement iOS
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  return (
    <main className="min-h-screen animate-page-enter">
      {/* Hero Section */}
      <Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-3.jpg">
        <div className="text-center space-y-4 animate-slide-up">
          <Title level="h1" align="center" withAccent>
            {dict.venue.title}
          </Title>
          <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto">
            {dict.venue.subtitle}
          </p>
        </div>
      </Section>

      {/* Carte */}
      <Section variant="default" spacing="md">
        <div className="max-w-5xl mx-auto">
          <Map
            address={WEDDING_VENUE.address}
            lat={WEDDING_VENUE.lat}
            lng={WEDDING_VENUE.lng}
            zoom={15}
          />
        </div>
      </Section>

      {/* Informations principales */}
      <Section variant="soft" spacing="lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 sm:mb-3">
              {WEDDING_VENUE.name}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground-muted">
              {WEDDING_VENUE.address}
            </p>
          </div>

          {/* Moyens d'accès */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* En voiture */}
            <Card variant="default">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 sm:w-8 h-6 sm:h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-foreground">
                  {dict.venue.byCar}
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
                  {dict.venue.byCarText}
                </p>
              </div>
            </Card>

            {/* En train */}
            <Card variant="default">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg
                    className="w-6 sm:w-8 h-6 sm:h-8 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-foreground">
                  {dict.venue.byTrain}
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
                  {dict.venue.byTrainText}
                </p>
              </div>
            </Card>

            {/* En avion */}
            <Card variant="default">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <svg
                    className="w-6 sm:w-8 h-6 sm:h-8 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-serif text-foreground">
                  {dict.venue.byPlane}
                </h3>
                <p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
                  {dict.venue.byPlaneText}
                </p>
              </div>
            </Card>
          </div>

          {/* Coordonnées GPS */}
          <Card variant="bordered">
            <div className="text-center space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-serif text-foreground">
                {dict.venue.gps}
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted mb-1">
                    {dict.venue.latitude}
                  </p>
                  <p className="text-base sm:text-lg font-mono text-foreground">
                    {WEDDING_VENUE.lat}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted mb-1">
                    {dict.venue.longitude}
                  </p>
                  <p className="text-base sm:text-lg font-mono text-foreground">
                    {WEDDING_VENUE.lng}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-4">
                {isMobile ? (
                  <>
                    {isIOS ? (
                      <>
                        <a
                          href={`maps://maps.apple.com/?address=${encodeURIComponent(WEDDING_VENUE.address)}&adr=${WEDDING_VENUE.lat},${WEDDING_VENUE.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                        >
                          <SiApple className="w-5 h-5" />
                          Plans
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${WEDDING_VENUE.lat},${WEDDING_VENUE.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-md text-sm sm:text-base font-medium text-white transition-colors" style={{ backgroundColor: 'rgba(8, 200, 247)' }}
                        >
                          <SiWaze className="w-5 h-5" />
                          Waze
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={`https://maps.app.goo.gl/?q=${WEDDING_VENUE.lat},${WEDDING_VENUE.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          <SiGooglemaps className="w-5 h-5" />
                          Google Maps
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${WEDDING_VENUE.lat},${WEDDING_VENUE.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <SiWaze className="w-5 h-5" />
                          Waze
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${WEDDING_VENUE.lat},${WEDDING_VENUE.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <SiGooglemaps className="w-5 h-5" />
                    Ouvrir sur Google Maps
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Informations supplémentaires */}
      <Section variant="default" spacing="lg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <Title level="h2" align="center" withAccent>
            {dict.venue.practical}
          </Title>

          <div className="space-y-6">
            {/* Contact */}
            <Card variant="soft">
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-4">
                {dict.venue.contact}
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-foreground-muted">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
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
                  <a
                    href={`tel:${WEDDING_VENUE.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {WEDDING_VENUE.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
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
                  <a
                    href={`mailto:${WEDDING_VENUE.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {WEDDING_VENUE.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <a
                    href={WEDDING_VENUE.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {dict.venue.website}
                  </a>
                </div>
              </div>
            </Card>

            {/* Accessibility */}
            <Card variant="soft">
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-4">
                {dict.venue.accessibility}
              </h3>
              <p className="text-sm sm:text-base text-foreground-muted">
                {dict.venue.accessibilityText}
              </p>
            </Card>
          </div>

          {/* Liens utiles */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center flex-wrap pt-6">
            <Link href="/programme">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.venue.seeProgramme}
              </Button>
            </Link>
            <Link href="/hebergements">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                {dict.venue.seeAccommodation}
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
