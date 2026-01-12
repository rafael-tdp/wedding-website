"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { MdDirectionsCar, MdTrain, MdFlightTakeoff } from "react-icons/md";

interface LieuAccessModesProps {
	dict: any;
}

export default function LieuAccessModes({ dict }: LieuAccessModesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						if (containerRef.current) {
							observer.unobserve(containerRef.current);
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	return (
		<Section variant="soft" spacing="lg">
			<div 
				ref={containerRef}
				className={`max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700 ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-10"
				}`}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
					<div className={`h-full transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}>
						<Card variant="default" className="h-full">
							<div className="h-full flex flex-col justify-center text-center space-y-3 sm:space-y-4">
								<div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<MdDirectionsCar className="w-6 sm:w-8 h-6 sm:h-8 text-primary" />
								</div>
								<h3 className="text-lg sm:text-xl font-serif text-foreground">
									{dict.venue.byCar}
								</h3>
								<p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
									{dict.venue.byCarText}
								</p>
							</div>
						</Card>
					</div>

					{/* <div className={`h-full transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
						<Card variant="default" className="h-full">
							<div className="h-full flex flex-col justify-center text-center space-y-3 sm:space-y-4">
								<div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
									<MdTrain className="w-6 sm:w-8 h-6 sm:h-8 text-secondary" />
								</div>
								<h3 className="text-lg sm:text-xl font-serif text-foreground">
									{dict.venue.byTrain}
								</h3>
								<p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
									{dict.venue.byTrainText}
								</p>
							</div>
						</Card>
					</div> */}

					<div className={`h-full transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}>
						<Card variant="default" className="h-full">
							<div className="h-full flex flex-col justify-center text-center space-y-3 sm:space-y-4">
								<div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
									<MdFlightTakeoff className="w-6 sm:w-8 h-6 sm:h-8 text-accent" />
								</div>
								<h3 className="text-lg sm:text-xl font-serif text-foreground">
									{dict.venue.byPlane}
								</h3>
								<p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
									{dict.venue.byPlaneText}
								</p>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</Section>
	);
}