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
			{ threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
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
		<div className="relative flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-4 md:gap-6 auto-rows-fr">
			{items.map((item, index) => (
				<div
					key={index}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					style={{
						transitionDelay: `${index * 80}ms`,
						transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
						zIndex: index + 1,
						top: `${100 + index * 16}px`,
						marginTop: index === 0 ? "0px" : "-12px",
					}}
					className={`sticky sm:static transform-gpu transition-all duration-700 will-change-transform ${
						visibleItems[index]
							? "opacity-100 translate-y-0 blur-0 scale-100"
							: "opacity-0 translate-y-4 blur-[2px] scale-[0.98]"
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