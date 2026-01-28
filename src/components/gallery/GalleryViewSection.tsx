import { Suspense } from "react";
import {
	PhotoGallery,
	PhotoGallerySkeleton,
} from "./PhotoGallery";
import { Title } from "../ui";

interface GalleryViewSectionProps {
	dict: any;
}

export default function GalleryViewSection({
	dict,
}: GalleryViewSectionProps) {
	return (
		<div className="space-y-8">
			<div className="text-center">
				<Title level="h3" align="center">
					{dict.gallery.gallery.title}
				</Title>
				<p className="text-gray-600 text-sm md:text-base mt-2">
					{dict.gallery.gallery.subtitle}
				</p>
			</div>
			<Suspense fallback={<PhotoGallerySkeleton />}>
			<PhotoGallery dict={dict} />
			</Suspense>
		</div>
	);
}
