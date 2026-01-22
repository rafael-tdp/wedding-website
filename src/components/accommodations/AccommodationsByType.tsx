'use client';

import Section from '@/components/ui/Section';
import AccommodationTypeGroup from './AccommodationTypeGroup';
import type { Hebergement } from '@/lib/supabase/queries';

interface AccommodationsByTypeProps {
	hebergements: Hebergement[];
	dict: any;
}

export default function AccommodationsByType({
	hebergements,
	dict,
}: AccommodationsByTypeProps) {
	if (hebergements.length === 0) {
		return (
			<Section variant="default" spacing="lg">
				<div className="text-center py-12">
					<p className="text-foreground-muted">
						{dict.accommodation.comingSoon}
					</p>
				</div>
			</Section>
		);
	}

	// Group hebergements by type
	const hebergementsByType = hebergements.reduce(
		(acc, hebergement) => {
			if (!acc[hebergement.type]) {
				acc[hebergement.type] = [];
			}
			acc[hebergement.type].push(hebergement);
			return acc;
		},
		{} as Record<Hebergement['type'], Hebergement[]>
	);

	return (
		<Section variant="default" spacing="lg">
				<div className="max-w-4xl mx-auto space-y-12 sm:space-y-16">
				{Object.entries(hebergementsByType).map(([type, items]) => (
					<AccommodationTypeGroup
						key={type}
						type={type as Hebergement['type']}
						items={items}
						typeLabel={getTypeLabel(type as Hebergement['type'])}
					/>
				))}
			</div>
		</Section>
	);
}

function getTypeLabel(type: Hebergement['type']): string {
	const labels: Record<Hebergement['type'], string> = {
		hotel: 'Hôtels',
		gite: 'Gîtes',
		chambres_hotes: "Chambres d'Hôtes",
		airbnb: 'AirBnb / Locations de vacances',
	};
	return labels[type] || type;
}
