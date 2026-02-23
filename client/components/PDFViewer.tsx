import React, { useMemo, useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

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
}: PDFViewerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Build the iframe src so the browser loads the PDF directly from the API endpoint
  const iframeSrc = useMemo(() => {
    if (!pdfUrl) return "";
    const encodedUrl = encodeURIComponent(pdfUrl);
    return `/api/pdf-proxy?url=${encodedUrl}#toolbar=1`;
  }, [pdfUrl]);

  const handleLoad = () => {
    setLoading(false);
    setError(null);
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
          <iframe
            src={iframeSrc || undefined}
            className="w-full h-full border-none"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
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
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {error}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <a
                      href={pdfUrl}
                      download
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm inline-block"
                    >
                      Download PDF Instead
                    </a>
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
