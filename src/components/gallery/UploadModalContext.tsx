import { createContext, useContext, ReactNode } from "react";

interface UploadModalContextType {
  onOpenUploadModal: () => void;
}

const UploadModalContext = createContext<UploadModalContextType | undefined>(undefined);

export function UploadModalProvider({ 
  children, 
  onOpenUploadModal 
}: { 
  children: ReactNode; 
  onOpenUploadModal: () => void;
}) {
  return (
    <UploadModalContext.Provider value={{ onOpenUploadModal }}>
      {children}
    </UploadModalContext.Provider>
  );
}

export function useUploadModal() {
  const context = useContext(UploadModalContext);
  if (!context) {
    throw new Error("useUploadModal must be used within UploadModalProvider");
  }
  return context;
}
