"use client";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface Photo {
	id: string;
	public_url: string;
	filename: string;
	caption: string | null;
	alt_text: string | null;
	uploaded_by: string | null;
	is_visible: boolean;
	created_at: string;
}

interface PhotoCardProps {
	photo: Photo;
	onToggleVisibility: (photoId: string) => void;
	onDelete: (photoId: string) => void;
	isHiding: boolean;
	isDeleting: boolean;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export default function PhotoCard({
	photo,
	onToggleVisibility,
	onDelete,
	isHiding,
	isDeleting,
}: PhotoCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Image */}
			<div className="relative w-full h-32 sm:h-48 bg-gray-200">
				<img
					src={photo.public_url}
					alt={photo.alt_text || "Photo"}
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Info */}
			<div className="p-2.5 sm:p-3 md:p-4">
				<p className="text-xs sm:text-sm font-semibold text-foreground truncate">
					{photo.uploaded_by ||
						"Utilisateur"}
				</p>
				{photo.caption && (
					<p className="text-xs text-foreground-muted mt-1 truncate">
						{photo.caption}
					</p>
				)}
				<p className="text-xs text-gray-400 mt-1">
					{formatDate(photo.created_at)}
				</p>

				{/* Actions */}
				<div className="flex flex-col gap-1.5 sm:gap-0 sm:flex-row sm:items-center mt-2.5 sm:mt-3 md:mt-4 text-xs">
					<button
						onClick={() => onToggleVisibility(photo.id)}
						disabled={isHiding}
						className="text-foreground-muted hover:text-gray-900 underline transition-colors disabled:opacity-50 flex items-center gap-1.5 w-full sm:w-auto py-1.5 sm:py-0"
						title={photo.is_visible ? "Désactiver la photo" : "Activer la photo"}
					>
						{isHiding
							? "..."
							: photo.is_visible ? (
								<>
								<IoEyeOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
								<span>Désactiver</span>
								</>
							) : (
								<>
								<IoEyeOffOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
								<span>Activer</span>
								</>
							)}
					</button>
					<span className="hidden sm:block text-gray-300">│</span>
					<button
						onClick={() => onDelete(photo.id)}
						disabled={isDeleting}
						className="text-foreground-muted hover:text-red-600 underline transition-colors disabled:opacity-50 w-full sm:w-auto text-left sm:text-inherit py-1.5 sm:py-0"
						title="Supprimer la photo"
					>
						{isDeleting
							? "..."
							: "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);
}
