'use client';

import Section from '@/components/ui/Section';
import HebergementTypeGroup from './HebergementTypeGroup';
import type { Hebergement } from '@/lib/supabase/queries';

interface HebergementsByTypeProps {
	hebergements: Hebergement[];
	dict: any;
}

export default function HebergementsByType({
	hebergements,
	dict,
}: HebergementsByTypeProps) {
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
			<div className="max-w-4xl mx-auto px-4 sm:px-0 space-y-12 sm:space-y-16">
				{Object.entries(hebergementsByType).map(([type, items]) => (
					<HebergementTypeGroup
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
		airbnb: 'Locations de Vacances',
	};
	return labels[type] || type;
}
