"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/ui/HeroSection";
import LocationMap from "@/components/location/LocationMap";
import LocationAccessModes from "@/components/location/LocationAccessModes";
import LocationGPS from "@/components/location/LocationGPS";
import LocationInfo from "@/components/location/LocationInfo";
import LocationActions from "@/components/location/LocationActions";
import { useI18n } from "@/lib/hooks/useI18n";
import { getVenueInfo } from "@/lib/config/wedding-config";

// Récupérer la configuration du lieu depuis wedding-config
const WEDDING_VENUE = getVenueInfo();

export default function LocationPage() {
	const { data, isLoading } = useI18n();
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

	if (isLoading || !data) {
		return null;
	}

	const { dict } = data;

	return (
		<main className="min-h-screen animate-page-enter">
			<HeroSection
				title={dict.venue.title}
				subtitle={dict.venue.subtitle}
				backgroundImage="/images/hero-bg-3.jpg"
				withBackgroundLetter
			/>

			<LocationMap
				address={WEDDING_VENUE.address}
				lat={WEDDING_VENUE.lat}
				lng={WEDDING_VENUE.lng}
			/>

			<LocationAccessModes dict={dict} />

			<LocationGPS
				dict={dict}
				venue={WEDDING_VENUE}
				isMobile={isMobile}
				isIOS={isIOS}
			/>

			<LocationInfo dict={dict} venue={WEDDING_VENUE} />

			<LocationActions dict={dict} />
		</main>
	);
}
