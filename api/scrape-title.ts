export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      signal: AbortSignal.timeout(5000)
    });
    
    const html = await response.text();
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = match ? match[1].trim() : "";
    
    title = title.replace(/Amazon\.com: /i, "")
                 .replace(/ : Electronics/i, "")
                 .replace(/ \| Amazon\.in/i, "")
                 .replace(/ - Buy Online.*/i, "");
                 
    const textSnippet = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .substring(0, 40000);
                 
    return res.status(200).json({ title, textSnippet });
  } catch (error: any) {
    console.error("Scrape error:", error.message);
    return res.status(500).json({ error: "Failed to scrape", details: error.message });
  }
}
