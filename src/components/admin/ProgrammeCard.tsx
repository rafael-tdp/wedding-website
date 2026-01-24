"use client";

import { useState, useRef, useEffect } from "react";
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import { GoChevronDown } from "react-icons/go";

interface ProgrammeEvent {
	id: string;
	title: string;
	description: string;
	event_time: string;
	duration_minutes?: number;
	location: string;
	address?: string;
	icon?: string;
	display_order: number;
	is_visible: boolean;
	title_fr: string;
	description_fr: string;
	title_pt: string;
	description_pt: string;
}

interface ProgrammeCardProps {
	event: ProgrammeEvent;
	onEdit: (event: ProgrammeEvent) => void;
	onDelete: (eventId: string) => void;
}

export default function ProgrammeCard({
	event,
	onEdit,
	onDelete,
}: ProgrammeCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(eventTarget: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(eventTarget.target as Node)) {
				setIsMenuOpen(false);
			}
		}

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isMenuOpen]);

	return (
		<div className="bg-white border border-gray-200 rounded-lg transition-all hover:shadow-md">
			{/* En-tête - toujours visible */}
			<div className="flex items-start justify-between gap-3 p-4 sm:p-6">
				{/* Contenu cliquable */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex-1 text-left hover:opacity-80 transition-opacity cursor-pointer"
				>
				<div className="flex flex-col gap-3 min-w-0">
					{/* Ligne 1: Titre + Chevron */}
					<div className="flex items-center gap-2 min-w-0">
						<p className="text-sm sm:text-lg font-medium text-gray-900 truncate max-w-xs sm:max-w-sm">
								{event.title_fr}
							</p>
							<span
								className="text-gray-400 text-lg transition-transform flex-shrink-0"
								style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
							>
								<GoChevronDown size={20} />
							</span>
						</div>
						
						{/* Ligne 2: Infos event */}
						<div className="flex items-center gap-1 sm:gap-3 min-w-0 text-xs sm:text-sm text-gray-600">
							<span className="font-medium whitespace-nowrap">{event.event_time}</span>
							{event.duration_minutes && (
								<>
									<span className="text-gray-300">•</span>
									<span className="whitespace-nowrap">{event.duration_minutes}min</span>
								</>
							)}
							{event.location && (
								<>
									<span className="text-gray-300">•</span>
									<span className="truncate max-w-xs sm:max-w-xs">{event.location}</span>
								</>
							)}
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
									onEdit(event);
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
									onDelete(event.id);
									setIsMenuOpen(false);
								}}
								className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors font-medium"
							>
								<MdDelete size={18} />
								Supprimer
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Détails - dépliable */}
			{isExpanded && (
				<div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
					{/* Description FR */}
					{event.description_fr && (
						<div>
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
								Description
							</p>
							<p className="text-sm text-gray-700 leading-relaxed">
								{event.description_fr}
							</p>
						</div>
					)}

					{/* Adresse */}
					{event.address && (
						<div className="border-t pt-4">
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
								Adresse
							</p>
							<p className="text-sm text-gray-700">{event.address}</p>
						</div>
					)}

					{/* Traductions PT */}
					{(event.title_pt || event.description_pt) && (
						<div className="border-t pt-4">
							<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
								Portugais
							</p>
							{event.title_pt && (
								<div className="mb-2">
									<p className="text-xs font-medium text-gray-600">Titre:</p>
									<p className="text-sm text-gray-700">{event.title_pt}</p>
								</div>
							)}
							{event.description_pt && (
								<div>
									<p className="text-xs font-medium text-gray-600">Description:</p>
									<p className="text-sm text-gray-700 leading-relaxed">
										{event.description_pt}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
