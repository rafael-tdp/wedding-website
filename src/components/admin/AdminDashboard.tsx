"use client";

import { useState, useEffect, useRef } from "react";
import {
	logoutAdmin,
	exportRSVPsAsCSV,
	deleteRSVP,
	hidePhoto,
	deletePhoto,
} from "@/app/actions/admin";
import { getFAQCount } from "@/app/actions/admin-faq";
import { getProgrammeCount } from "@/app/actions/admin-programme";
// import { getHebergementCount } from "@/app/actions/admin-hebergements"; // DESACTIVE TEMPORAIREMENT
import RSVPForm from "@/components/rsvp/RSVPForm";
import RSVPSection from "./RSVPSection";
import PhotoSection from "./PhotoSection";
import AdminFAQManager from "./AdminFAQManager";
import AdminProgrammeManager from "./AdminProgrammeManager";
// import AdminHebergementManager from "./AdminHebergementManager"; // DESACTIVE TEMPORAIREMENT
import { AdminFormModal } from "./AdminFormModal";
import SearchAndFilters from "./SearchAndFilters";
import { BiPlus, BiDownload } from "react-icons/bi";
import { MdMenu, MdClose, MdMoreVert } from "react-icons/md";
import { Title } from "../ui";

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

interface Photo {
	id: string;
	storage_path: string;
	public_url: string;
	filename: string;
	file_size: number | null;
	mime_type: string | null;
	width: number | null;
	height: number | null;
	caption: string | null;
	alt_text: string | null;
	uploaded_by: string | null;
	uploader_email: string | null;
	is_approved: boolean;
	is_visible: boolean;
	created_at: string;
	updated_at: string;
}

interface AdminDashboardProps {
	initialRsvps: RSVP[];
	initialPhotos?: Photo[];
}

type TabType = "rsvp" | "photos" | "faq" | "programme";

/**
 * COMPOSANT : DASHBOARD ADMIN
 * Tableau de bord pour visualiser et gérer les RSVPs et les photos
 */
