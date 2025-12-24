import { uploadPhoto } from "@/app/actions/photo";

/**
 * API ROUTE : UPLOAD PHOTO
 * 
 * Wrapper autour de la Server Action uploadPhoto pour les requêtes fetch
 * de la queue d'uploads côté client.
 * 
 * POST /api/upload-photo
 * Body: FormData avec {file, uploaded_by_name, message, timestamp, website}
 */

export async function POST(request: Request) {
  try {
    // Récupérer le FormData de la requête
    const formData = await request.formData();

    // Debug logging
    const name = formData.get("uploaded_by_name");
    const file = formData.get("file");
    const message = formData.get("message");
    const timestamp = formData.get("timestamp");

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "Aucun fichier fourni",
        },
        { status: 400 }
      );
    }

    if (!name) {
      return Response.json(
        {
          success: false,
          message: "Le nom est obligatoire",
        },
        { status: 400 }
      );
    }

    // Appeler la Server Action
    const result = await uploadPhoto(formData);

    // Retourner la réponse
    return Response.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Upload API error:", error);

    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Erreur serveur",
      },
      { status: 500 }
    );
  }
}
