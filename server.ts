import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/scrape-title", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }
      
      console.log(`Scraping URL: ${url}`);
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      const html = await response.text();
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      let title = match ? match[1].trim() : "";
      
      // Clean up common suffixes
      title = title.replace(/Amazon\.com: /i, "")
                   .replace(/ : Electronics/i, "")
                   .replace(/ \| Amazon\.in/i, "")
                   .replace(/ - Buy Online.*/i, "");
                   
      // Create a text snippet for Gemini to extract exact review counts
      const textSnippet = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .substring(0, 40000);

      // Extract Image
      let imageUrl = "";
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      const twitterImageMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/i);
      const schemaImageMatch = html.match(/itemprop="image" content="([^"]+)"/i);
      
      imageUrl = ogImageMatch ? ogImageMatch[1] : 
                 twitterImageMatch ? twitterImageMatch[1] : 
                 schemaImageMatch ? schemaImageMatch[1] : "";
      
      // Fallback search for common image patterns if metadata fails
      if (!imageUrl) {
        // Try to find image in Amazon's image gallery JSON
        const galleryMatch = html.match(/"(?:hiRes|large)":"([^"]+)"/i);
        if (galleryMatch) {
          imageUrl = galleryMatch[1];
        } else {
          const imgMatch = html.match(/<img[^>]+src="([^"]+(?:jpg|jpeg|png))"[^>]*id="(?:landingImage|main-image|imgBlkFront|p-item-image)"/i);
          if (imgMatch) imageUrl = imgMatch[1];
        }
      }

      console.log(`Extracted title: ${title}`);
      console.log(`Extracted image: ${imageUrl ? 'Success' : 'Failed'}`);
                   
      res.json({ title, textSnippet, imageUrl });
    } catch (error: any) {
      console.error("Scrape error:", error.message);
      res.status(500).json({ error: "Failed to scrape", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
