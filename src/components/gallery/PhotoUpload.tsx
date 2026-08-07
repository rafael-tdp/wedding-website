"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { uploadPhoto } from "@/app/actions/photo";
import {
  validateImageFile,
  checkUploadLimit,
  incrementUploadCount,
  MAX_PHOTOS_PER_SESSION,
} from "@/lib/validations/photo";
import { UploadQueue, UploadProgress } from "@/lib/upload-queue";
import { UploadProgressBar } from "./UploadProgressBar";
import Button from "@/components/ui/Button";

/**
 * COMPOSANT : UPLOAD DE PHOTOS
 * 
 * Permet aux invités d'uploader des photos sans authentification.
 * 
 * Fonctionnalités :
 * - Sélection de fichier avec preview
 * - Compression côté client (optimisation quota)
 * - Validation en temps réel
 * - Protection anti-spam (rate limiting)
 * - Feedback utilisateur (loading, success, errors)
 */

interface UploadError {
  message: string;
  fields?: Record<string, string[]>;
}

/**
 * Options de compression côté client (économie du quota storage Supabase).
 * Cible ~1,5 MB / 1920px : qualité parfaite à l'écran et pour tirages standards,
 * ~3x plus léger que l'original d'un smartphone.
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

/**
 * Miniature utilisée dans les grilles (galerie + admin) : ~500px / ~150 Ko.
 * Économise l'essentiel de la bande passante Supabase, la version 1920px
 * n'étant chargée que dans la lightbox et au téléchargement.
 */
const THUMBNAIL_COMPRESSION_OPTIONS = {
  maxSizeMB: 0.15,
  maxWidthOrHeight: 500,
  useWebWorker: true,
};

interface PhotoUploadTexts {
  name: string;
  namePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  photo: string;
  selectFile: string;
  dragDrop: string;
  compressing: string;
  remove: string;
  submit: string;
  submitting: string;
  remaining: string;
  formats: string;
  maxSize: string;
  addMore: string;
  removeAll: string;
}

