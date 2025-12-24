"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {items.map((item, index) => (
        <Link key={index} href={item.href} className="block group">
          <Card variant="default" className="h-full transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
              {/* Icon in circle */}
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <div className="text-4xl sm:text-5xl">
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
                <span>→</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
