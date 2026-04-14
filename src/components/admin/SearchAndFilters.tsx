"use client";

import { useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";

interface SearchAndFiltersProps {
	onSearchChange: (query: string) => void;
	resultCount: number;
	totalCount: number;
}

export default function SearchAndFilters({
	onSearchChange,
	resultCount,
	totalCount,
}: SearchAndFiltersProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchClear = () => {
		setSearchQuery("");
		onSearchChange("");
	};

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		onSearchChange(value);
	};
	return (
		<div className="space-y-4 mb-6">
			{/* Barre de recherche */}
			<div className="flex items-center gap-2">
				<div className="flex-1 relative">
					<BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Rechercher par nom, email ou téléphone..."
						value={searchQuery}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
					/>
					{searchQuery && (
						<button
							onClick={handleSearchClear}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							title="Effacer la recherche"
						>
							<BiX size={20} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
