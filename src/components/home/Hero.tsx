"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLayoutEffect, useRef } from "react";

interface HeroProps {
	dict: any;
}

export default function Hero({ dict }: HeroProps) {
	const backgroundRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number>();
	const lastScrollRef = useRef(0);

	useLayoutEffect(() => {
		if (!backgroundRef.current) return;

		const handleScroll = () => {
			lastScrollRef.current = window.scrollY;
			
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				if (backgroundRef.current) {
					const parallaxY = lastScrollRef.current * 0.15;
					backgroundRef.current.style.transform = `translateY(${parallaxY}px) scale(1.08)`;
				}
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return (
		<>
			{/* Hero Section */}
			<div
				className="relative w-full min-h-screen flex flex-col items-center justify-end overflow-hidden"
			>
				<div
					ref={backgroundRef}
					className="absolute inset-0 will-change-transform"
					style={{
						transform: "translateY(0px) scale(1.08)",
						backgroundImage:
							"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url('/images/hero-bg.jpg')",
						backgroundPosition: "center bottom",
						backgroundSize: "cover",
					}}
				/>

				<div className="relative z-10 text-center w-full space-y-6 sm:space-y-8 text-white pb-24 md:pb-32 max-w-3xl animate-slide-up">
					{/* Deskstop title */}
					<h1
						className="hidden sm:block text-6xl sm:text-7xl md:text-8xl font-serif italic font-extralight leading-none"
						style={{ fontFamily: "var(--font-parisienne)" }}
					>
						{dict.home.hero.title}
					</h1>
					{/* Mobile title */}
					<h1
						className="sm:hidden w-full text-7xl font-serif italic font-extralight leading-[0.6]"
						style={{ fontFamily: "var(--font-parisienne)" }}
					>
						{dict.home.hero.title
							.split(" ")
							.map((word: string, index: number) => (
								<span
									key={index}
									className={
										index === 1 ? "text-3xl block" : "block"
									}
								>
									{word}
								</span>
							))}
					</h1>

					{/* Space */}
					<div className="h-48 sm:h-48 2xl:h-64 w-full"></div>

					{/* Details */}
					<div className="space-y-1 text-gray-200">
						<p className="text-sm md:text-base font-serif italic">
							{dict.home.hero.subtitle}
						</p>
						<p className="text-sm md:text-base text-gray-200">
							{dict.home.hero.date}
						</p>
					</div>

					{/* Vertical line */}
					<div className="flex justify-center my-2">
						<div className="h-8 w-[1px] bg-white"></div>
					</div>

					{/* Button */}
					<div className="flex justify-center">
						<Link href="/rsvp" className="w-auto">
							<Button
								variant="primary"
								size="lg"
								className="w-full sm:w-auto text-xxs border-none"
							>
								{dict.home.hero.confirmPresence}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
