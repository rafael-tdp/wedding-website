"use client";

/**
 * COMPOSANT : GOOGLE MAP
 * 
 * Client Component pour afficher une carte Google Maps
 * avec un marqueur pour le lieu du mariage.
 * 
 * Nécessite une clé API Google Maps (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
 * 
 * Alternative gratuite : Utiliser OpenStreetMap / Leaflet
 */

interface MapProps {
  address: string;
  lat: number;
  lng: number;
  zoom?: number;
}

export default function Map({ address, lat, lng, zoom = 15 }: MapProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  }&q=${encodeURIComponent(address)}&zoom=${zoom}`;

  // Si pas de clé API, afficher un lien vers Google Maps
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    return (
      <div className="w-full h-[400px] bg-background-soft rounded-lg flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <svg
            className="w-16 h-16 mx-auto text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-foreground-muted mb-4">
            Carte non disponible. Cliquez ci-dessous pour ouvrir dans Google
            Maps.
          </p>
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-md font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Affichage de la carte Google Maps
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-elegant">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Carte de ${address}`}
      />
    </div>
  );
}
