"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

/**
 * COMPOSANT : NAVBAR
 *
 * Navigation principale du site avec :
 * - Logo / Titre
 * - Menu desktop avec LanguageSwitcher
 * - Menu mobile (hamburger)
 * - Indicateur de page active
 * - Effet transparent au départ, opaque au scroll
 * - Bouton Admin si l'utilisateur est connecté
 */

const DEFAULT_NAV_LINKS = [
	{ href: "/", label: "Accueil" },
	{ href: "/schedule", label: "Programme" },
	{ href: "/location", label: "Lieu & Accès" },
	{ href: "/accommodations", label: "Hébergements" },
	{ href: "/galerie", label: "Galerie" },
	{ href: "/rsvp", label: "RSVP" },
	{ href: "/faq", label: "FAQ" },
];

function NavbarContent({ isAdmin = false }: { isAdmin?: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const pathname = usePathname();
	const { dict } = useI18n();

	// Détecter la fermeture du menu et appliquer transition-none temporairement
	useEffect(() => {
		if (isOpen) {
			setIsClosing(false);
		} else if (!isOpen && isClosing) {
			// Menu vient de se fermer, garder transition-none pour cette fermeture
			// et attendre la fin de l'animation avant de restaurer les transitions
			const timer = setTimeout(() => setIsClosing(false), 300); // 300ms = durée de l'animation du menu
			return () => clearTimeout(timer);
		}
	}, [isOpen, isClosing]);

	// Détecter le scroll
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ href: "/", label: dict?.navbar?.home || "Accueil" },
		{ href: "/schedule", label: dict?.navbar?.programme || "Programme" },
		{ href: "/location", label: dict?.navbar?.venue || "Lieu & Accès" },
		{
			href: "/accommodations",
			label: dict?.navbar?.accommodation || "Hébergements",
		},
		{ href: "/galerie", label: dict?.navbar?.gallery || "Galerie" },
		{ href: "/rsvp", label: dict?.navbar?.rsvp || "RSVP" },
		{ href: "/faq", label: dict?.navbar?.faq || "FAQ" },
	];

	const isActive = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	// Transparence du navbar uniquement sur la page d'accueil lors du scroll
	const isHomepage = pathname === "/";
	const shouldBeTransparent =
		isHomepage && !isScrolled && !isOpen && !isClosing;

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-40 ${
				isOpen || isClosing
					? "transition-none"
					: "transition-colors duration-300"
			} ${
				isOpen
					? "bg-white shadow-md border-b border-gray-200"
					: shouldBeTransparent
					? "bg-transparent"
					: "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo / Titre */}
					<Link
						href="/"
						className={`flex items-center space-x-2 text-2xl transition-colors ${
							shouldBeTransparent
								? "text-white hover:text-gray-100"
								: "text-primary hover:text-primary/80"
						}`}
						style={{ fontFamily: "var(--font-parisienne)" }}
					>
						<span className="hidden sm:inline">Ana & Rafael</span>
						{!shouldBeTransparent && (
							<span className="sm:hidden">
								A<span className="text-sm">&</span>R
							</span>
						)}
					</Link>

					{/* Menu Desktop */}
					<div className="hidden md:flex items-center space-x-1">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
						isActive(link.href)
							? "bg-primary/80 text-white"
							: shouldBeTransparent
							? "text-white hover:bg-white/20 hover:text-white"
							: "text-gray-700 hover:bg-gray-100 hover:text-primary"
					}
                `}
							>
								{link.label}
							</Link>
						))}

						{/* Séparateur */}
						<div
							className={`w-px h-6 mx-2 ${
								shouldBeTransparent
									? "bg-white/30"
									: "bg-gray-300"
							}`}
						/>

						{/* Admin Button */}
						{isAdmin && (
							<>
							<Link
								href={"/admin"}
								className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
						isActive("/admin")
							? "bg-primary/80 text-white"
							: shouldBeTransparent
							? "text-white hover:bg-white/20 hover:text-white"
							: "text-gray-700 hover:bg-gray-100 hover:text-primary"
					}
                `}
							>
								Admin
							</Link>
							{/* Séparateur */}
						<div
							className={`w-px h-6 mx-2 ${
								shouldBeTransparent
									? "bg-white/30"
									: "bg-gray-300"
							}`}
						/>
							</>
						)}

						{/* Language Switcher */}
						<LanguageSwitcher isScrolled={!shouldBeTransparent} />
					</div>

					{/* Bouton Mobile */}
					<button
						onClick={() => {
							if (isOpen) {
								setIsClosing(true);
							}
							setIsOpen(!isOpen);
						}}
						className={`md:hidden p-2 rounded-full transition-colors ${
							shouldBeTransparent
								? "hover:bg-white/20"
								: "hover:bg-gray-100"
						}`}
						aria-label="Toggle menu"
					>
						{isOpen ? (
							<svg
								className={`w-6 h-6 ${
									shouldBeTransparent
										? "text-white"
										: "text-primary"
								}`}
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
						) : (
							<svg
								className={`w-6 h-6 ${
									shouldBeTransparent
										? "text-white"
										: "text-primary"
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Menu Mobile */}
			<div
				className={`md:hidden overflow-hidden bg-white transition-all duration-300 ease-in-out ${
					isOpen ? "h-[calc(100vh-64px)]" : "h-0"
				}`}
			>
				<div className="px-4 py-2">
					<div className="space-y-1 mb-4">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className="block px-4 py-3 text-xl font-normal transition-all text-gray-700 tracking-widest"
							>
								{link.label}
							</Link>
						))}
					</div>

					{/* Admin Link Mobile */}
					{isAdmin && (
						<>
							<div className="border-t border-gray-200 py-2 mt-2">
								<Link
									href="/admin"
									onClick={() => setIsOpen(false)}
									className="block px-4 py-3 text-xl font-normal transition-all text-primary tracking-widest hover:bg-primary/10 rounded"
								>
									Admin
								</Link>
							</div>
						</>
					)}

					{/* Language Switcher Mobile */}
					<div className="border-t border-gray-200 pt-2 mt-2">
						<LanguageSwitcher mobile={true} />
					</div>
				</div>
			</div>
		</nav>
	);
}

/**
 * Export Navbar avec gestion d'erreur du contexte
 */
export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
	try {
		return <NavbarContent isAdmin={isAdmin} />;
	} catch (e) {
		// Si le contexte I18n n'est pas disponible, afficher un navbar simple
		return (
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link
							href="/"
							className="flex items-center space-x-2 text-xl font-serif font-bold text-primary hover:text-primary/80 transition-colors"
						>
							<span>Ana & Rafael</span>
						</Link>
						<div className="hidden md:flex items-center space-x-1">
							{DEFAULT_NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-all"
								>
									{link.label}
								</Link>
							))}
							<div className="w-px h-6 bg-gray-300 mx-2" />
							<LanguageSwitcher />
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
