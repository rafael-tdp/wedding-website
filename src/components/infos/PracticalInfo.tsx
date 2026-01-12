"use client";

import Link from "next/link";
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
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 auto-rows-fr">
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
					<Link href={item.href} className="block group h-full">
						<Card
							variant="default"
							className="h-full transition-all duration-300 group-hover:shadow-lg flex flex-col"
						>
							<div className="flex flex-row md:flex-col items-center justify-center gap-6 md:gap-4 h-full">
								{/* Icon in circle */}
								<div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300 flex-shrink-0">
									{item.icon}
								</div>

								{/* Content container */}
								<div className="flex-grow md:flex-grow-0 space-y-2 md:space-y-3 md:sm:space-y-4 flex flex-col justify-between md:items-center md:text-center">
									{/* Title */}
									<h3 className="text-base md:text-xl font-serif text-primary font-semibold">
										{item.title}
									</h3>

									{/* Description */}
									<p className="text-foreground-muted text-sm md:text-sm leading-relaxed">
										{item.description}
									</p>

									{/* Link */}
									<div className="text-primary font-medium text-xs md:text-sm flex gap-2 group-hover:gap-3 transition-all">
										<span>{learnMoreText}</span>
										<span className="group-hover:translate-x-1 transition-transform">
											→
										</span>
									</div>
								</div>
							</div>
						</Card>
					</Link>
				</div>
			))}
		</div>
	);
}
