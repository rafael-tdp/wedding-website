"use client";

import { useState, ReactNode } from "react";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { MdClose } from "react-icons/md";
import { UploadModalProvider } from "./UploadModalContext";
import { isBeforeWeddingGallery } from "@/lib/config/wedding-config";

interface GalleryLayoutProps {
	gallery: ReactNode;
	upload: ReactNode;
	onUploadClick?: () => void;
	dict?: any;
}

export function GalleryLayout({
	gallery,
	upload,
	onUploadClick,
	dict,
}: GalleryLayoutProps) {
	const [showUploadModal, setShowUploadModal] = useState(false);
	const isBeforeWedding = isBeforeWeddingGallery();

	const handleUploadClick = () => {
		setShowUploadModal(true);
		onUploadClick?.();
	};

	return (
		<UploadModalProvider onOpenUploadModal={handleUploadClick}>
			{/* Galerie principale */}
			<div className="w-full bg-white py-8 sm:py-12">
			<div className="relative max-w-8xl mx-auto px-6 md:px-8">
					{/* Contenu galerie */}
					{gallery}
				</div>
			</div>

			{/* Modal pour l'upload */}
			<ModalPortal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
			>
				<div
					className="fixed inset-0 bg-black/50 sm:bg-black/40 sm:flex sm:items-center sm:justify-center z-40"
					onClick={() => setShowUploadModal(false)}
				>
					<div
						className="fixed bottom-0 sm:relative sm:bottom-auto w-full sm:w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
						data-modal-content
						onClick={(e) => e.stopPropagation()}
					>
						<style>{`
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(100%);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              [data-modal-content] {
                animation: slideUp 0.3s ease-out forwards;
              }
              @media (min-width: 640px) {
                [data-modal-content] {
                  animation: fadeIn 0.3s ease-out forwards !important;
                }
              }
            `}</style>

						{/* En-tête modal */}
						<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-0">
							<h2 className="text-xl font-serif text-foreground"></h2>
							<button
								onClick={() => setShowUploadModal(false)}
								className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
							>
								<MdClose />
							</button>
						</div>

						{/* Contenu formulaire */}
						<div className="p-6 sm:p-8 pb-12 sm:pb-8">{upload}</div>
					</div>
				</div>
			</ModalPortal>
		</UploadModalProvider>
	);
}
