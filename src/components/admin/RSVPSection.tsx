"use client";

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

interface RSVPSectionProps {
	rsvps: RSVP[];
	filter: "all" | "attending" | "not-attending";
	onFilterChange: (filter: "all" | "attending" | "not-attending") => void;
	onEdit: (rsvp: RSVP) => void;
	onDelete: (rsvpId: string) => void;
	deletingId: string | null;
}

import RSVPCard from "./RSVPCard";

export default function RSVPSection({
	rsvps,
	filter,
	onFilterChange,
	onEdit,
	onDelete,
	deletingId,
}: RSVPSectionProps) {
	// Filtrer les RSVPs
	const filtered = rsvps.filter((rsvp) => {
		if (filter === "attending") return rsvp.attending;
		if (filter === "not-attending") return !rsvp.attending;
		return true;
	});

	// Calcul du nombre de parts (repas) pour une personne présente.
	// Barème enfants : < 4 ans => 0 part, 4-7 ans => 1/2 part, 8 ans et + => 1 part.
	// Les adultes (et l'invité principal) comptent 1 part.
	const sharesForMember = (member: { isChild?: boolean; age?: number }): number => {
		if (!member.isChild || member.age === undefined) return 1;
		if (member.age < 4) return 0;
		if (member.age <= 7) return 0.5;
		return 1;
	};

	// Statistiques
	const stats = {
		total: rsvps.length,
		attending: rsvps.filter((r) => r.attending).length,
		notAttending: rsvps.filter((r) => !r.attending).length,
		withFamilyMembers: rsvps.filter((r) => r.family_members && r.family_members.length > 0).length,
		totalGuests: rsvps.reduce((acc, r) => {
			let count = r.attending ? 1 : 0;
			if (r.family_members && Array.isArray(r.family_members)) {
				count += r.family_members.filter((m: any) => m.attending === true).length;
			}
			return acc + count;
		}, 0),
		// Nombre de personnes absentes : invité principal qui décline + tout
		// accompagnant marqué absent (y compris quand le principal vient).
		totalAbsent: rsvps.reduce((acc, r) => {
			let count = r.attending ? 0 : 1;
			if (r.family_members && Array.isArray(r.family_members)) {
				count += r.family_members.filter((m: any) => m.attending === false).length;
			}
			return acc + count;
		}, 0),
		totalShares: rsvps.reduce((acc, r) => {
			// L'invité principal est toujours un adulte (1 part) s'il est présent
			let shares = r.attending ? 1 : 0;
			if (r.family_members && Array.isArray(r.family_members)) {
				shares += r.family_members
					.filter((m: any) => m.attending === true)
					.reduce((s, m) => s + sharesForMember(m), 0);
			}
			return acc + shares;
		}, 0),
	};

	// Cartes de statistiques (mêmes données desktop et mobile).
	// La grille se répartit automatiquement en lignes selon la largeur d'écran.
	const statCards: Array<{
		label: string;
		shortLabel: string;
		value: number | string;
		color: "primary" | "green" | "red" | "blue";
	}> = [
		{ label: "Total de réponses", shortLabel: "Réponses", value: stats.total, color: "primary" },
		{ label: "Réponses positives", shortLabel: "Oui", value: stats.attending, color: "green" },
		{ label: "Réponses négatives", shortLabel: "Non", value: stats.notAttending, color: "red" },
		{ label: "Avec groupe/famille", shortLabel: "Groupes", value: stats.withFamilyMembers, color: "blue" },
		{ label: "Total invités présents", shortLabel: "Présents", value: stats.totalGuests, color: "green" },
		{ label: "Total invités absents", shortLabel: "Absents", value: stats.totalAbsent, color: "red" },
		{ label: "Nombre de parts", shortLabel: "Parts", value: stats.totalShares.toLocaleString("fr-FR"), color: "primary" },
	];

	return (
		<>
			{/* Statistiques en cartes (responsive : 2 colonnes sur mobile -> 7 sur grand écran) */}
			<div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-8">
				{statCards.map((card) => (
					<StatCard
						key={card.label}
						label={card.label}
						shortLabel={card.shortLabel}
						value={card.value}
						color={card.color}
					/>
				))}
			</div>

			{/* Filtres */}
			<div className="mb-8 grid grid-cols-3 gap-2 flex-wrap text-xs">
				<button
					onClick={() => onFilterChange("all")}
					className={`px-4 py-2 rounded-lg transition-all ${
						filter === "all"
							? "bg-primary text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
				>
					Tous ({stats.total})
				</button>
				<button
					onClick={() => onFilterChange("attending")}
					className={`px-4 py-2 rounded-lg transition-all ${
						filter === "attending"
							? "bg-green-700/70 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
				>
					Présents ({stats.attending})
				</button>
				<button
					onClick={() => onFilterChange("not-attending")}
					className={`px-4 py-2 rounded-lg transition-all ${
						filter === "not-attending"
							? "bg-red-700/70 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-gray-300"
					}`}
				>
					Absents ({stats.notAttending})
				</button>
			</div>

			{/* Tableau */}
			{filtered.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-foreground-muted">
						Aucune réponse pour le moment
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{filtered.map((rsvp) => (
						<RSVPCard
							key={rsvp.id}
							rsvp={rsvp}
							onEdit={onEdit}
							onDelete={onDelete}
							isDeleting={deletingId === rsvp.id}
						/>
					))}
				</div>
			)}
		</>
	);
}

function StatCard({
	label,
	shortLabel,
	value,
	color,
}: {
	label: string;
	shortLabel?: string;
	value: number | string;
	color: "primary" | "green" | "red" | "blue";
}) {
	// Fond doux et chiffres sobres, dans la charte du site
	// (vert sauge / beige / vert bouteille).
	const styleMap = {
		primary: { bg: "bg-primary/10", value: "text-primary-dark" },
		green: { bg: "bg-primary/15", value: "text-accent" },
		red: { bg: "bg-secondary/25", value: "text-secondary-dark" },
		blue: { bg: "bg-accent/10", value: "text-accent" },
	};
	const s = styleMap[color];

	return (
		<div className={`text-center ${s.bg} rounded-lg px-2 py-3 sm:py-4`}>
			<p className={`text-2xl sm:text-3xl font-semibold ${s.value}`}>{value}</p>
			<p className="hidden sm:block text-xs sm:text-sm text-foreground-muted mt-1">{label}</p>
			<p className="sm:hidden text-xs text-foreground-muted mt-1">{shortLabel ?? label}</p>
		</div>
	);
}
