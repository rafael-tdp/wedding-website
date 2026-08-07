import { Title } from "../ui";
import { PhotoUpload } from "./PhotoUpload";

interface GalleryUploadSectionProps {
	dict: any;
	isLocked: boolean;
}

export default function GalleryUploadSection({
	dict,
	isLocked,
}: GalleryUploadSectionProps) {
	return (
		<div className="space-y-8">
			<div>
				<Title level="h3">{dict.gallery.upload.title}</Title>
				<p className="text-gray-600 text-sm md:text-base mt-2">
					{dict.gallery.upload.subtitle}
				</p>
			</div>

			{isLocked && (
				<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<p className="text-blue-800 text-center">
						{dict.gallery.comingSoon}
					</p>
				</div>
			)}

			{!isLocked && <PhotoUpload texts={dict.gallery.upload} />}
		</div>
	);
}
