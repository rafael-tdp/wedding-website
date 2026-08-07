"use client";

import PhotoGrid from "../gallery/PhotoGrid";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface Photo {
	id: string;
	storage_path: string;
	public_url: string;
	thumbnail_url: string | null;
	filename: string;
	file_size: number | null;
	mime_type: string | null;
	width: number | null;
	height: number | null;
	caption: string | null;
	alt_text: string | null;
	uploaded_by: string | null;
	uploader_email: string | null;
	is_approved: boolean;
	is_visible: boolean;
	created_at: string;
	updated_at: string;
}

interface PhotoSectionProps {
	photos: Photo[];
	onToggleVisibility: (photoId: string) => void;
	onDelete: (photoId: string) => void;
	hidingId: string | null;
	deletingPhotoId: string | null;
}

export default function PhotoSection({
	photos,
	onToggleVisibility,
	onDelete,
	hidingId,
	deletingPhotoId,
}: PhotoSectionProps) {
	const renderActions = (photo: Photo) => (
		<div className="flex flex-col gap-2 bg-black/70 rounded-lg p-2">
			<button
				onClick={() => onToggleVisibility(photo.id)}
				disabled={hidingId === photo.id}
				className="text-white hover:text-gray-200 transition-colors disabled:opacity-50 p-1 hover:bg-black/50 rounded"
				title={photo.is_visible ? "Désactiver la photo" : "Activer la photo"}
			>
				{hidingId === photo.id ? (
					<span className="text-xs">...</span>
				) : photo.is_visible ? (
					<IoEyeOutline className="w-4 h-4" />
				) : (
					<IoEyeOffOutline className="w-4 h-4" />
				)}
			</button>
			<div className="bg-black/50 h-px" />
			<button
				onClick={() => onDelete(photo.id)}
				disabled={deletingPhotoId === photo.id}
				className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 p-1 hover:bg-black/50 rounded text-xs"
				title="Supprimer la photo"
			>
				{deletingPhotoId === photo.id ? "..." : "×"}
			</button>
		</div>
	);

	// Convert admin Photo type to PhotoGrid Photo type
	const gridPhotos = photos.map((p) => ({
		id: p.id,
		public_url: p.public_url,
		thumbnail_url: p.thumbnail_url,
		filename: p.filename,
		caption: p.caption,
		alt_text: p.alt_text,
		uploaded_by: p.uploaded_by,
		created_at: p.created_at,
	}));

	return (
		<PhotoGrid photos={gridPhotos} renderActions={(gridPhoto) => {
			const fullPhoto = photos.find(p => p.id === gridPhoto.id);
			return fullPhoto ? renderActions(fullPhoto) : null;
		}} />
	);
}
