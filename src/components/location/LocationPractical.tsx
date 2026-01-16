"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { Title } from "@/components/ui";
import { MdPhone, MdEmail, MdLanguage } from "react-icons/md";
import { SiGooglemaps, SiWaze, SiApple } from "react-icons/si";

interface LocationPracticalProps {
  dict: any;
  venue: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    lat: number;
    lng: number;
  };
  isMobile: boolean;
  isIOS: boolean;
}

export default function LocationPractical({
  dict,
  venue,
  isMobile,
  isIOS,
}: LocationPracticalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(venue.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section variant="soft" spacing="lg">
      <div
        ref={containerRef}
        className={`max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >

        {/* Grille : 4 cartes séparées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Adresse */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "0ms" : "0ms",
            }}
          >
            <Card variant="default" className="h-full bg-background">
              <div>
                <Title level="h5" align="left" withAccent={false} className="mb-4">
                  {dict.venue.address}
                </Title>
                <button
                  onClick={handleCopyAddress}
                  className="text-sm text-foreground-muted hover:text-foreground transition-colors cursor-pointer text-left"
                  title="Cliquez pour copier"
                >
                  <p className="font-medium">{venue.address}</p>
                  <p className="text-xs mt-2 opacity-75">
                    {copied ? dict.venue.copiedAddress : dict.venue.copyAddress}
                  </p>
                </button>
              </div>
            </Card>
          </div>

          {/* Contact */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "100ms" : "0ms",
            }}
          >
            <Card variant="default" className="h-full bg-background">
              <div>
                <Title level="h5" align="left" withAccent={false} className="mb-4">
                  {dict.venue.contact}
                </Title>
                <div className="space-y-3 text-sm text-foreground-muted">
                  <div className="flex items-center gap-3">
                    <MdPhone className="w-5 h-5 text-primary flex-shrink-0" />
                    <a
                      href={`tel:${venue.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      {venue.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdEmail className="w-5 h-5 text-primary flex-shrink-0" />
                    <a
                      href={`mailto:${venue.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {venue.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdLanguage className="w-5 h-5 text-primary flex-shrink-0" />
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {dict.venue.website}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Accessibilité */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "200ms" : "0ms",
            }}
          >
            <Card variant="default" className="h-full bg-background">
              <div>
                <Title level="h5" align="left" withAccent={false} className="mb-4">
                  {dict.venue.accessibility}
                </Title>
                <p className="text-sm text-foreground-muted">
                  {dict.venue.accessibilityText}
                </p>
              </div>
            </Card>
          </div>

          {/* Navigation GPS */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: isVisible ? "300ms" : "0ms",
            }}
          >
            <Card variant="default" className="h-full bg-background flex flex-col justify-between">
              <div>
                <Title level="h5" align="left" withAccent={false} className="mb-3">
                  {dict.venue.directions || "Accès au lieu"}
                </Title>
                <p className="text-sm text-foreground-muted mb-6">
                  {dict.venue.directionsText ||
                    "Ouvrez votre application de navigation préférée."}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                {isMobile ? (
                  <>
                    {isIOS ? (
                      <>
                        <a
                          href={`maps://maps.apple.com/?address=${encodeURIComponent(
                            venue.address
                          )}&adr=${venue.lat},${venue.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-md text-sm sm:text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <SiApple className="w-4 h-4 sm:w-5 sm:h-5" />
                          Plans Apple
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-md text-sm sm:text-base font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                        >
                          <SiWaze className="w-4 h-4 sm:w-5 sm:h-5" />
                          Waze
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={`https://maps.app.goo.gl/?q=${venue.lat},${venue.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-md text-sm sm:text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <SiGooglemaps className="w-4 h-4 sm:w-5 sm:h-5" />
                          Google Maps
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-md text-sm sm:text-base font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                        >
                          <SiWaze className="w-4 h-4 sm:w-5 sm:h-5" />
                          Waze
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-md text-sm sm:text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <SiGooglemaps className="w-4 h-4 sm:w-5 sm:h-5" />
                    Google Maps
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
