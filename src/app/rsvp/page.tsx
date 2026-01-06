import Section from "@/components/ui/Section";
import HeroSection from "@/components/ui/HeroSection";
import RSVPForm from "@/components/rsvp/RSVPForm";
import RSVPInfoCards from "@/components/rsvp/RSVPInfoCards";
import RSVPNavigation from "@/components/rsvp/RSVPNavigation";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
	title: "RSVP - Notre Mariage",
	description: "Confirmez votre présence à notre mariage",
};

export default async function RSVPPage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);

	return (
		<main className="min-h-screen animate-page-enter">
			{/* Hero Section */}
			<HeroSection
				title={dict.rsvp.title}
				subtitle={dict.rsvp.subtitle}
				backgroundImage="/images/hero-bg-6.jpg"
				withBackgroundLetter
			/>

			{/* Formulaire */}
			<Section variant="default" spacing="lg">
				<div className="px-4 sm:px-0">
					<RSVPForm
						texts={dict.rsvp.form}
						errors={dict.rsvp.errors}
						success={dict.rsvp.success}
					/>
				</div>
			</Section>

			{/* Informations complémentaires */}
			<Section variant="soft" spacing="md">
				<RSVPInfoCards dict={dict} />

				{/* Navigation */}
				<RSVPNavigation dict={dict} />
			</Section>
		</main>
	);
}
