"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { useEffect, useRef, useState } from "react";

interface PracticalInfoItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

interface PracticalInfoProps {
  items: PracticalInfoItem[];
}

/**
 * Composant pour afficher les cartes d'informations pratiques
 * Réutilisable sur la page d'accueil et la page infos
 */
export default function PracticalInfo({ items }: PracticalInfoProps) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(items.length).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Intersection Observer pour détecter quand les cartes entrent dans le viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = itemRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`transition-all duration-700 ${
            visibleItems[index]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <Link href={item.href} className="block group">
            <Card variant="default" className="h-full transition-all duration-300 group-hover:shadow-lg">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                {/* Icon in circle */}
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl">
                    {item.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-serif text-primary font-semibold">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-foreground-muted text-xs sm:text-sm leading-relaxed flex-grow">
                  {item.description}
                </p>
                
                {/* Link */}
                <div className="text-primary font-medium text-xs sm:text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  <span>En savoir plus</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
