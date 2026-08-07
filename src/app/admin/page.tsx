import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { getGalleryVisibilityMode } from "@/lib/supabase/queries";

export const metadata = {
  title: "Admin - Notre Mariage",
  description: "Tableau de bord pour les mariés",
  robots: "noindex, nofollow",
};

interface RSVP {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  attending: boolean;
  plus_one: boolean;
  plus_one_name?: string;
  dietary_restrictions?: string;
  allergies?: string;
  special_needs?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

interface Photo {
  id: string;
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
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

async function fetchRSVPsServer(): Promise<RSVP[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("rsvp")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching RSVPs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching RSVPs:", error);
    return [];
  }
}

async function fetchPhotosServer(): Promise<Photo[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return [];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("photos")
      .select("id,storage_path,public_url,thumbnail_url,filename,file_size,mime_type,width,height,caption,alt_text,uploaded_by,uploader_email,is_approved,is_visible,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching photos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching RSVPs:", error);
    return [];
  }
}

export default async function AdminPage() {
  // Créer un client serveur pour vérifier l'authentification
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-serif text-red-600 mb-4">Configuration requise</h1>
          <p className="text-foreground-muted">
            Supabase n&apos;est pas configuré. Veuillez définir les variables d&apos;environnement.
          </p>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const authToken = cookieStore.get("admin_auth_token")?.value;

  // Si pas de token, afficher le formulaire de login
  if (!authToken) {
    return <AdminLogin />;
  }

  // Charger les RSVPs côté serveur
  const rsvps = await fetchRSVPsServer();

  // Charger les photos côté serveur
  const photos = await fetchPhotosServer();

  // Charger le réglage de visibilité de la galerie
  const galleryVisibility = await getGalleryVisibilityMode();

  // Si token existe, afficher le dashboard avec les données
  return (
    <AdminDashboard
      initialRsvps={rsvps}
      initialPhotos={photos}
      initialGalleryVisibility={galleryVisibility}
    />
  );
}