export function PhotoUpload({ texts }: { texts: PhotoUploadTexts }) {
  // ============================================
  // STATE
  // ============================================

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedThumbnails, setSelectedThumbnails] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const [uploadLimit, setUploadLimit] = useState<{
    remaining: number;
    allowed: boolean;
  }>({ remaining: MAX_PHOTOS_PER_SESSION, allowed: true });

  // État pour la queue d'uploads
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
    percentage: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formTimestamp = useRef<number>(Date.now());
  const queueRef = useRef<UploadQueue | null>(null);
  const nameRef = useRef<string>("");
  const messageRef = useRef<string>("");

  // ============================================
  // EFFECTS
  // ============================================

  // Vérifier la limite d'upload au chargement
  useEffect(() => {
    const limit = checkUploadLimit();
    setUploadLimit({ remaining: limit.remaining, allowed: limit.allowed });
  }, []);

  // Réinitialiser le timestamp quand le formulaire est affiché
  useEffect(() => {
    formTimestamp.current = Date.now();
  }, []);

  // ============================================
  // HANDLERS : SÉLECTION DE FICHIER
  // ============================================

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Réinitialiser les états
    setUploadError(null);
    setUploadSuccess(false);

    const newFiles: File[] = [];
    const newThumbnails: File[] = [];
    const newPreviews: string[] = [];

    setIsCompressing(true);

    // Traiter chaque fichier
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Valider le fichier
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError({ message: `${file.name}: ${validation.error || "Fichier invalide"}` });
        continue;
      }

      // Compresser côté client pour économiser le quota storage.
      // En cas d'échec, on retombe sur le fichier original.
      let processedFile = file;
      try {
        processedFile = await imageCompression(file, COMPRESSION_OPTIONS);
      } catch (error) {
        console.error("Compression failed, using original file:", error);
      }

      // Générer la miniature (à partir du fichier déjà compressé, donc rapide).
      // En cas d'échec, on retombe sur le fichier compressé complet : la grille
      // sera juste un peu plus lourde pour cette photo, rien de bloquant.
      let thumbnailFile = processedFile;
      try {
        thumbnailFile = await imageCompression(processedFile, THUMBNAIL_COMPRESSION_OPTIONS);
      } catch (error) {
        console.error("Thumbnail generation failed, using compressed file:", error);
      }

      // Créer le preview
      const objectUrl = URL.createObjectURL(processedFile);
      newPreviews.push(objectUrl);

      newFiles.push(processedFile);
      newThumbnails.push(thumbnailFile);
    }

    setIsCompressing(false);

    setSelectedFiles(newFiles);
    setSelectedThumbnails(newThumbnails);
    setPreviewUrls(newPreviews);
  };

  // ============================================
  // HANDLERS : SUPPRESSION DU FICHIER
  // ============================================

  const handleRemoveFile = () => {
    setSelectedFiles([]);
    setSelectedThumbnails([]);
    setPreviewUrls([]);
    setUploadError(null);
    setUploadSuccess(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFileAt = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setSelectedThumbnails(selectedThumbnails.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================
  // HANDLERS : SOUMISSION DU FORMULAIRE
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setUploadError({ message: "Veuillez sélectionner au moins une photo" });
      return;
    }

    // Vérifier la limite d'upload
    const limit = checkUploadLimit();
    if (!limit.allowed) {
      setUploadError({
        message: `Vous avez atteint la limite de ${MAX_PHOTOS_PER_SESSION} photos par session (30 minutes). Réessayez plus tard.`,
      });
      return;
    }

    // Récupérer les métadonnées du formulaire
    const nameInput = e.currentTarget.elements.namedItem("uploaded_by_name") as HTMLInputElement;
    const messageInput = e.currentTarget.elements.namedItem("message") as HTMLTextAreaElement;
    
    const name = nameInput?.value?.trim() || "";
    const message = messageInput?.value?.trim() || "";

    // Validation du nom
    if (!name || name.length < 2) {
      setUploadError({ message: "Veuillez entrer un nom valide (minimum 2 caractères)" });
      return;
    }

    nameRef.current = name;
    messageRef.current = message;

    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);

    // Créer la queue si elle n'existe pas
    if (!queueRef.current) {
      queueRef.current = new UploadQueue();

      // Enregistrer les callbacks
      queueRef.current.onProgress((progress) => {
        setUploadProgress(progress);
        
        // Mettre à jour la limite d'uploads
        if (progress.completed > 0) {
          for (let i = 0; i < progress.completed; i++) {
            incrementUploadCount();
          }
          const newLimit = checkUploadLimit();
          setUploadLimit({ remaining: newLimit.remaining, allowed: newLimit.allowed });
        }
      });

      queueRef.current.onComplete((id, success, error) => {
        if (!success && error) {
          console.error(`Upload failed for ${id}:`, error);
        }
      });
    }

    // Ajouter les fichiers à la queue
    queueRef.current.addFiles(
      selectedFiles.map((file, i) => ({ file, thumbnail: selectedThumbnails[i] })),
      {
        name: nameRef.current,
        message: messageRef.current,
        timestamp: formTimestamp.current,
      }
    );

    // Attendre que la queue soit vide
    const checkQueue = setInterval(() => {
      if (queueRef.current?.isEmpty()) {
        clearInterval(checkQueue);
        setIsUploading(false);

        const finalProgress = queueRef.current.getProgress();
        if (finalProgress.failed === 0) {
          setUploadSuccess(true);
          setSelectedFiles([]);
          setSelectedThumbnails([]);
          setPreviewUrls([]);
          formRef.current?.reset();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Masquer le message de succès après 5 secondes
          setTimeout(() => {
            setUploadSuccess(false);
            setUploadProgress({
              total: 0,
              completed: 0,
              failed: 0,
              inProgress: 0,
              percentage: 0,
            });
          }, 5000);
        } else {
          setUploadError({
            message: `${finalProgress.failed} photo(s) n'ont pas pu être uploadée(s)`,
          });
        }
      }
    }, 100);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field (caché) */}
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          className="absolute left-[-9999px]"
          aria-hidden="true"
        />

        {/* Champ : Nom */}
        <div>
          <label
            htmlFor="uploaded_by_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {texts.name} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="uploaded_by_name"
            name="uploaded_by_name"
            required
            disabled={isUploading || !uploadLimit.allowed}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder={texts.namePlaceholder}
          />
          {uploadError?.fields?.uploaded_by_name && (
            <p className="mt-1 text-sm text-red-600">
              {uploadError.fields.uploaded_by_name[0]}
            </p>
          )}
        </div>

        {/* Champ : Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {texts.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            disabled={isUploading || !uploadLimit.allowed}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            placeholder={texts.messagePlaceholder}
            maxLength={500}
          />
          {uploadError?.fields?.message && (
            <p className="mt-1 text-sm text-red-600">
              {uploadError.fields.message[0]}
            </p>
          )}
        </div>

        {/* Sélection de fichier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {texts.photo} <span className="text-red-500">*</span>
          </label>

          {!selectedFiles.length ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                onChange={handleFileChange}
                disabled={isUploading || isCompressing || !uploadLimit.allowed}
                multiple
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`
                  flex flex-col items-center justify-center
                  w-full h-64 border-2 border-dashed rounded-lg
                  cursor-pointer transition-colors
                  ${
                    uploadLimit.allowed
                      ? "border-gray-300 hover:border-primary hover:bg-primary/5"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }
                  ${isUploading ? "opacity-50 cursor-wait" : ""}
                `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <svg
                    className="w-12 h-12 mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-700">
                    {isCompressing ? (
                      <span className="font-semibold">{texts.compressing}</span>
                    ) : (
                      <>
                        <span className="font-semibold">{texts.selectFile}</span>{" "}
                        {texts.dragDrop}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {texts.formats}, HEIC ({texts.maxSize} par photo)
                  </p>
                  {uploadLimit.allowed && (
                    <p className="text-xs text-gray-500 mt-2">
                      {uploadLimit.remaining} {texts.remaining}
                    </p>
                  )}
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Grille des previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Bouton supprimer */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFileAt(index)}
                      disabled={isUploading}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors disabled:opacity-50 flex items-center justify-center"
                      title={texts.remove}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Taille du fichier */}
                    <p className="mt-1 text-xs text-gray-600 truncate">
                      {(selectedFiles[index].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ))}
              </div>

              {/* Bouton pour ajouter plus de photos */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                  onChange={handleFileChange}
                  disabled={isUploading || !uploadLimit.allowed}
                  multiple
                  className="hidden"
                  id="photo-upload-more"
                />
                <label
                  htmlFor="photo-upload-more"
                  className={`
                    flex items-center justify-center px-4 py-2 border-2 border-dashed rounded-lg
                    cursor-pointer transition-colors
                    ${
                      uploadLimit.allowed
                        ? "border-gray-300 hover:border-primary hover:bg-primary/5"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="text-sm text-gray-700">{texts.addMore}</span>
                </label>
              </div>

              {/* Bouton supprimer tout */}
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isUploading}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {texts.removeAll}
              </button>
            </div>
          )}
        </div>

        {/* Messages d'erreur */}
        {uploadError && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-red-800 mb-1">Erreur lors de l&apos;upload</p>
                <p className="text-sm text-red-700">{uploadError.message}</p>
                {uploadError.fields && Object.keys(uploadError.fields).length > 0 && (
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {Object.entries(uploadError.fields).map(([field, errors]) => (
                      <li key={field}>{field}: {errors.join(", ")}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message de succès */}
        {uploadSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ Photo(s) uploadée(s) avec succès ! Elles sont maintenant visibles dans la galerie.
            </p>
          </div>
        )}

        {/* Message limite atteinte */}
        {!uploadLimit.allowed && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Vous avez atteint la limite de {MAX_PHOTOS_PER_SESSION} photos par session.
              Revenez dans 30 minutes pour en ajouter d&apos;autres.
            </p>
          </div>
        )}

        {/* Barre de progression des uploads */}
        {isUploading && <UploadProgressBar progress={uploadProgress} isUploading={isUploading} />}

        {/* Bouton submit */}
        <Button
          type="submit"
          disabled={
            selectedFiles.length === 0 ||
            isUploading ||
            isCompressing ||
            !uploadLimit.allowed
          }
          className="w-full"
        >
          {isCompressing
            ? texts.compressing
            : isUploading
            ? `${texts.submitting} (${uploadProgress.completed}/${uploadProgress.total})`
            : `${texts.submit.replace("ma photo", selectedFiles.length > 0 ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""}` : "ma photo")}`}
        </Button>
      </form>
    </div>
  );
}