export default function AdminDashboard({
	initialRsvps,
	initialPhotos = [],
}: AdminDashboardProps) {	const [rsvps, setRsvps] = useState<RSVP[]>(initialRsvps);
	const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
	const [filter, setFilter] = useState<"all" | "attending" | "not-attending">(
		"all",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [exportLoading, setExportLoading] = useState(false);
	const [activeTab, setActiveTabState] = useState<TabType>("rsvp");
	const [hidingId, setHidingId] = useState<string | null>(null);
	const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
	const [showAddGuestForm, setShowAddGuestForm] = useState(false);
	const [editingRsvp, setEditingRsvp] = useState<RSVP | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [faqCount, setFaqCount] = useState(0);
	const [programmeCount, setProgrammeCount] = useState(0);
	// const [hebergementCount, setHebergementCount] = useState(0); // DESACTIVE TEMPORAIREMENT
	const [showAddFAQCreateForm, setShowAddFAQCreateForm] = useState(false);
	const [showAddFAQEditForm, setShowAddFAQEditForm] = useState(false);
	const [showAddProgrammeCreateForm, setShowAddProgrammeCreateForm] =
		useState(false);
	const [showAddProgrammeEditForm, setShowAddProgrammeEditForm] =
		useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	// const [showAddHebergementCreateForm, setShowAddHebergementCreateForm] = useState(false); // DESACTIVE TEMPORAIREMENT
	// const [showAddHebergementEditForm, setShowAddHebergementEditForm] = useState(false); // DESACTIVE TEMPORAIREMENT

	// Fermer le menu au click en dehors
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

	// Charger l'onglet depuis localStorage après le montage
	useEffect(() => {
		const savedTab = localStorage.getItem(
			"adminActiveTab",
		) as TabType | null;
		const validTabs: TabType[] = ["rsvp", "photos", "faq", "programme"];
		if (savedTab && validTabs.includes(savedTab)) {
			setActiveTabState(savedTab);
		}
	}, []);

	// Charger les counts des sections
	useEffect(() => {
		const loadCounts = async () => {
			const [faqResult, programmeResult] = await Promise.all([
				getFAQCount(),
				getProgrammeCount(),
				// getHebergementCount(), // DESACTIVE TEMPORAIREMENT
			]);

			if (faqResult.success) setFaqCount(faqResult.count);
			if (programmeResult.success)
				setProgrammeCount(programmeResult.count);
			// if (hebergementResult.success) setHebergementCount(hebergementResult.count); // DESACTIVE TEMPORAIREMENT
		};

		loadCounts();
	}, []);

	// Fonction pour changer l'onglet avec localStorage
	const setActiveTab = (tab: TabType) => {
		setActiveTabState(tab);
		localStorage.setItem("adminActiveTab", tab);
	};

	const handleLogout = async () => {
		if (confirm("Êtes-vous sûr de vouloir vous déconnecter?")) {
			await logoutAdmin();
			window.location.reload();
		}
	};

	const handleHidePhoto = async (photoId: string) => {
		const photo = photos.find((p) => p.id === photoId);
		if (!photo) return;

		const newVisibility = !photo.is_visible;
		setHidingId(photoId);
		try {
			const result = await hidePhoto(photoId, newVisibility);
			if (result.success) {
				setPhotos(
					photos.map((p) =>
						p.id === photoId
							? { ...p, is_visible: newVisibility }
							: p,
					),
				);
			} else {
				alert(result.message);
			}
		} catch (error) {
			alert("Erreur lors de la modification");
		} finally {
			setHidingId(null);
		}
	};

	const handleDeletePhoto = async (photoId: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cette photo?")) return;

		setDeletingPhotoId(photoId);
		try {
			const result = await deletePhoto(photoId);
			if (result.success) {
				setPhotos(photos.filter((p) => p.id !== photoId));
			} else {
				alert(result.message);
			}
		} catch (error) {
			alert("Erreur lors de la suppression");
		} finally {
			setDeletingPhotoId(null);
		}
	};

	const handleAddGuestSuccess = (newRsvp: RSVP) => {
		// Vérifier si on met à jour ou ajoute
		const existingIndex = rsvps.findIndex(
			(r) =>
				r.guest_email === newRsvp.guest_email ||
				(r.guest_email === "" && r.guest_name === newRsvp.guest_name),
		);
		if (existingIndex >= 0) {
			// Mise à jour
			const updated = [...rsvps];
			updated[existingIndex] = newRsvp;
			setRsvps(updated);
		} else {
			// Ajout nouveau
			setRsvps([...rsvps, newRsvp]);
		}
		// Fermer le modal
		setShowAddGuestForm(false);
	};

	const handleDeleteRsvp = async (rsvpId: string) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité?")) return;

		setDeletingId(rsvpId);
		try {
			const result = await deleteRSVP(rsvpId);
			if (result.success) {
				setRsvps(rsvps.filter((r) => r.id !== rsvpId));
			} else {
				alert(result.message);
			}
		} catch (error) {
			alert("Erreur lors de la suppression");
		} finally {
			setDeletingId(null);
		}
	};

	const handleExportCSV = async () => {
		setExportLoading(true);
		try {
			const csv = await exportRSVPsAsCSV();
			if (!csv) {
				alert("Erreur lors de l'export");
				return;
			}

			// Créer un blob et télécharger
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`rsvps-${new Date().toISOString().split("T")[0]}.csv`,
			);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			alert("Erreur lors de l'export");
		} finally {
			setExportLoading(false);
		}
	};	// Filtrer les RSVPs
	const filtered = rsvps.filter((rsvp) => {
		// Filtre par présence
		if (filter === "attending" && !rsvp.attending) return false;
		if (filter === "not-attending" && rsvp.attending) return false;

		// Filtre par recherche
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesName = (rsvp.guest_name || "").toLowerCase().includes(query);
			const matchesEmail = (rsvp.guest_email || "").toLowerCase().includes(query);
			const matchesPhone = (rsvp.guest_phone || "").toLowerCase().includes(query);
			
			// Chercher aussi dans les accompagnants
			const matchesFamilyMember = rsvp.family_members?.some(member =>
				(member.name || "").toLowerCase().includes(query)
			) || false;
			
			if (!matchesName && !matchesEmail && !matchesPhone && !matchesFamilyMember) {
				return false;
			}
		}

		return true;
	});

	// Statistiques
	const stats = {
		total: rsvps.length,
		attending: rsvps.filter((r) => r.attending).length,
		notAttending: rsvps.filter((r) => !r.attending).length,
		withFamilyMembers: rsvps.filter(
			(r) => r.family_members && r.family_members.length > 0,
		).length,
		totalGuests: rsvps.reduce((acc, r) => {
			// Compter la personne principale si elle est présente
			let count = r.attending ? 1 : 0;
			// Ajouter les membres de la famille qui sont présents
			if (r.family_members && Array.isArray(r.family_members)) {
				count += r.family_members.filter(
					(m: any) => m.attending === true,
				).length;
			}
			return acc + count;
		}, 0),
	};

	return (
		<main className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 md:pt-32">
				{/* Header */}
				<div className="flex justify-between items-start md:items-center gap-4 mb-8">
					<div>
						<Title level="h3" align="left">
							Tableau de bord
						</Title>
						<p className="text-foreground-muted">
							Gestion du mariage
						</p>
					</div>

					{/* Menu desktop */}
					<div className="hidden sm:flex items-center gap-4 text-sm">
						{/* Boutons adaptés à l'onglet actif */}
						{activeTab === "rsvp" && (
							<>
								<button
									onClick={() => setShowAddGuestForm(true)}
									className="text-foreground-muted hover:text-foreground underline transition-colors"
									title="Ajouter un invité"
								>
									<BiPlus className="inline mr-0.5" />
									Ajouter un invité
								</button>
								<span className="text-foreground-muted">│</span>
								<button
									onClick={handleExportCSV}
									disabled={
										exportLoading || rsvps.length === 0
									}
									className="text-foreground-muted hover:text-foreground underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									title="Exporter en CSV"
								>
									<BiDownload className="inline mr-1" />
									{exportLoading
										? "Export..."
										: "Exporter CSV"}
								</button>
								<span className="text-foreground-muted">│</span>
							</>
						)}

						{activeTab === "faq" && (
							<>
								<button
									onClick={() =>
										setShowAddFAQCreateForm(true)
									}
									className="text-foreground-muted hover:text-foreground underline transition-colors"
									title="Ajouter une FAQ"
								>
									<BiPlus className="inline mr-0.5" />
									Ajouter une FAQ
								</button>
								<span className="text-foreground-muted">│</span>
							</>
						)}

						{activeTab === "programme" && (
							<>
								<button
									onClick={() =>
										setShowAddProgrammeCreateForm(true)
									}
									className="text-foreground-muted hover:text-foreground underline transition-colors"
									title="Ajouter un événement"
								>
									<BiPlus className="inline mr-0.5" />
									Ajouter un événement
								</button>
								<span className="text-foreground-muted">│</span>
							</>
						)}

						<button
							onClick={handleLogout}
							className="text-foreground-muted hover:text-foreground underline transition-colors"
							title="Se déconnecter"
						>
							Déconnexion
						</button>
					</div>

					{/* Menu mobile */}
				<div className="sm:hidden relative" ref={menuRef}>
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-lg hover:bg-gray-100 text-foreground transition-colors"
							title="Menu"
						>
							<MdMoreVert
								size={24}
								className="text-gray-700 transition-transform"
								style={{
									transform: isMenuOpen
										? "rotate(90deg)"
										: "rotate(0deg)",
								}}
							/>
						</button>

						{isMenuOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
								{activeTab === "rsvp" && (
									<>
										<button
											onClick={() => {
												setShowAddGuestForm(true);
												setIsMenuOpen(false);
											}}
											className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
										>
											<BiPlus className="inline mr-2" />
											Ajouter invité
										</button>
										<button
											onClick={() => {
												handleExportCSV();
												setIsMenuOpen(false);
											}}
											disabled={
												exportLoading ||
												rsvps.length === 0
											}
											className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<BiDownload className="inline mr-2" />
											{exportLoading
												? "Export..."
												: "Exporter CSV"}
										</button>
										<div className="border-t border-gray-100"></div>
									</>
								)}

								{activeTab === "faq" && (
									<>
										<button
											onClick={() => {
												setShowAddFAQCreateForm(true);
												setIsMenuOpen(false);
											}}
											className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
										>
											<BiPlus className="inline mr-2" />
											Ajouter FAQ
										</button>
										<div className="border-t border-gray-100"></div>
									</>
								)}

								{activeTab === "programme" && (
									<>
										<button
											onClick={() => {
												setShowAddProgrammeCreateForm(
													true,
												);
												setIsMenuOpen(false);
											}}
											className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
										>
											<BiPlus className="inline mr-2" />
											Ajouter événement
										</button>
										<div className="border-t border-gray-100"></div>
									</>
								)}

								<button
									onClick={() => {
										handleLogout();
										setIsMenuOpen(false);
									}}
									className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-red-600 hover:text-red-700"
								>
									Déconnexion
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Onglets */}
				<div className="overflow-x-auto sm:overflow-visible -mx-4 sm:mx-0 px-4 sm:px-0 mb-6 sm:mb-8 border-b border-gray-300">
					<div className="flex gap-1 sm:gap-4 flex-nowrap sm:flex-wrap">
						<button
							onClick={() => setActiveTab("rsvp")}
							className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all border-b-2 text-xs sm:text-base whitespace-nowrap ${
								activeTab === "rsvp"
									? "border-primary text-primary"
									: "border-transparent text-foreground-muted hover:text-foreground"
							}`}
						>
							RSVP ({rsvps.length})
						</button>
						<button
							onClick={() => setActiveTab("photos")}
							className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all border-b-2 text-xs sm:text-base whitespace-nowrap ${
								activeTab === "photos"
									? "border-primary text-primary"
									: "border-transparent text-foreground-muted hover:text-foreground"
							}`}
						>
							Photos ({photos.length})
						</button>
						<button
							onClick={() => setActiveTab("faq")}
							className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all border-b-2 text-xs sm:text-base whitespace-nowrap ${
								activeTab === "faq"
									? "border-primary text-primary"
									: "border-transparent text-foreground-muted hover:text-foreground"
							}`}
						>
							FAQ ({faqCount})
						</button>
						<button
							onClick={() => setActiveTab("programme")}
							className={`px-3 sm:px-6 py-2 sm:py-3 font-medium transition-all border-b-2 text-xs sm:text-base whitespace-nowrap ${
								activeTab === "programme"
									? "border-primary text-primary"
									: "border-transparent text-foreground-muted hover:text-foreground"
							}`}
						>
							Programme ({programmeCount})
						</button>
					</div>
				</div>

				{/* Section RSVPs */}			{activeTab === "rsvp" && (
				<>
					<SearchAndFilters
						onSearchChange={setSearchQuery}
						resultCount={filtered.length}
						totalCount={rsvps.length}
					/>
					<RSVPSection
						rsvps={filtered}
						filter={filter}
						onFilterChange={setFilter}
						onEdit={setEditingRsvp}
						onDelete={handleDeleteRsvp}
						deletingId={deletingId}
					/>
				</>
			)}

				{/* Section Photos */}
				{activeTab === "photos" && (
					<PhotoSection
						photos={photos}
						onToggleVisibility={handleHidePhoto}
						onDelete={handleDeletePhoto}
						hidingId={hidingId}
						deletingPhotoId={deletingPhotoId}
					/>
				)}

				{/* Section FAQs */}
				{activeTab === "faq" && (
					<AdminFAQManager
						showCreateForm={showAddFAQCreateForm}
						setShowCreateForm={setShowAddFAQCreateForm}
						showEditForm={showAddFAQEditForm}
						setShowEditForm={setShowAddFAQEditForm}
					/>
				)}

				{/* Section Programme */}
				{activeTab === "programme" && (
					<AdminProgrammeManager
						showCreateForm={showAddProgrammeCreateForm}
						setShowCreateForm={setShowAddProgrammeCreateForm}
						showEditForm={showAddProgrammeEditForm}
						setShowEditForm={setShowAddProgrammeEditForm}
					/>
				)}

				{/* Section Hébergements - DESACTIVEE TEMPORAIREMENT */}
				{/* {activeTab === "hebergements" && (
				<AdminHebergementManager showCreateForm={showAddHebergementCreateForm} setShowCreateForm={setShowAddHebergementCreateForm} showEditForm={showAddHebergementEditForm} setShowEditForm={setShowAddHebergementEditForm} />
			)} */}

				{/* Modal pour ajouter un invité */}
				<AdminFormModal
					isOpen={showAddGuestForm}
					onClose={() => setShowAddGuestForm(false)}
					title="Ajouter un invité"
					onSubmit={(e) => e.preventDefault()}
					submitLabel="Fermer"
					isFormWrapper={false}
				>
					<RSVPForm
						onSuccess={(newRsvp) => {
							handleAddGuestSuccess(newRsvp);
							setShowAddGuestForm(false);
						}}
					/>
				</AdminFormModal>

				{/* Modal pour modifier un invité */}
				<AdminFormModal
					isOpen={!!editingRsvp}
					onClose={() => setEditingRsvp(null)}
					title="Modifier l'invité"
					onSubmit={(e) => e.preventDefault()}
					submitLabel="Fermer"
					isFormWrapper={false}
				>
					<RSVPForm
						onSuccess={(updatedRsvp) => {
							handleAddGuestSuccess(updatedRsvp);
							setEditingRsvp(null);
						}}
						initialData={editingRsvp || undefined}
					/>
				</AdminFormModal>
			</div>
		</main>
	);
}
