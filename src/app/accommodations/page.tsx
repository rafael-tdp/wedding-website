import HeroSection from "@/components/ui/HeroSection";
import {
	getHebergements,
} from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import AccommodationsByType from "@/components/accommodations/AccommodationsByType";
import AccommodationPracticalTips from "@/components/accommodations/AccommodationPracticalTips";

export const metadata = {
	title: "Hébergements - Notre Mariage",
	description: "Hébergements recommandés près du lieu du mariage",
};

export default async function AccommodationsPage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);
	const hebergements = await getHebergements();

	return (
		<main className="min-h-screen bg-white animate-page-enter">
			<HeroSection
				title={dict.accommodation.title}
				subtitle={dict.accommodation.subtitle}
				backgroundImage="/images/hero-bg-4.jpg"
				withBackgroundLetter
			/>

			<AccommodationsByType hebergements={hebergements} dict={dict} />

			<AccommodationPracticalTips dict={dict} />
		</main>
	);
}

// Lien pour les logements à proximité:
// https://www.google.fr/travel/search?qs=CAE4Bg&ts=CAESCgoCCAMKAggDEAAaTAouEiwyFjB4MDoweGI1YjUyOTBkOGE0OTY3NTk6ElF1aW50YSBEYXMgVHVsaXBhcxIaEhQKBwjqDxACGAsSBwjqDxACGAwYATICCAIqBwoFOgNFVVI&ap=KigKEgnxaZOhHrZEQBF_78Qsc0AhwBISCfnLRiTQwkRAEX_vxCzYFyHAMAC6AQhvdmVydmlldw&ved=0CAAQ5JsGahgKEwiQ5LSMuIuSAxUAAAAAHQAAAAAQiA8