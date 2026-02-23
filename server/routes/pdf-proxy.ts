import { RequestHandler } from "express";

export const handlePdfProxy: RequestHandler = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "PDF URL is required" });
    }

    // Decode the URL (it comes encoded from the client)
    const decodedUrl = decodeURIComponent(url);

    // Validate that the URL is from the allowed GitHub repository
    const allowedDomain = "github.com";
    const allowedRepo = "Bibekbehera28/ResourceBase_Notes";
    
    if (!decodedUrl.includes(allowedDomain) || !decodedUrl.includes(allowedRepo)) {
      console.error("Unauthorized PDF source:", decodedUrl);
      return res.status(403).json({ error: "Unauthorized PDF source" });
    }

    // Try multiple URL formats for reliability (jsDelivr first - usually fastest)
    const urlsToTry: string[] = [];
    
    if (decodedUrl.includes("github.com") && decodedUrl.includes("/raw/")) {
      // Try jsDelivr CDN first (usually fastest and most reliable)
      const jsDelivrUrl = decodedUrl.replace(
        /https:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/([^/]+)\/(.+)/,
        "https://cdn.jsdelivr.net/gh/$1/$2@$3/$4"
      );
      if (jsDelivrUrl !== decodedUrl && jsDelivrUrl.includes("jsdelivr")) {
        urlsToTry.push(jsDelivrUrl);
      }
      
      // Then try raw.githubusercontent.com (faster than github.com/raw)
      const rawUrl = decodedUrl.replace(
        /https:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/(.+)/,
        "https://raw.githubusercontent.com/$1/$2/$3"
      );
      if (rawUrl !== decodedUrl) {
        urlsToTry.push(rawUrl);
      }
      
      // Original URL as fallback
      urlsToTry.push(decodedUrl);
    } else {
      urlsToTry.push(decodedUrl);
    }

    // Fetch the PDF into a single Buffer (no streaming) with global fetch
    const fetchPdfAsBuffer = async (urlToTry: string): Promise<Buffer | null> => {
      try {
        const response = await fetch(urlToTry, {
          headers: {
            Accept: "application/pdf",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          return null;
        }

        const buffer = Buffer.from(arrayBuffer);

        // Basic header validation to ensure it's really a PDF
        const header = buffer.subarray(0, 4).toString("latin1");
        if (header !== "%PDF") {
          return null;
        }

        return buffer;
      } catch {
        return null;
      }
    };

    // Try all URLs in parallel and use the first successful Buffer
    const results = await Promise.all(
      urlsToTry.map((urlToTry) => fetchPdfAsBuffer(urlToTry))
    );

    const pdfBuffer = results.find((buffer) => buffer !== null) as Buffer | null;

    if (!pdfBuffer) {
      return res.status(404).json({
        error: "Failed to fetch PDF from repository",
        url: decodedUrl,
        triedUrls: urlsToTry,
      });
    }

    // Send the PDF directly to the client using a Buffer
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error proxying PDF:", error);
    res.status(500).json({ 
      error: "Failed to proxy PDF",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
