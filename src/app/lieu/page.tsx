"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/ui/HeroSection";
import LieuMap from "@/components/lieu/LieuMap";
import LieuAccessModes from "@/components/lieu/LieuAccessModes";
import LieuGPS from "@/components/lieu/LieuGPS";
import LieuInfo from "@/components/lieu/LieuInfo";
import LieuActions from "@/components/lieu/LieuActions";
import { useI18n } from "@/lib/hooks/useI18n";
import { getVenueInfo } from "@/lib/config/wedding-config";

// Récupérer la configuration du lieu depuis wedding-config
const WEDDING_VENUE = getVenueInfo();

export default function LieuPage() {
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

			<LieuMap
				address={WEDDING_VENUE.address}
				lat={WEDDING_VENUE.lat}
				lng={WEDDING_VENUE.lng}
			/>

			<LieuAccessModes dict={dict} />

			<LieuGPS
				dict={dict}
				venue={WEDDING_VENUE}
				isMobile={isMobile}
				isIOS={isIOS}
			/>

			<LieuInfo dict={dict} venue={WEDDING_VENUE} />

			<LieuActions dict={dict} />
		</main>
	);
}
