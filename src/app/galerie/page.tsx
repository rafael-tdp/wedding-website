import HeroSection from "@/components/ui/HeroSection";
import { GalleryLayout } from "@/components/gallery/GalleryLayout";
import GalleryUploadSection from "@/components/gallery/GalleryUploadSection";
import GalleryViewSection from "@/components/gallery/GalleryViewSection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { isGalleryLockedForGuests } from "@/lib/supabase/queries";

export const metadata = {
	title: "Galerie Photo - Mariage",
	description:
		"Partagez vos plus beaux souvenirs de notre mariage en uploadant vos photos !",
};

export default async function GalleriePage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);
	const isLocked = await isGalleryLockedForGuests();

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
				upload={<GalleryUploadSection dict={dict} isLocked={isLocked} />}
				gallery={<GalleryViewSection dict={dict} isLocked={isLocked} />}
				dict={dict}
			/>
		</main>
	);
}
