"use client";

import { useState } from "react";

interface Photo {
	id: string;
	public_url: string;
	filename: string;
	caption: string | null;
	alt_text: string | null;
	uploaded_by: string | null;
	created_at: string;
}

interface PhotoGridProps {
	photos: Photo[];
	onPhotoClick?: (index: number) => void;
	renderActions?: (photo: Photo) => React.ReactNode;
}

function PhotoLightbox({
	photo,
	allPhotos,
	currentIndex,
	onClose,
	onNext,
	onPrev,
}: {
	photo: Photo;
	allPhotos: Photo[];
	currentIndex: number;
	onClose: () => void;
	onNext: () => void;
	onPrev: () => void;
}) {
	return (
		<div
			className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Image */}
				<div className="flex-1 flex items-center justify-center overflow-hidden">
					<img
						src={photo.public_url}
						alt={photo.alt_text || "Photo"}
						className="max-w-full max-h-full object-contain"
					/>
				</div>

				{/* Info */}
				<div className="bg-black/80 text-white p-4 text-center">
					<p className="font-medium">{photo.uploaded_by || "Invité"}</p>
					{photo.caption && (
						<p className="text-sm mt-2 opacity-90">{photo.caption}</p>
					)}
					<p className="text-xs mt-2 opacity-75">
						{new Date(photo.created_at).toLocaleDateString("fr-FR", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</p>
					<p className="text-xs mt-3 opacity-60">
						{currentIndex + 1} / {allPhotos.length}
					</p>
				</div>

				{/* Bouton fermer */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
					aria-label="Fermer"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* Boutons navigation */}
				{allPhotos.length > 1 && (
					<>
						<button
							onClick={onPrev}
							className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
							aria-label="Photo précédente"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						<button
							onClick={onNext}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
							aria-label="Photo suivante"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</>
				)}
			</div>
		</div>
	);
}

function PhotoGridItem({
	photo,
	onPhotoClick,
	renderActions,
}: {
	photo: Photo;
	onPhotoClick: () => void;
	renderActions?: (photo: Photo) => React.ReactNode;
}) {
	return (
		<div className="group relative bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3]">
			{/* Image */}
			<button
				onClick={onPhotoClick}
				className="w-full h-full cursor-pointer overflow-hidden bg-gray-100"
			>
				<img
					src={photo.public_url}
					alt={photo.alt_text || "Photo"}
					loading="lazy"
					className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
				/>
			</button>

			{/* Info overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
				<div className="absolute bottom-0 left-0 right-0 p-4 text-white">
					<p className="font-medium text-sm">{photo.uploaded_by || "Invité"}</p>
					{photo.caption && (
						<p className="text-xs mt-1 line-clamp-2 opacity-90">
							{photo.caption}
						</p>
					)}
					<p className="text-xs mt-2 opacity-75">
						{new Date(photo.created_at).toLocaleDateString("fr-FR", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</p>
				</div>
			</div>

			{/* Actions */}
			{renderActions && (
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
					{renderActions(photo)}
				</div>
			)}
		</div>
	);
}

export default function PhotoGrid({
	photos,
	onPhotoClick,
	renderActions,
}: PhotoGridProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	if (photos.length === 0) {
		return (
			<div className="text-center py-16">
				<p className="text-foreground-muted">Aucune photo</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{photos.map((photo, index) => (
					<PhotoGridItem
						key={photo.id}
						photo={photo}
						onPhotoClick={() => {
							setSelectedIndex(index);
							onPhotoClick?.(index);
						}}
						renderActions={renderActions}
					/>
				))}
			</div>

			{selectedIndex !== null && (
				<PhotoLightbox
					photo={photos[selectedIndex]}
					allPhotos={photos}
					currentIndex={selectedIndex}
					onClose={() => setSelectedIndex(null)}
					onNext={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
					onPrev={() =>
						setSelectedIndex(
							(selectedIndex - 1 + photos.length) % photos.length
						)
					}
				/>
			)}
		</>
	);
}
