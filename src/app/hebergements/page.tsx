import Section from "@/components/ui/Section";
import HeroSection from "@/components/ui/HeroSection";
import {
	getHebergements,
	getRecommendedHebergements,
	Hebergement,
} from "@/lib/supabase/queries";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import HebergementRecommended from "@/components/hebergements/HebergementRecommended";
import HebergementsByType from "@/components/hebergements/HebergementsByType";
import HebergementPracticalTips from "@/components/hebergements/HebergementPracticalTips";

export const metadata = {
	title: "Hébergements - Notre Mariage",
	description: "Hébergements recommandés près du lieu du mariage",
};

export default async function HebergementsPage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);
	const hebergements = await getHebergements();
	const recommended = await getRecommendedHebergements();

	return (
		<main className="min-h-screen bg-white animate-page-enter">
			<HeroSection
				title={dict.accommodation.title}
				subtitle={dict.accommodation.subtitle}
				backgroundImage="/images/hero-bg-4.jpg"
				withBackgroundLetter
			/>

			{recommended.length > 0 && (
				<HebergementRecommended
					hebergements={recommended}
					dict={dict}
				/>
			)}

			<HebergementsByType hebergements={hebergements} dict={dict} />

			<HebergementPracticalTips dict={dict} />
		</main>
	);
}
