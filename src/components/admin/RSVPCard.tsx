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
	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
			{/* En-tête */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						{rsvp.guest_name}
					</h3>
					<div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
						{rsvp.guest_email && (
							<span>📧 {rsvp.guest_email}</span>
						)}
						{rsvp.guest_phone && (
							<span>📱 {rsvp.guest_phone}</span>
						)}
						<span className="text-gray-400">
							{formatDate(rsvp.created_at)}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span
						className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
							rsvp.attending
								? "bg-green-100 text-green-800"
								: "bg-red-100 text-red-800"
						}`}
					>
						{rsvp.attending
							? "✓ Présent"
							: "✗ Absent"}
					</span>
					{/* Menu d'actions */}
					<div className="flex gap-1">
						<button
							onClick={() => onEdit(rsvp)}
							title="Modifier"
							className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
						>
							✎
						</button>
						<button
							onClick={() => onDelete(rsvp.id)}
							disabled={isDeleting}
							title="Supprimer"
							className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
						>
							{isDeleting ? "⟳" : "✕"}
						</button>
					</div>
				</div>
			</div>

			{/* Infos pratiques */}
			<div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
				{rsvp.dietary_restrictions && (
					<div className="bg-yellow-50 p-3 rounded">
						<span className="font-medium text-gray-900">
							Régime alimentaire:
						</span>
						<p className="text-gray-700">
							{rsvp.dietary_restrictions}
						</p>
					</div>
				)}
				{rsvp.allergies && (
					<div className="bg-red-50 p-3 rounded">
						<span className="font-medium text-gray-900">
							Allergies:
						</span>
						<p className="text-gray-700">
							{rsvp.allergies}
						</p>
					</div>
				)}
				{rsvp.special_needs && (
					<div className="bg-blue-50 p-3 rounded">
						<span className="font-medium text-gray-900">
							Besoins spéciaux:
						</span>
						<p className="text-gray-700">
							{rsvp.special_needs}
						</p>
					</div>
				)}
				{rsvp.message && (
					<div className="bg-gray-50 p-3 rounded">
						<span className="font-medium text-gray-900">
							Message:
						</span>
						<p className="text-gray-700">
							{rsvp.message}
						</p>
					</div>
				)}
			</div>

			{/* Groupe/Famille */}
			{rsvp.family_members && rsvp.family_members.length > 0 && (
				<div className="border-t pt-4">
					<h4 className="font-semibold text-gray-900 mb-3">
						Personnes du groupe ({rsvp.family_members.length})
					</h4>
					<div className="space-y-3">
						{rsvp.family_members.map((member, idx) => (
							<div
								key={idx}
								className="bg-gray-50 p-3 rounded border-l-4 border-primary"
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
										<span className="font-medium">Régime:</span> {member.dietary_restrictions}
									</p>
								)}
								{member.allergies && (
									<p className="text-xs text-gray-600">
										<span className="font-medium">Allergies:</span> {member.allergies}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
