"use client";

import Card from "@/components/ui/Card";
import { useEffect, useRef, useState } from "react";

interface PracticalInfoItem {
	icon: React.ReactNode;
	title: string;
	description: string;
	href: string;
}

interface PracticalInfoProps {
	items: PracticalInfoItem[];
	learnMoreText?: string;
}

/**
 * Composant pour afficher les cartes d'informations pratiques
 * Réutilisable sur la page d'accueil et la page infos
 */
export default function PracticalInfo({
	items,
	learnMoreText = "En savoir plus",
}: PracticalInfoProps) {
	const [visibleItems, setVisibleItems] = useState<boolean[]>(
		new Array(items.length).fill(false)
	);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		// Intersection Observer pour détecter quand les cartes entrent dans le viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = itemRefs.current.indexOf(
						entry.target as HTMLDivElement
					);
					if (index !== -1) {
						if (entry.isIntersecting) {
							setVisibleItems((prev) => {
								const newVisible = [...prev];
								newVisible[index] = true;
								return newVisible;
							});
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		itemRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			itemRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 auto-rows-fr">
			{items.map((item, index) => (
				<div
					key={index}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					className={`transition-all duration-700 ${
						visibleItems[index]
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<Card
						variant="default"
						className="h-full rounded-lg p-6"
						icon={item.icon}
						title={item.title}
						description={item.description}
						link={item.href}
						learnMoreText={learnMoreText}
					/>
				</div>
			))}
		</div>
	);
}