import { useEffect } from 'react';

export const useDocumentEvent = <K extends keyof DocumentEventMap>(event: K, onClick: (e: DocumentEventMap[K]) => void, deps: any[] = []) => {
  useEffect(() => {
    document.addEventListener(event, onClick);
    return () => document.removeEventListener(event, onClick);
  }, [event, ...deps]);
};
