"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/ui/HeroSection";
import LocationMap from "@/components/location/LocationMap";
import LocationPractical from "@/components/location/LocationPractical";
import LocationActions from "@/components/location/LocationActions";
import Section from "@/components/ui/Section";
import { Title } from "@/components/ui";
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

			{/* Lieu et Adresse */}
			<Section variant="default" spacing="none" className="pt-16 sm:pt-20">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
					<Title level="h3" align="center" className="mb-3">
						{WEDDING_VENUE.name}
					</Title>
					<p className="text-foreground-muted text-sm sm:text-base">
						{WEDDING_VENUE.address}
					</p>
				</div>
			</Section>

			<LocationMap
				address={WEDDING_VENUE.address}
				lat={WEDDING_VENUE.lat}
				lng={WEDDING_VENUE.lng}
			/>

			<LocationPractical
				dict={dict}
				venue={WEDDING_VENUE}
				isMobile={isMobile}
				isIOS={isIOS}
			/>

			<LocationActions dict={dict} />
		</main>
	);
}
