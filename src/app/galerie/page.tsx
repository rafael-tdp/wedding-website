import { Suspense } from "react";
import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";
import { PhotoUpload } from "@/components/gallery/PhotoUpload";
import { GalleryLayout } from "@/components/gallery/GalleryLayout";
import {
	PhotoGallery,
	PhotoGallerySkeleton,
} from "@/components/gallery/PhotoGallery";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

/**
 * PAGE : GALERIE PHOTO COLLABORATIVE (Multilingue)
 *
 * Permet aux invités de :
 * - Uploader des photos de la journée
 * - Consulter les photos partagées par les autres invités
 */

export const metadata = {
	title: "Galerie Photo - Mariage",
	description:
		"Partagez vos plus beaux souvenirs de notre mariage en uploadant vos photos !",
};

export default async function GalleriePage() {
	const locale = await getLocale();
	const dict = await getDictionary(locale);
	
	return (
		<main className="min-h-screen bg-white">
			{/* Hero Section */}
			<Section variant="gradient" spacing="md" isHero backgroundImage="/images/hero-bg-5.jpg">
				<div className="text-center space-y-4">
					<Title level="h1" align="center" withAccent>
						{dict.gallery.title}
					</Title>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
						{dict.gallery.subtitle}
					</p>
				</div>
			</Section>

			{/* Split Layout: Upload + Gallery */}
			<GalleryLayout
				upload={
					<div className="space-y-8 text-center">
						<div>
							<h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
								{dict.gallery.upload.title}
							</h2>
							<p className="text-gray-600 text-sm">
								{dict.gallery.upload.subtitle}
							</p>
						</div>
						<PhotoUpload texts={dict.gallery.upload} />
					</div>
				}
				gallery={
					<div className="space-y-8">
						<div className="text-center">
							<h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
								{dict.gallery.gallery.title}
							</h2>
							<p className="text-gray-600 text-sm">
								{dict.gallery.gallery.subtitle}
							</p>
						</div>
						<Suspense fallback={<PhotoGallerySkeleton />}>
							<PhotoGallery />
						</Suspense>
					</div>
				}
			/>
		</main>
	);
}
