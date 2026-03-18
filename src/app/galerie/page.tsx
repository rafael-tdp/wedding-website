import HeroSection from "@/components/ui/HeroSection";
import { GalleryLayout } from "@/components/gallery/GalleryLayout";
import GalleryUploadSection from "@/components/gallery/GalleryUploadSection";
import GalleryViewSection from "@/components/gallery/GalleryViewSection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export const metadata = {
	title: "Galerie Photo - Mariage",
	description:
		"Partagez vos plus beaux souvenirs de notre mariage en uploadant vos photos !",
};

export default async function GalleriePage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);

	return (
		<main className="min-h-screen bg-white animate-page-enter">
			<HeroSection
				title={dict.gallery.title}
				subtitle={dict.gallery.subtitle}
				backgroundImage="/images/hero-bg-5.jpg"
				backgroundPosition="center 65%"
				withBackgroundLetter
			/>

			<GalleryLayout
				upload={<GalleryUploadSection dict={dict} />}
				gallery={<GalleryViewSection dict={dict} />}
				dict={dict}
			/>
		</main>
	);
}
