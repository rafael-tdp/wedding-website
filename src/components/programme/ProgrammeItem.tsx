"use client";

import { Programme } from "@/lib/supabase/queries";
import { formatTime } from "@/lib/supabase/queries";
import { GiBigDiamondRing, GiCakeSlice } from "react-icons/gi";
import { MdPhotoCamera } from "react-icons/md";
import { GiWineGlass } from "react-icons/gi";
import { PiForkKnife } from "react-icons/pi";
import { CiMusicNote1 } from "react-icons/ci";



interface ProgrammeItemProps {
	item: Programme;
	index: number;
	isLast?: boolean;
	eventTranslations?: Record<string, string>;
}

/**
 * Composant pour afficher l'icône et son contenu
 */
function EventIcon({ icon }: { icon: string | null }) {
	return <div className="text-8xl text-gray-200">{getIcon(icon)}</div>;
}

/**
 * Mapping des titres d'événements vers les clés de traduction
 */
const TITLE_TO_KEY_MAPPING: Record<string, string> = {
	// Français
	"cérémonie": "ceremony",
	"ceremonie": "ceremony",
	"cocktail de bienvenue": "cocktail",
	"apéritif": "aperitif",
	"dîner": "dinner",
	"dinner": "dinner",
	"toasts": "toasts",
	"gâteau & moments sucrés": "cake",
	"gateau & moments sucres": "cake",
	"danse & célébration": "party",
	"soirée dansante": "party",
	"soiree dansante": "party",
	"photos de famille": "photo",
	"photo de groupe": "photo_group",
	"feu d'artifice": "fireworks",
	"au revoir": "goodbye",
	// Português
	"cerimónia": "ceremony",
	"coquetel de boas-vindas": "cocktail",
	"aperitivo": "aperitif",
	"jantar": "dinner",
	"brindas": "toasts",
	"bolo & momentos doces": "cake",
	"dança & celebração": "party",
	"fotos de família": "photo",
	"foto de grupo": "photo_group",
	"fogo de artifício": "fireworks",
	"despedida": "goodbye",
	"chegada dos convidados": "arrival",
	// English
	"ceremony": "ceremony",
	"cocktail": "cocktail",
	"aperitif": "aperitif",
	"cake": "cake",
	"party": "party",
	"photo": "photo",
	"photo group": "photo_group",
	"fireworks": "fireworks",
	"goodbye": "goodbye",
	"arrival": "arrival",
};

/**
 * Composant pour afficher le contenu (titre, description, heure)
 */
function EventContent({
	item,
	mobile = false,
	eventTranslations = {},
}: {
	item: Programme;
	mobile?: boolean;
	eventTranslations?: Record<string, string>;
}) {
	// Obtenir le titre traduit s'il existe, sinon utiliser le titre de la BD
	const getTranslatedTitle = () => {
		const titleLower = item.title.toLowerCase();
		const key = TITLE_TO_KEY_MAPPING[titleLower] || titleLower.replace(/\s+/g, "_");
		return eventTranslations[key] || item.title;
	};

	return (
		<div className={mobile ? "flex-1 pt-1" : ""}>
			{/* Titre */}
			<h3
				className={`${
					mobile ? "text-xl mb-2" : "text-2xl"
				} font-serif text-foreground font-light`}
			>
				{getTranslatedTitle()}
			</h3>

			{/* Description */}
			{item.description && (
				<p
					className={`text-foreground-muted leading-relaxed ${
						mobile ? "text-sm mb-2" : ""
					}`}
				>
					{item.description}
				</p>
			)}

			{/* Heure */}
			<p
				className={`font-bold text-primary ${
					mobile ? "text-xs mb-2" : "text-sm"
				}`}
			>
				{formatTime(item.event_time)}
				{item.duration_minutes && item.duration_minutes > 0 && (
					<span className="text-foreground-muted ml-2">
						-{" "}
						{calculateEndTime(
							item.event_time,
							item.duration_minutes
						)}
					</span>
				)}
			</p>
		</div>
	);
}

/**
 * Composant pour la timeline au centre
 */
function EventTimeline({ index, isLast }: { index: number; isLast: boolean }) {
	return (
		<div className="flex flex-col items-center col-span-2">
			<div className="relative">
				<div className="bg-white rounded-full flex items-center justify-center w-8 h-8 text-primary shadow-md relative z-10">
					{index + 1}
				</div>
				<div className="absolute top-1/2 left-0 w-[32rem] h-0.5 bg-background-soft/50 transform -translate-x-1/2 z-0" />
			</div>
			<div className="w-1 h-40 bg-primary" />
		</div>
	);
}

export default function ProgrammeItem({
	item,
	index,
	isLast = false,
	eventTranslations = {},
}: ProgrammeItemProps) {
	const isEven = index % 2 === 0;

	return (
		<div className="relative">
			{/* Desktop view - 3 columns */}
			<div className="hidden md:grid grid-cols-12 items-start">
				{/* Colonne 1 - Gauche (icône/numéro pour pairs, contenu pour impairs) */}
				<div className="flex flex-col items-end pr-4 col-span-5 h-full justify-center text-right">
					{isEven ? (
						<EventIcon icon={item.icon} />
					) : (
						<EventContent item={item} eventTranslations={eventTranslations} />
					)}
				</div>

				{/* Colonne 2 - Centre (ligne verticale) */}
				<EventTimeline index={index} isLast={isLast} />

				{/* Colonne 3 - Droite (contenu pour pairs, icône/numéro pour impairs) */}
				<div className="flex flex-col items-start pl-4 col-span-5 h-full justify-center">
					{!isEven ? (
						<EventIcon icon={item.icon} />
					) : (
						<EventContent item={item} eventTranslations={eventTranslations} />
					)}
				</div>
			</div>

			{/* Mobile view */}
			<div className="md:hidden">
				<div className="flex gap-4 items-start mb-8">
					<div className="flex flex-col items-center flex-shrink-0">
						<div className="text-3xl font-serif text-primary/30 font-bold">
							{index + 1}
						</div>
						<div className="text-4xl text-gray-200 mt-2">
							{getIcon(item.icon)}
						</div>
					</div>

					<EventContent item={item} mobile eventTranslations={eventTranslations} />
				</div>
			</div>
		</div>
	);
}

/**
 * Retourne l'icône correspondante avec react-icons
 */
function getIcon(icon: string | null) {
	switch (icon) {
		case "ceremony":
			return <GiBigDiamondRing />;
		case "cocktail":
			return <GiWineGlass />;
		case "dinner":
			return <PiForkKnife />;
		case "party":
			return <CiMusicNote1 />;
		case "photo":
			return <MdPhotoCamera />;
		case "cake":
			return <GiCakeSlice />;
		default:
			return <GiBigDiamondRing />;
	}
}

/**
 * Calcule l'heure de fin basée sur l'heure de début et la durée
 */
function calculateEndTime(startTime: string, durationMinutes: number): string {
	const [hours, minutes] = startTime.split(":").map(Number);
	const totalMinutes = hours * 60 + minutes + durationMinutes;
	const endHours = Math.floor(totalMinutes / 60) % 24;
	const endMinutes = totalMinutes % 60;

	return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
		2,
		"0"
	)}`;
}
