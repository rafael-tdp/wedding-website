"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { Title } from "@/components/ui";
import { MdPhone, MdEmail, MdLanguage } from "react-icons/md";

interface LieuInfoProps {
  dict: any;
  venue: {
    phone: string;
    email: string;
    website: string;
  };
}

export default function LieuInfo({ dict, venue }: LieuInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <Section variant="default" spacing="lg">
      <div 
        ref={containerRef}
        className={`max-w-3xl mx-auto px-4 sm:px-6 space-y-8 transition-all duration-700 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}>
          <Title level="h2" align="center" withAccent>
            {dict.venue.practical}
          </Title>
        </div>

        <div className="space-y-6">
          {/* Contact */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
            <Card variant="soft">
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-4">
                {dict.venue.contact}
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-foreground-muted">
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
            </Card>
          </div>

          {/* Accessibility */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}>
            <Card variant="soft">
              <h3 className="text-lg sm:text-xl font-serif text-foreground mb-4">
                {dict.venue.accessibility}
              </h3>
              <p className="text-sm sm:text-base text-foreground-muted">
                {dict.venue.accessibilityText}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
