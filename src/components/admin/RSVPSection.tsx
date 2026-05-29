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

	return (
		<>
			{/* Statistiques */}
			<div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 mb-8">
				<StatCard
					label="Total de réponses"
					value={stats.total}
					color="primary"
				/>
				<StatCard
					label="Réponses positives"
					value={stats.attending}
					color="green"
				/>
				<StatCard
					label="Absents"
					value={stats.notAttending}
					color="red"
				/>
				<StatCard
					label="Avec groupe/famille"
					value={stats.withFamilyMembers}
					color="blue"
				/>
				<StatCard
					label="Total invités présents"
					value={stats.totalGuests}
					color="green"
				/>
				<StatCard
					label="Nombre de parts"
					value={stats.totalShares.toLocaleString("fr-FR")}
					color="primary"
				/>
			</div>

            {/* Statistiques pour mobile - format compact moderne en une ligne */}
            <div className="md:hidden mb-6 px-0 py-2 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-blue-400">{stats.total}</div>
                        <div className="text-xs text-gray-500">Rép.</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-green-400">{stats.attending}</div>
                        <div className="text-xs text-gray-500">Oui</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-red-400">{stats.notAttending}</div>
                        <div className="text-xs text-gray-500">Non</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-purple-400">{stats.withFamilyMembers}</div>
                        <div className="text-xs text-gray-500">Accomp.</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-green-400">{stats.totalGuests}</div>
                        <div className="text-xs text-gray-500">Présents</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="text-center flex-1">
                        <div className="text-xl font-bold text-primary">{stats.totalShares.toLocaleString("fr-FR")}</div>
                        <div className="text-xs text-gray-500">Parts</div>
                    </div>
                </div>
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
	value,
	color,
}: {
	label: string;
	value: number | string;
	color: "primary" | "green" | "red" | "blue";
}) {
	const colorMap = {
		primary: "bg-primary/10 text-primary",
		green: "bg-green-100 text-green-700",
		red: "bg-red-100 text-red-700",
		blue: "bg-blue-100 text-blue-700",
	};

	return (
		<div className={`${colorMap[color]} rounded-lg p-6`}>
			<p className="text-sm font-medium opacity-75">{label}</p>
			<p className="text-3xl font-bold mt-2">{value}</p>
		</div>
	);
}
