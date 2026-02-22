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

    // Try URLs in parallel and use the first successful one
    const fetchWithQuickCheck = async (urlToTry: string): Promise<Response | null> => {
      try {
        const response = await fetch(urlToTry, {
          headers: {
            "Accept": "application/pdf",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (!response.ok) {
          return null;
        }

        // Quick validation: peek at first 4 bytes (skip for speed if content-type is correct)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/pdf")) {
          // Content-type is PDF, trust it and skip header check for speed
          return response;
        }

        // Only validate header if content-type is uncertain
        const reader = response.body?.getReader();
        if (!reader) {
          return null;
        }

        const { value, done } = await reader.read();
        if (done || !value || value.length < 4) {
          reader.releaseLock();
          return null;
        }

        // Check PDF header
        const header = String.fromCharCode(...value.slice(0, 4));
        if (header !== "%PDF") {
          reader.releaseLock();
          return null;
        }

        // Create a new stream that includes the first chunk
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(value);
            const pump = async () => {
              try {
                while (true) {
                  const { done, value: chunk } = await reader.read();
                  if (done) {
                    controller.close();
                    break;
                  }
                  controller.enqueue(chunk);
                }
              } catch (err) {
                controller.error(err);
              }
            };
            pump();
          },
        });

        return new Response(stream, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch (err) {
        return null;
      }
    };

    // Try all URLs in parallel, use first successful
    const results = await Promise.allSettled(
      urlsToTry.map(url => fetchWithQuickCheck(url))
    );

    let validResponse: Response | null = null;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled" && result.value) {
        validResponse = result.value;
        break;
      }
    }

    if (!validResponse) {
      return res.status(404).json({ 
        error: `Failed to fetch PDF from repository`,
        url: decodedUrl,
        triedUrls: urlsToTry
      });
    }

    // Stream the PDF directly to client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=document.pdf");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Stream the response body
    const reader = validResponse.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: "Response body is null" });
    }

    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            break;
          }
          res.write(Buffer.from(value));
        }
      } catch (err) {
        console.error("Streaming error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming PDF" });
        } else {
          res.end();
        }
      }
    };
    
    pump();
  } catch (error) {
    console.error("Error proxying PDF:", error);
    res.status(500).json({ 
      error: "Failed to proxy PDF",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
