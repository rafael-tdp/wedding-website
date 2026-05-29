export const weddingConfig = {
	couple: {
		groom: "Rafael",
		bride: "Sofia",
	},

	wedding: {
		date: "2026-08-11",
		time: "12:00",
		location: "Quinta das Tulipas",
		address: "Rua De Mourens 625, 4775-225 Rio Covo – Barcelos",
		city: "Barcelos",
		zipCode: "4775-225",
		country: "Portugal",
		lat: 41.4763473325607,
		lng: -8.586906793809266,
	},

	cocktail: {
		time: "15:30",
		location: "Dans les jardins de Quinta das Tulipas",
	},

	contact: {
		email: "tavaresrafael93@gmail.com",
		phone: "+33 6 95 22 49 32",
		venuePhone: "+351 964 629 285",
		venueEmail: "geral@quintadastulipas.pt",
		venueWebsite: "https://quintadastulipas.pt",
	},

	travel: {
		parkingAvailable: true,
		parkingInfo: "Parking gratuit sur place",
		publicTransport: "RER C - Gare de Versailles",
	},

	meal: {
		hasDietaryOptions: true,
		dietaryOptions: ["végétarien", "végan", "sans gluten", "sans lactose"],
	},

	rsvp: {
		deadline: "2026-07-15",
		maxGuests: 150,
	},

	accommodation: {
		hasRecommendations: true,
		distanceFromVenue: "Moins de 10 km",
	},

	other: {
		dress_code: "Tenue de cérémonie",
		gifts: "Nous vous remercions, votre présence nous suffira",
		hashtag: "#RafaelEtSofia2026",
	},
};

export const getWeddingDate = () => new Date(weddingConfig.wedding.date);
export const getRSVPDeadline = () => new Date(weddingConfig.rsvp.deadline);

/**
 * Décalage horaire du lieu du mariage (Portugal continental).
 * Le 11 août, le Portugal est en heure d'été (WEST = UTC+1).
 * On fige l'offset pour que l'ouverture soit indépendante du fuseau
 * du serveur (Vercel = UTC).
 */
const WEDDING_UTC_OFFSET = "+01:00";

/**
 * Retourne la date et l'heure exactes du mariage (le jour J à l'heure
 * de la cérémonie, en heure locale du Portugal).
 *
 * Instant de référence partagé : ouverture de l'upload galerie et cible
 * du compte à rebours.
 */
export const getWeddingDateTime = () => {
	const dateStr = weddingConfig.wedding.date;
	const timeStr = weddingConfig.wedding.time;
	return new Date(`${dateStr}T${timeStr}:00${WEDDING_UTC_OFFSET}`);
};

/**
 * Vérifie si la date actuelle est avant l'ouverture de la galerie
 */
export const isBeforeWeddingGallery = () => {
	return new Date() < getWeddingDateTime();
};

export const getFullWeddingAddress = () => {
	const w = weddingConfig.wedding;
	return `${w.address}, ${w.zipCode} ${w.city}, ${w.country}`;
};

export const getContactEmail = () => weddingConfig.contact.email;
export const getContactPhone = () => weddingConfig.contact.phone;

export const getVenueInfo = () => ({
	name: weddingConfig.wedding.location,
	address: getFullWeddingAddress(),
	phone: weddingConfig.contact.venuePhone,
	email: weddingConfig.contact.venueEmail,
	website: weddingConfig.contact.venueWebsite,
	lat: weddingConfig.wedding.lat,
	lng: weddingConfig.wedding.lng,
});
