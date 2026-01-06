import { Title } from "../ui";
import { PhotoUpload } from "./PhotoUpload";

interface GalleryUploadSectionProps {
	dict: any;
}

export default function GalleryUploadSection({
	dict,
}: GalleryUploadSectionProps) {
	return (
		<div className="space-y-8">
			<div>
				<Title level="h3">
					{dict.gallery.upload.title}
				</Title>
				<p className="text-gray-600 text-sm mt-2">
					{dict.gallery.upload.subtitle}
				</p>
			</div>
			<PhotoUpload texts={dict.gallery.upload} />
		</div>
	);
}
