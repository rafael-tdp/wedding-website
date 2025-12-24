import { Hebergement, translateHebergementType } from "@/lib/supabase/queries";
import { MdLocationOn, MdPhone, MdLanguage, MdMailOutline } from "react-icons/md";

interface HebergementCardProps {
  hebergement: Hebergement;
}

export default function HebergementCard({ hebergement }: HebergementCardProps) {
  // Déterminer l'image à afficher
  const imageUrl = hebergement.image_url || "/images/hotel.jpeg";

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 h-full flex flex-col">
      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={hebergement.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hebergement.is_recommended && (
            <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded text-xs font-semibold">
              Recommandé
            </div>
          )}
        </div>
      )}

      {/* Placeholder si pas d'image */}
      {!imageUrl && (
        <div className="relative h-40 sm:h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200">
          {hebergement.is_recommended && (
            <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded text-xs font-semibold">
              Recommandé
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 sm:p-5 space-y-3 flex-grow flex flex-col">
        {/* Type & Distance */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            {translateHebergementType(hebergement.type)}
          </p>
          {hebergement.distance_km && (
            <span className="text-xs font-medium text-foreground-muted">
              {hebergement.distance_km} km
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base sm:text-lg font-serif text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {hebergement.name}
          </h3>
        </div>

        {/* Description */}
        {hebergement.description && (
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
            {hebergement.description}
          </p>
        )}

        {/* Address */}
        {hebergement.address && (
          <div className="flex items-start gap-2 text-sm pt-1">
            <MdLocationOn className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-foreground-muted text-xs sm:text-sm">
              <p className="font-medium text-foreground">{hebergement.address}</p>
              <p>
                {hebergement.city}
                {hebergement.postal_code && ` ${hebergement.postal_code}`}
              </p>
            </div>
          </div>
        )}

        {/* Price Section */}
        {hebergement.price_range && (
          <div className="flex items-center gap-2 py-2 border-t border-gray-100 mt-auto pt-3">
            <span className="text-sm sm:text-base font-semibold text-foreground">
              {hebergement.price_range}
            </span>
            {hebergement.price_note && (
              <span className="text-xs text-foreground-muted">
                • {hebergement.price_note}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {hebergement.website && (
            <a
              href={hebergement.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-2 px-4 rounded font-medium text-sm hover:bg-primary-dark transition-colors"
            >
              <MdLanguage className="w-4 h-4" />
              Visiter
            </a>
          )}

          <div className="flex gap-2">
            {hebergement.phone && (
              <a
                href={`tel:${hebergement.phone}`}
                className="flex-1 flex items-center justify-center gap-1 text-primary border border-primary py-1.5 px-2 rounded font-medium text-xs sm:text-sm hover:bg-primary/5 transition-colors"
                title="Appeler"
              >
                <MdPhone className="w-4 h-4" />
                <span className="hidden sm:inline">Appeler</span>
              </a>
            )}
            {hebergement.email && (
              <a
                href={`mailto:${hebergement.email}`}
                className="flex-1 flex items-center justify-center gap-1 text-accent border border-accent py-1.5 px-2 rounded font-medium text-xs sm:text-sm hover:bg-accent/5 transition-colors"
                title="Email"
              >
                <MdMailOutline className="w-4 h-4" />
                <span className="hidden sm:inline">Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
