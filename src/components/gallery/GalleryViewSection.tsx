import { Suspense } from "react";
import {
	PhotoGallery,
	PhotoGallerySkeleton,
} from "./PhotoGallery";
import { Title } from "../ui";

interface GalleryViewSectionProps {
	dict: any;
	isLocked: boolean;
}

export default function GalleryViewSection({
	dict,
	isLocked,
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
			<PhotoGallery dict={dict} isLocked={isLocked} />
			</Suspense>
		</div>
	);
}
