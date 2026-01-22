import HeroSection from "@/components/ui/HeroSection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import Section from "@/components/ui/Section";
import AccommodationPracticalTips from "@/components/accommodations/AccommodationPracticalTips";
import GoogleTravelSearch from "@/components/accommodations/GoogleTravelSearch";
import AccommodationGuide from "@/components/accommodations/AccommodationGuide";

export const metadata = {
	title: "Hébergements - Notre Mariage",
	description: "Trouvez un hébergement à proximité du lieu du mariage",
};

export default async function AccommodationsPage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);
	const googleTravelLink =
		"https://www.google.fr/travel/search?qs=CAE4Bg&ts=CAESCgoCCAMKAggDEAAaTAouEiwyFjB4MDoweGI1YjUyOTBkOGE0OTY3NTk6ElF1aW50YSBEYXMgVHVsaXBhcxIaEhQKBwjqDxACGAsSBwjqDxACGAwYATICCAIqBwoFOgNFVVI&ap=KigKEgnxaZOhHrZEQBF_78Qsc0AhwBISCfnLRiTQwkRAEX_vxCzYFyHAMAC6AQhvdmVydmlldw&ved=0CAAQ5JsGahgKEwiQ5LSMuIuSAxUAAAAAHQAAAAAQiA8";
	const { accommodation } = dict;

	const guideSteps = [
		{
			title: accommodation.guide.step1.title,
			description: accommodation.guide.step1.description,
			tip: accommodation.guide.step1.tip,
		},
		{
			title: accommodation.guide.step2.title,
			description: accommodation.guide.step2.description,
		},
		{
			title: accommodation.guide.step3.title,
			description: accommodation.guide.step3.description,
		},
		{
			title: accommodation.guide.step4.title,
			description: accommodation.guide.step4.description,
		},
		{
			title: accommodation.guide.step5.title,
			description: accommodation.guide.step5.description,
		},
	];

	return (
		<main className="min-h-screen bg-white animate-page-enter">
			<HeroSection
				title={accommodation.title}
				subtitle={accommodation.subtitle}
				backgroundImage="/images/hero-bg-4.jpg"
				withBackgroundLetter
			/>

			{/* Section principale - Recherche Google Travel */}
			<Section variant="default" spacing="lg">
			<div className="max-w-4xl mx-auto">
					<GoogleTravelSearch
						title={accommodation.search.title}
						description={accommodation.search.description}
						buttonLabel={accommodation.search.button}
						googleTravelLink={googleTravelLink}
					/>

					<div className="mt-12 sm:mt-20 mb-8 sm:mb-12">
						<AccommodationGuide
							title={accommodation.guide.title}
							steps={guideSteps}
						/>
					</div>
				</div>
			</Section>

			<AccommodationPracticalTips dict={dict} />
		</main>
	);
}
