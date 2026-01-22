"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { SiGooglemaps, SiWaze, SiApple } from "react-icons/si";
import { Title } from "../ui";

interface LieuGPSProps {
  dict: any;
  venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  isMobile: boolean;
  isIOS: boolean;
}

export default function LieuGPS({ dict, venue, isMobile, isIOS }: LieuGPSProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(venue.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section variant="soft" spacing="lg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <Title level="h3" align="center" className="mb-2">
            {venue.name}
          </Title>
          <button
            onClick={handleCopyAddress}
            className="text-sm sm:text-base md:text-lg text-foreground-muted hover:text-foreground cursor-pointer transition-colors"
            title="Cliquez pour copier"
          >
            <p>{venue.address}</p>
            <p className="text-xs mt-1 opacity-75">
              {copied ? dict.venue.copiedAddress : dict.venue.copyAddress}
            </p>
          </button>
        </div>

        <Card variant="default" className="p-6 sm:p-8 lg:p-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-3">
              <Title level="h4" align="center">
                {dict.venue.directions || "Accès au lieu"}
              </Title>
              <p className="text-sm sm:text-base text-foreground-muted max-w-2xl mx-auto">
                {dict.venue.directionsText || "Cliquez sur le bouton ci-dessous pour ouvrir votre application de navigation préférée et obtenir les directions."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center flex-wrap">
              {isMobile ? (
                <>
                  {isIOS ? (
                    <>
                      <a
                        href={`maps://maps.apple.com/?address=${encodeURIComponent(venue.address)}&adr=${venue.lat},${venue.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <SiApple className="w-5 h-5" />
                        Plans
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                      >
                        <SiWaze className="w-5 h-5" />
                        Waze
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href={`https://maps.app.goo.gl/?q=${venue.lat},${venue.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <SiGooglemaps className="w-5 h-5" />
                        Google Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                      >
                        <SiWaze className="w-5 h-5" />
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
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <SiGooglemaps className="w-5 h-5" />
                  Google Maps
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
