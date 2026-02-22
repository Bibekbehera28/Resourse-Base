import React, { useMemo, useState, useEffect, useRef } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { getCachedPdfUrl, setCachedPdfUrl } from "@/utils/pdfCache";

interface PDFViewerProps {
  isOpen: boolean;
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  isOpen,
  pdfUrl,
  title,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [useDirectLoad, setUseDirectLoad] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Convert GitHub raw URL to proxy URL for fetching
  const proxyUrl = useMemo(() => {
    // If it's a GitHub raw URL, use the proxy endpoint
    if (pdfUrl.includes("github.com") && pdfUrl.includes("/raw/")) {
      const encodedUrl = encodeURIComponent(pdfUrl);
      return `/api/pdf-proxy?url=${encodedUrl}`;
    }
    // Otherwise, use the URL directly
    return pdfUrl;
  }, [pdfUrl]);

  // Check cache first, then fetch PDF
  useEffect(() => {
    if (isOpen && proxyUrl) {
      setError(null);
      setLoading(true);

      // Check cache first
      const cachedUrl = getCachedPdfUrl(proxyUrl);
      if (cachedUrl) {
        setBlobUrl(cachedUrl);
        setLoading(false);
        return;
      }

      // Clean up previous blob URL
      if (blobUrlRef.current && blobUrlRef.current !== cachedUrl) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      // Try direct load first (faster), fallback to blob if needed
      if (useDirectLoad) {
        // Set a timeout to check if direct load worked
        const directLoadTimeout = setTimeout(() => {
          setUseDirectLoad(false);
        }, 1500); // Switch to blob after 1.5s if direct load hasn't completed

        return () => clearTimeout(directLoadTimeout);
      }

      // Fetch as blob (fallback method)
      const fetchPdfAsBlob = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

          const response = await fetch(proxyUrl, {
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            try {
              const errorData = await response.json();
              throw new Error(errorData.error || `Failed to fetch PDF (${response.status})`);
            } catch (jsonErr) {
              if (jsonErr instanceof Error && jsonErr.message.includes("Failed to fetch")) {
                throw jsonErr;
              }
              throw new Error(`Failed to fetch PDF (${response.status})`);
            }
          }

          // Use blob() - streams efficiently
          const blob = await response.blob();

          if (blob.size === 0) {
            throw new Error("PDF file is empty");
          }

          // Async validation (non-blocking)
          blob.slice(0, 4).arrayBuffer().then((firstChunk) => {
            if (firstChunk.byteLength >= 4) {
              const uint8Array = new Uint8Array(firstChunk);
              const header = String.fromCharCode(...uint8Array);
              if (header !== "%PDF") {
                setError("Response is not a valid PDF file");
                return;
              }
            }
          }).catch(() => {
            // Ignore validation errors
          });

          // Create blob with correct MIME type
          const pdfBlob = blob.type === "application/pdf" 
            ? blob 
            : new Blob([blob], { type: "application/pdf" });
          
          // Create object URL immediately
          const objectUrl = URL.createObjectURL(pdfBlob);
          blobUrlRef.current = objectUrl;
          setCachedPdfUrl(proxyUrl, objectUrl); // Cache it
          setBlobUrl(objectUrl);
          setLoading(false);
          setError(null);
        } catch (err) {
          setLoading(false);
          if (err instanceof Error && err.name === "AbortError") {
            setError("Request timed out. Please try again.");
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to load PDF. Please try downloading it instead."
            );
          }
        }
      };

      if (!useDirectLoad) {
        fetchPdfAsBlob();
      }

      // Cleanup function
      return () => {
        // Don't revoke cached URLs
        if (blobUrlRef.current && !getCachedPdfUrl(proxyUrl)) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
      };
    } else {
      setBlobUrl(null);
      setUseDirectLoad(true); // Reset for next open
    }
  }, [isOpen, proxyUrl, retryKey, useDirectLoad]);

  const handleLoad = () => {
    // Only hide loading if we're using direct load or blob is ready
    if (useDirectLoad || blobUrl) {
      setLoading(false);
      setError(null);
    }
  };

  const handleError = () => {
    setLoading(false);
    setError("Failed to load PDF. Please try downloading it instead.");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg overflow-hidden shadow-2xl w-full h-[90vh] max-w-5xl flex flex-col border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
          <h2 className="text-lg font-bold text-foreground truncate">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-primary/10 transition-colors text-foreground hover:text-primary"
            aria-label="Close PDF viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-gray-100 relative">
          {/* Try direct load first, fallback to blob */}
          <iframe
            ref={iframeRef}
            src={
              blobUrl 
                ? `${blobUrl}#toolbar=1&navpanes=0`
                : useDirectLoad 
                  ? `${proxyUrl}#toolbar=1&navpanes=0`
                  : undefined
            }
            className="w-full h-full border-none"
            title={title}
            onLoad={handleLoad}
            onError={(e) => {
              // If direct load fails, switch to blob method
              if (useDirectLoad) {
                setUseDirectLoad(false);
              } else {
                handleError();
              }
            }}
            allow="fullscreen"
          />
          
          {/* Loading overlay - only show when actively loading */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-30">
              <div className="flex flex-col items-center gap-4 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">{error}</p>
                  <div className="flex gap-3 justify-center">
                    <a
                      href={pdfUrl}
                      download
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm inline-block"
                    >
                      Download PDF Instead
                    </a>
                    <button
                      onClick={() => {
                        setError(null);
                        setLoading(true);
                        setBlobUrl(null);
                        // Force re-fetch by incrementing retry key
                        setRetryKey(prev => prev + 1);
                      }}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all text-sm"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-card border-t border-border flex justify-end gap-3">
          <a
            href={pdfUrl}
            download
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
          >
            Download PDF
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
