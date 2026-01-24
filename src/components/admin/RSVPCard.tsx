"use client";

import { useState, useRef, useEffect } from "react";
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import { GoChevronDown } from "react-icons/go";

interface RSVP {
	id: string;
	guest_name: string;
	guest_email: string;
	guest_phone?: string;
	attending: boolean;
	dietary_restrictions?: string;
	allergies?: string;
	special_needs?: string;
	message?: string;
	family_members?: Array<{
		name: string;
		attending: boolean;
		isChild: boolean;
		age?: number;
		dietary_restrictions?: string;
		allergies?: string;
	}>;
	created_at: string;
}

interface RSVPCardProps {
	rsvp: RSVP;
	onEdit: (rsvp: RSVP) => void;
	onDelete: (rsvpId: string) => void;
	isDeleting: boolean;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export default function RSVPCard({
	rsvp,
	onEdit,
	onDelete,
	isDeleting,
}: RSVPCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Vérifier s'il y a des infos supplémentaires à afficher
	const hasDetails =
		rsvp.dietary_restrictions ||
		rsvp.allergies ||
		rsvp.special_needs ||
		rsvp.message ||
		(rsvp.family_members && rsvp.family_members.length > 0);

	// Fermer le menu quand on clique ailleurs
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsMenuOpen(false);
			}
		}

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isMenuOpen]);

	return (
		<div className="bg-white border border-gray-200 rounded-lg transition-all hover:shadow-md">
			{/* En-tête - toujours visible */}
			<div className="flex items-start justify-between gap-3 p-4 sm:p-6">
				{/* Contenu cliquable */}
				<button
					onClick={() => hasDetails && setIsExpanded(!isExpanded)}
					className={`flex-1 text-left min-w-0 ${hasDetails ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
				>
					<div className="flex flex-col gap-3 min-w-0 w-full">
						{/* Ligne 1: Nom + Chevron */}
						<div className="flex items-center gap-2 min-w-0 w-full">
							<p className="text-sm sm:text-lg font-medium text-gray-900 truncate overflow-hidden">
								{rsvp.guest_name}
							</p>
							{hasDetails && (
								<span
									className="text-gray-400 text-lg transition-transform flex-shrink-0"
									style={{
										transform: isExpanded
											? "rotate(180deg)"
											: "rotate(0deg)",
									}}
								>
									<GoChevronDown size={20} />
								</span>
							)}
						</div>

						{/* Ligne 2: Date + Badge */}
						<div className="flex items-center gap-2 flex-wrap">
							<span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
								{formatDate(rsvp.created_at)}
							</span>
							<span
								className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
									rsvp.attending
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								{rsvp.attending ? "✓ Présent" : "✗ Absent"}
							</span>
						</div>
					</div>
				</button>

				{/* Menu d'actions - EN DEHORS du button */}
				<div className="relative flex-shrink-0" ref={menuRef}>
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						title="Actions"
						className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
					>
						<MdMoreVert size={20} />
					</button>

					{/* Menu déroulant */}
					{isMenuOpen && (
						<div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
							<button
								onClick={() => {
									onEdit(rsvp);
									setIsMenuOpen(false);
								}}
								className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-medium"
							>
								<MdEdit size={18} />
								Modifier
							</button>
							<div className="border-t border-gray-100"></div>
							<button
								onClick={() => {
									onDelete(rsvp.id);
									setIsMenuOpen(false);
								}}
								disabled={isDeleting}
								className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors font-medium disabled:opacity-50"
							>
								<MdDelete size={18} />
								{isDeleting ? "Suppression..." : "Supprimer"}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Détails - dépliable */}
			{isExpanded && hasDetails && (
				<div className="border-t border-gray-200 p-3 sm:p-4 md:p-6 bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
					{/* Contact - visible en expansion */}
					<div className="space-y-2 text-xs sm:text-sm">
						{rsvp.guest_email && (
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700">
								<span className="font-medium text-gray-900 whitespace-nowrap">
									Email:
								</span>
								<span className="break-all text-xs sm:text-sm">
									{rsvp.guest_email}
								</span>
							</div>
						)}
						{rsvp.guest_phone && (
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-700">
								<span className="font-medium text-gray-900 whitespace-nowrap">
									Téléphone:
								</span>
								<span className="text-xs sm:text-sm">
									{rsvp.guest_phone}
								</span>
							</div>
						)}
					</div>
					{/* Infos pratiques */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
						{rsvp.dietary_restrictions && (
							<div className="bg-yellow-50 p-2 sm:p-3 rounded border-l-4 border-yellow-200">
								<span className="font-medium text-gray-900 text-xs sm:text-sm block">
									Régime alimentaire
								</span>
								<p className="text-gray-700 mt-1 text-xs sm:text-sm">
									{rsvp.dietary_restrictions}
								</p>
							</div>
						)}
						{rsvp.allergies && (
							<div className="bg-red-50 p-2 sm:p-3 rounded border-l-4 border-red-200">
								<span className="font-medium text-gray-900 text-xs sm:text-sm block">
									Allergies
								</span>
								<p className="text-gray-700 mt-1 text-xs sm:text-sm">
									{rsvp.allergies}
								</p>
							</div>
						)}
						{rsvp.special_needs && (
							<div className="bg-blue-50 p-2 sm:p-3 rounded border-l-4 border-blue-200">
								<span className="font-medium text-gray-900 text-xs sm:text-sm block">
									Besoins spéciaux
								</span>
								<p className="text-gray-700 mt-1 text-xs sm:text-sm">
									{rsvp.special_needs}
								</p>
							</div>
						)}
						{rsvp.message && (
							<div className="bg-gray-100 p-2 sm:p-3 rounded border-l-4 border-gray-300 sm:col-span-2">
								<span className="font-medium text-gray-900 text-xs sm:text-sm block">
									Message
								</span>
								<p className="text-gray-700 mt-1 text-xs sm:text-sm line-clamp-3">
									{rsvp.message}
								</p>
							</div>
						)}
					</div>

					{/* Groupe/Famille */}
					{rsvp.family_members && rsvp.family_members.length > 0 && (
						<div className="border-t pt-3 sm:pt-4">
							<h4 className="font-medium text-gray-900 mb-3 font-sans text-xs sm:text-sm">
								Personnes du groupe (
								{rsvp.family_members.length})
							</h4>
							<div className="space-y-2 sm:space-y-3">
								{rsvp.family_members.map((member, idx) => (
									<div
										key={idx}
										className="bg-gray-50 p-2 sm:p-3 rounded border-l-4 border-primary text-xs sm:text-sm"
									>
										<div className="flex items-start justify-between mb-2">
											<div>
												<span className="font-medium text-gray-900">
													{member.name}
												</span>
												<span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-200">
													{member.isChild
														? `Enfant (${member.age} ans)`
														: "Adulte"}
												</span>
											</div>
											<span
												className={`text-xs font-semibold px-3 py-1 rounded-full ${
													member.attending
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{member.attending
													? "Oui"
													: "Non"}
											</span>
										</div>
										{member.dietary_restrictions && (
											<p className="text-xs text-gray-600">
												<span className="font-medium">
													Régime:
												</span>{" "}
												{member.dietary_restrictions}
											</p>
										)}
										{member.allergies && (
											<p className="text-xs text-gray-600">
												<span className="font-medium">
													Allergies:
												</span>{" "}
												{member.allergies}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
