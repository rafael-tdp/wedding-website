/**
 * COMPOSANT : BARRE DE PROGRESSION D'UPLOAD
 * 
 * Affiche la progression des uploads avec détails
 */

import { UploadProgress } from "@/lib/upload-queue";

interface ProgressBarProps {
  progress: UploadProgress;
  isUploading: boolean;
}

export function UploadProgressBar({ progress, isUploading }: ProgressBarProps) {
  const { total, completed, failed, inProgress, percentage } = progress;

  if (!isUploading && completed === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* En-tête avec compteurs */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">
            Progression des uploads
          </h3>
          <p className="text-sm text-foreground-muted">
            {completed + failed}/{total} photos
            {failed > 0 && <span className="text-red-600 ml-2">({failed} erreur{failed > 1 ? 's' : ''})</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{percentage}%</p>
          {inProgress > 0 && (
            <p className="text-xs text-foreground-muted">
              {inProgress} en cours...
            </p>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Détails avec statut */}
      <div className="flex gap-4 text-sm pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-foreground-muted">
            {completed} réussi{completed !== 1 ? 's' : ''}
          </span>
        </div>
        {inProgress > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-foreground-muted">
              {inProgress} en cours
            </span>
          </div>
        )}
        {failed > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-600">
              {failed} échoué{failed !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Message de fin */}
      {!isUploading && completed + failed === total && (
        <div className={`mt-4 p-4 rounded-lg text-sm font-medium text-center ${
          failed === 0
            ? 'bg-green-50 text-green-700'
            : 'bg-amber-50 text-amber-700'
        }`}>
          {failed === 0
            ? '✓ Tous les uploads sont terminés avec succès !'
            : `⚠ ${failed} photo${failed !== 1 ? 's' : ''} n'a${failed !== 1 ? 'nt' : ''} pas pu être uploadée${failed !== 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  );
}
