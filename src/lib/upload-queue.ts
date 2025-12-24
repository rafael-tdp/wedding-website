/**
 * UTILITAIRE : UPLOAD QUEUE
 * 
 * Gère une file d'attente d'uploads avec uploads parallèles.
 * Limite le nombre d'uploads simultanés pour éviter les timeouts.
 */

import { MAX_PARALLEL_UPLOADS, UPLOAD_TIMEOUT_MS } from "@/lib/validations/photo";

export interface QueuedUpload {
  id: string;
  file: File;
  metadata: {
    name: string;
    message: string;
    timestamp: number;
  };
}

export interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  percentage: number;
}

export class UploadQueue {
  private queue: QueuedUpload[] = [];
  private inProgress = new Set<string>();
  private completed = new Set<string>();
  private failed = new Set<string>();
  private callbacks: {
    onProgress?: (progress: UploadProgress) => void;
    onComplete?: (id: string, success: boolean, error?: string) => void;
  } = {};

  /**
   * Ajoute des fichiers à la queue
   */
  addFiles(
    files: File[],
    metadata: { name: string; message: string; timestamp: number }
  ): string[] {
    const ids: string[] = [];
    
    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.queue.push({ id, file, metadata });
      ids.push(id);
    }

    // Commencer les uploads
    this.processQueue();

    return ids;
  }

  /**
   * Traite la queue en respectant la limite de uploads parallèles
   */
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.inProgress.size < MAX_PARALLEL_UPLOADS) {
      const upload = this.queue.shift();
      if (!upload) break;

      this.inProgress.add(upload.id);
      this.notifyProgress();

      // Lancer l'upload sans attendre (parallèle)
      this.uploadFile(upload)
        .then((success) => {
          if (success) {
            this.completed.add(upload.id);
          } else {
            this.failed.add(upload.id);
          }
        })
        .catch((error) => {
          this.failed.add(upload.id);
          this.callbacks.onComplete?.(upload.id, false, error.message);
        })
        .finally(() => {
          this.inProgress.delete(upload.id);
          this.notifyProgress();
          // Continuer avec le prochain fichier
          if (this.queue.length > 0) {
            this.processQueue();
          }
        });
    }
  }

  /**
   * Upload un fichier avec timeout
   */
  private async uploadFile(upload: QueuedUpload): Promise<boolean> {
    return new Promise((resolve) => {
      // Créer un timeout
      const timeoutId = setTimeout(() => {
        this.callbacks.onComplete?.(
          upload.id,
          false,
          "Upload timeout - vérifiez votre connexion"
        );
        resolve(false);
      }, UPLOAD_TIMEOUT_MS);

      // Préparer le FormData
      const formData = new FormData();
      formData.append("file", upload.file);
      formData.append("uploaded_by_name", upload.metadata.name);
      formData.append("message", upload.metadata.message);
      formData.append("timestamp", upload.metadata.timestamp.toString());
      formData.append("website", ""); // Honeypot field (doit être vide)

      // Faire l'upload
      fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          clearTimeout(timeoutId);
          return response.json();
        })
        .then((data) => {
          const success = data.success === true;
          this.callbacks.onComplete?.(
            upload.id,
            success,
            success ? undefined : data.message
          );
          resolve(success);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          this.callbacks.onComplete?.(upload.id, false, error.message);
          resolve(false);
        });
    });
  }

  /**
   * Enregistre les callbacks
   */
  onProgress(callback: (progress: UploadProgress) => void): void {
    this.callbacks.onProgress = callback;
  }

  onComplete(callback: (id: string, success: boolean, error?: string) => void): void {
    this.callbacks.onComplete = callback;
  }

  /**
   * Notifie la progression
   */
  private notifyProgress(): void {
    const progress: UploadProgress = {
      total: this.completed.size + this.failed.size + this.inProgress.size + this.queue.length,
      completed: this.completed.size,
      failed: this.failed.size,
      inProgress: this.inProgress.size,
      percentage: Math.round(
        ((this.completed.size + this.failed.size) /
          (this.completed.size + this.failed.size + this.inProgress.size + this.queue.length)) *
          100
      ),
    };
    this.callbacks.onProgress?.(progress);
  }

  /**
   * Retourne la progression actuelle
   */
  getProgress(): UploadProgress {
    const total = this.completed.size + this.failed.size + this.inProgress.size + this.queue.length;
    return {
      total,
      completed: this.completed.size,
      failed: this.failed.size,
      inProgress: this.inProgress.size,
      percentage: total > 0 ? Math.round(((this.completed.size + this.failed.size) / total) * 100) : 0,
    };
  }

  /**
   * Retourne true si la queue est vide
   */
  isEmpty(): boolean {
    return (
      this.queue.length === 0 &&
      this.inProgress.size === 0
    );
  }

  /**
   * Réinitialise la queue
   */
  reset(): void {
    this.queue = [];
    this.inProgress.clear();
    this.completed.clear();
    this.failed.clear();
  }
}
