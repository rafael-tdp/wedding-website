"use client";

import { useState } from "react";
import {
	updateGalleryVisibility,
	type GalleryVisibilityMode,
} from "@/app/actions/admin";
import { Title } from "../ui";

interface AdminSettingsSectionProps {
	initialGalleryVisibility: GalleryVisibilityMode;
}

const OPTIONS: {
	value: GalleryVisibilityMode;
	label: string;
	description: string;
}[] = [
	{
		value: "visible",
		label: "Oui",
		description: "La galerie (photos + upload) est toujours accessible aux invités.",
	},
	{
		value: "hidden",
		label: "Non",
		description: "La galerie est masquée aux invités, quelle que soit la date.",
	},
	{
		value: "auto",
		label: "Automatique",
		description: "Ouverte aux invités à partir de la date et l'heure du mariage (comportement par défaut).",
	},
];

export default function AdminSettingsSection({
	initialGalleryVisibility,
}: AdminSettingsSectionProps) {
	const [value, setValue] = useState<GalleryVisibilityMode>(
		initialGalleryVisibility,
	);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [savedAt, setSavedAt] = useState<number | null>(null);

	const handleChange = async (mode: GalleryVisibilityMode) => {
		const previous = value;
		setValue(mode);
		setIsSaving(true);
		setError(null);

		try {
			const result = await updateGalleryVisibility(mode);
			if (!result.success) {
				setValue(previous);
				setError(result.message);
			} else {
				setSavedAt(Date.now());
			}
		} catch {
			setValue(previous);
			setError("Erreur lors de la mise à jour");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="max-w-2xl">
			<Title level="h4" align="left">
				Galerie photo
			</Title>
			<p className="text-foreground-muted text-sm mt-1 mb-6">
				Choisissez si la galerie photo (vue et upload) doit être accessible aux invités.
			</p>

			<div className="space-y-3">
				{OPTIONS.map((option) => (
					<label
						key={option.value}
						className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
							value === option.value
								? "border-primary bg-primary/5"
								: "border-gray-200 hover:border-gray-300"
						} ${isSaving ? "opacity-60 pointer-events-none" : ""}`}
					>
						<input
							type="radio"
							name="gallery_visibility"
							value={option.value}
							checked={value === option.value}
							onChange={() => handleChange(option.value)}
							disabled={isSaving}
							className="mt-1"
						/>
						<div>
							<p className="font-medium text-foreground">{option.label}</p>
							<p className="text-sm text-foreground-muted">
								{option.description}
							</p>
						</div>
					</label>
				))}
			</div>

			{error && (
				<p className="mt-4 text-sm text-red-600">{error}</p>
			)}
			{!error && savedAt && (
				<p className="mt-4 text-sm text-green-600">Réglage enregistré.</p>
			)}
		</div>
	);
}
