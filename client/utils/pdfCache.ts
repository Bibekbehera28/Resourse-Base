// Simple in-memory cache for PDF blob URLs
const pdfCache = new Map<string, string>();

export const getCachedPdfUrl = (url: string): string | null => {
  return pdfCache.get(url) || null;
};

export const setCachedPdfUrl = (url: string, blobUrl: string): void => {
  pdfCache.set(url, blobUrl);
};

export const clearCache = (): void => {
  // Revoke all object URLs before clearing
  pdfCache.forEach((blobUrl) => {
    try {
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Ignore errors
    }
  });
  pdfCache.clear();
};
