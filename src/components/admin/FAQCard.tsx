"use client";

import { useState, useRef, useEffect } from "react";
import { MdEdit, MdDelete, MdMoreVert } from "react-icons/md";
import { GoChevronDown } from "react-icons/go";

interface FAQItem {
	id: string;
	question: string;
	answer: string;
	category: string;
	question_fr: string;
	answer_fr: string;
	category_fr: string;
	question_pt: string;
	answer_pt: string;
	category_pt: string;
}

interface FAQCardProps {
	faq: FAQItem;
	onEdit: (faq: FAQItem) => void;
	onDelete: (faqId: string) => void;
}

export default function FAQCard({ faq, onEdit, onDelete }: FAQCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		}

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isMenuOpen]);

	return (
		<div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all">
			{/* Header */}
			<div className="flex items-center justify-between p-4 sm:p-6">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex-1 text-left hover:opacity-80 transition-opacity min-w-0"
				>
					<p className="text-sm sm:text-base font-medium text-gray-900 truncate">
						{faq.question_fr}
					</p>
					{faq.category_fr && (
						<p className="text-xs text-gray-500 mt-1">{faq.category_fr}</p>
					)}
				</button>

				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0 ml-2"
				>
					<GoChevronDown
						size={20}
						className="text-gray-400 transition-transform"
						style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
					/>
				</button>

				{/* Menu */}
				<div className="relative" ref={menuRef}>
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 flex-shrink-0"
					>
						<MdMoreVert size={20} />
					</button>

					{isMenuOpen && (
						<div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
							<button
								onClick={() => {
									onEdit(faq);
									setIsMenuOpen(false);
								}}
								className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm flex items-center gap-2"
							>
								<MdEdit size={16} />
								Modifier
							</button>
							<button
								onClick={() => {
									onDelete(faq.id);
									setIsMenuOpen(false);
								}}
								className="w-full px-4 py-2 text-left hover:bg-red-50 text-sm flex items-center gap-2 border-t"
							>
								<MdDelete size={16} />
								Supprimer
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Expanded Content */}
			{isExpanded && (
				<div className="border-t p-4 sm:p-6 bg-gray-50/50 space-y-4">
					<p className="text-sm text-gray-700 leading-relaxed">{faq.answer_fr}</p>

					{(faq.question_pt || faq.answer_pt) && (
						<div className="border-t pt-4">
							<p className="text-xs font-semibold text-gray-500 mb-2">PORTUGAIS</p>
							{faq.question_pt && (
								<div className="mb-2">
									<p className="text-xs font-medium text-gray-600">Q:</p>
									<p className="text-sm text-gray-700">{faq.question_pt}</p>
								</div>
							)}
							{faq.answer_pt && (
								<div>
									<p className="text-xs font-medium text-gray-600">R:</p>
									<p className="text-sm text-gray-700">{faq.answer_pt}</p>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
