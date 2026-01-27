"use client";

import { Programme } from "@/lib/supabase/queries";
import { formatTime } from "@/lib/supabase/queries";
import { GiBigDiamondRing, GiCakeSlice } from "react-icons/gi";
import { MdPhotoCamera } from "react-icons/md";
import { GiWineGlass } from "react-icons/gi";
import { PiForkKnife } from "react-icons/pi";
import { CiMusicNote1 } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";



interface ProgrammeItemProps {
	item: Programme;
	index: number;
	isLast?: boolean;
	isFirst?: boolean;
	eventTranslations?: Record<string, string>;
}

/**
 * Composant pour afficher l'icône et son contenu
 */
function EventIcon({ icon }: { icon: string | null }) {
	return <div className="text-8xl text-secondary-light">{getIcon(icon)}</div>;
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
function EventTimeline({ index }: { index: number }) {
	return (
		<div className="flex flex-col items-center col-span-2">
			<div className="relative">
				<div className="bg-white rounded-full flex items-center justify-center w-8 h-8 text-primary shadow-md relative z-10">
					{index + 1}
				</div>
				<div className="absolute top-1/2 left-0 w-[32rem] h-0.5 bg-background-soft/50 transform -translate-x-1/2 z-0" />
			</div>
			<div className="w-[2px] h-40 bg-primary" />
		</div>
	);
}

export default function ScheduleItem({
	item,
	index,
	isLast = false,
	isFirst = false,
	eventTranslations = {},
}: ProgrammeItemProps) {
	const isEven = index % 2 === 0;
	const itemRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Intersection Observer pour détecter quand l'item entre dans le viewport
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						// Optionnel: arrêter d'observer après la première apparition
						if (itemRef.current) {
							observer.unobserve(itemRef.current);
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (itemRef.current) {
			observer.observe(itemRef.current);
		}

		return () => {
			if (itemRef.current) {
				observer.unobserve(itemRef.current);
			}
		};
	}, []);

	return (
		<div 
			ref={itemRef}
			className="relative"
		>
			{/* Desktop view - 3 columns */}
			<div className="hidden md:grid grid-cols-12 items-start">
				{/* Colonne 1 - Gauche (icône/numéro pour pairs, contenu pour impairs) */}
				<motion.div 
					className="flex flex-col items-end pr-4 col-span-5 h-full justify-center text-right"
					initial={{ opacity: 0, x: -20 }}
					animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
					transition={{ duration: 0.7, delay: 0.2 }}
				>
					{isEven ? (
						<EventIcon icon={item.icon} />
					) : (
						<EventContent item={item} eventTranslations={eventTranslations} />
					)}
				</motion.div>

				{/* Colonne 2 - Centre (ligne verticale) */}
				<EventTimeline index={index} />

				{/* Colonne 3 - Droite (contenu pour pairs, icône/numéro pour impairs) */}
				<motion.div 
					className="flex flex-col items-start pl-4 col-span-5 h-full justify-center"
					initial={{ opacity: 0, x: 20 }}
					animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
					transition={{ duration: 0.7, delay: 0.2 }}
				>
					{!isEven ? (
						<EventIcon icon={item.icon} />
					) : (
						<EventContent item={item} eventTranslations={eventTranslations} />
					)}
				</motion.div>
			</div>

			{/* Mobile view - Timeline vertical */}
			<div className="md:hidden relative">
				{/* Icône de fond */}
				<motion.div 
					className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none"
					initial={{ x: 100, opacity: 0 }}
					animate={isVisible ? { opacity: 0.1, x: 0 } : { opacity: 0, x: 100 }}
					transition={{ duration: 0.7, delay: 0.3 }}
				>
					<motion.div 
						className="text-[120px] text-secondary-dark"
						initial={{ x: 64 }}
						animate={isVisible ? { x: 0 } : { x: 64 }}
						transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
					>
						{getIcon(item.icon)}
					</motion.div>
				</motion.div>

				{/* Contenu */}
				<div className={`flex gap-3 items-center mb-0 pb-0 relative z-10 min-h-48 ${!isLast ? "border-b border-background-soft/30" : ""}`}>
					{/* Timeline center - gauche sur mobile */}
					<div className="relative flex flex-col items-center flex-shrink-0 h-full justify-center">
						<motion.div
							initial={{ x: -64 }}
							animate={isVisible ? { x: 0 } : { x: -64}}
							transition={{ duration: 0.5, delay: 0.1 }}
						>
							<div className="bg-white rounded-full flex items-center justify-center w-8 h-8 text-primary shadow-md relative z-10 text-sm font-semibold">
								{index + 1}
							</div>
						</motion.div>
						{isFirst && <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-48 bg-gradient-to-b from-transparent to-primary/50" />}
						{!isLast && !isFirst && <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-48 bg-primary/50" />}
						{isLast &&  <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-48 bg-gradient-to-b from-primary/50 to-transparent" />}
					</div>

					{/* Content - droite sur mobile */}
					<motion.div
						className="flex-1 pt-0 pb-0"
						initial={{ opacity: 0, x: 16 }}
						animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
						transition={{ duration: 0.7, delay: 0.2 }}
					>
						<EventContent item={item} mobile eventTranslations={eventTranslations} />
					</motion.div>
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
