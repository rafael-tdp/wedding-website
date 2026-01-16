"use client";

import { Hebergement, translateHebergementType } from "@/lib/supabase/queries";
import { MdLanguage } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { useI18n } from "@/lib/i18n/context";

interface AccommodationCardProps {
	hebergement: Hebergement;
}

export default function AccommodationCard({
	hebergement,
}: AccommodationCardProps) {
	const { locale } = useI18n();

	// Afficher le nom et description en fonction de la langue
	const name =
		locale === "pt" && hebergement.name_pt
			? hebergement.name_pt
			: hebergement.name_fr;
	const description =
		locale === "pt" && hebergement.description_pt
			? hebergement.description_pt
			: hebergement.description_fr;

	// Traductions des labels
	const priceLabel = locale === "pt" ? "A partir de" : "Prix au tour de";
	const distanceLabel = locale === "pt" ? "Distância/Trajeto" : "Distance/Trajet";
	const visitLabel = locale === "pt" ? "Visitar" : "Visiter";

	const imageUrl = hebergement.image_url || "/images/hotel.jpeg";

	return (
		<div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">
			{/* Image Section */}
			<div className="relative h-40 overflow-hidden bg-white p-1">
				<img
					src={imageUrl}
					alt={name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-md"
					onError={(e) => {
						e.currentTarget.src = "/images/hotel.jpeg";
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				{/* Type Badge */}
				<div className="absolute top-2 right-2">
					<span className="text-xxs font-semibold uppercase bg-white px-2 py-1 rounded-full">
						{translateHebergementType(hebergement.type)}
					</span>
				</div>
			</div>

			{/* Content Section */}
			<div className="flex-grow flex flex-col">
				{/* Title */}
				<div className="px-3 py-2 sm:px-4 py-3 flex flex-col">
					<h3 className="text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
						{name}
					</h3>

					{/* Description */}
					{description && (
						<p className="text-xs text-foreground-muted line-clamp-1">
							{description}
						</p>
					)}

					{/* Info Grid */}
					<div className="space-y-1 py-2 border-t border-gray-100 mt-2 flex-row">
						{hebergement.price && (
							<div className="flex items-end gap-1 text-xs">
								<span className="text-foreground-muted">
									{priceLabel}
								</span>
								<span className="text-foreground font-semibold text-sm m-0 p-0 transform translate-y-[1px]">
									{hebergement.price}
								</span>
							</div>
						)}

						{hebergement.length && (
							<div className="flex items-center gap-2 text-xs">
								<FaCar className="w-3.5 h-3.5 text-gray-400" />
								<span className="text-foreground-muted">
									{hebergement.length}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Actions */}
				{hebergement.website && (
					<div className="px-1 pb-1 mt-2">
						<a
							href={hebergement.website}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-1.5 bg-primary text-white py-2 px-3 rounded-md font-medium text-xs hover:bg-primary-dark transition-colors mt-auto"
						>
							<MdLanguage className="w-3.5 h-3.5" />
							{visitLabel}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}
