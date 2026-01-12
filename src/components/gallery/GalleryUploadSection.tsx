import { Title } from "../ui";
import { PhotoUpload } from "./PhotoUpload";
import { weddingConfig } from "@/lib/config/wedding-config";

interface GalleryUploadSectionProps {
	dict: any;
}

export default function GalleryUploadSection({
	dict,
}: GalleryUploadSectionProps) {
	// Vérifier si le mariage a eu lieu
	const weddingDate = new Date(weddingConfig.wedding.date);
	const now = new Date();
	const isWeddingPassed = now >= weddingDate;

	return (
		<div className="space-y-8">
			<div>
				<Title level="h3">{dict.gallery.upload.title}</Title>
				<p className="text-gray-600 text-sm mt-2">
					{dict.gallery.upload.subtitle}
				</p>
			</div>

			{!isWeddingPassed && (
				<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="text-blue-800 text-center">
						{dict.gallery.comingSoon}
					</p>
				</div>
			)}

			{isWeddingPassed && <PhotoUpload texts={dict.gallery.upload} />}
		</div>
	);
}
