"use client";

import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { SiGooglemaps, SiWaze, SiApple } from "react-icons/si";

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
  return (
    <Section variant="soft" spacing="lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-2 sm:mb-3">
            {venue.name}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground-muted">
            {venue.address}
          </p>
        </div>

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
                  {venue.lat}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-foreground-muted mb-1">
                  {dict.venue.longitude}
                </p>
                <p className="text-base sm:text-lg font-mono text-foreground">
                  {venue.lng}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center pt-4">
              {isMobile ? (
                <>
                  {isIOS ? (
                    <>
                      <a
                        href={`maps://maps.apple.com/?address=${encodeURIComponent(venue.address)}&adr=${venue.lat},${venue.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                      >
                        <SiApple className="w-5 h-5" />
                        Plans
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-2.5 rounded-md text-sm sm:text-base font-medium text-white transition-colors"
                        style={{ backgroundColor: 'rgba(8, 200, 247)' }}
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
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <SiGooglemaps className="w-5 h-5" />
                        Google Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?ll=${venue.lat},${venue.lng}&navigate=yes`}
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
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
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
  );
}
