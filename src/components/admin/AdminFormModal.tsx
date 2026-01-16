"use client";

import { ReactNode, FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Title } from "../ui";

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  submitLabel?: string;
  isFormWrapper?: boolean;
}

export function AdminFormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isLoading = false,
  submitLabel = "Créer",
  isFormWrapper = true,
}: AdminFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 sm:bg-black/40 sm:flex sm:items-center sm:justify-center z-50"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 sm:relative sm:bottom-auto w-full sm:w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        data-modal-content
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          [data-modal-content] {
            animation: slideUp 0.3s ease-out forwards;
          }
          @media (min-width: 640px) {
            [data-modal-content] {
              animation: fadeIn 0.3s ease-out forwards !important;
            }
          }
        `}</style>

        {/* En-tête du modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl sm:rounded-t-0">
          <Title level="h5" align="left" className="m-0">
            {title}
          </Title>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Form content */}
        {isFormWrapper ? (
          <form onSubmit={onSubmit} className="flex flex-col h-full">
            <div className="p-6 sm:p-8 pb-12 sm:pb-8 space-y-4 flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Form buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-2 justify-end">
              <Button type="submit" disabled={isLoading}>
                {submitLabel}
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors uppercase text-xxs 2xl:text-xs font-semibold tracking-wider"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="p-6 sm:p-8 pb-12 sm:pb-8 space-y-4 flex-1 overflow-y-auto">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
