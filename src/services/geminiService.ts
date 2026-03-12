import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function safeParse(text: string) {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    return null;
  }
}

export async function analyzeProduct(url: string) {
  // 1. Fetch the real title and text snippet from our backend proxy
  let realTitle = "";
  let textSnippet = "";
  let productImage = "";
  try {
    const res = await fetch("/api/scrape-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (res.ok) {
      const data = await res.json();
      realTitle = data.title;
      textSnippet = data.textSnippet;
      productImage = data.imageUrl;
    }
  } catch (e) {
    console.error("Failed to fetch title", e);
  }

  // Agent 1: Scraper & Sentiment
  const scraperPrompt = `
    You are a Review Scraper and Sentiment Analysis Agent. 
    The user provided this URL: ${url}
    ${realTitle ? `The actual webpage title for this URL is: "${realTitle}"` : `Extract the product name from the URL slug.`}
    
    Here is a text snippet from the actual webpage:
    ---
    ${textSnippet ? textSnippet.substring(0, 15000) : "No text snippet available."}
    ---
    
    1. Identify the exact product name from the webpage title, URL, and text snippet.
    2. You MUST use the actual product name (e.g., "Sony WH-1000XM4 Headphones"). NEVER return a URL as the product name.
    3. Look closely at the text snippet and extract the EXACT total number of reviews or ratings this product has (e.g., if you see "4,567 ratings", return 4567). If you cannot find the exact number in the text, estimate it based on the product popularity, but prefer the exact number from the text. Provide it as estimatedTotalReviews.
    4. Based on the text snippet (like average star rating, e.g., 4.5 out of 5), estimate the OVERALL sentiment breakdown percentages for ALL reviews (positivePercentage, neutralPercentage, negativePercentage). These three numbers MUST add up to 100. For example, a 4.5-star product might be 80% positive, 10% neutral, 10% negative.
    5. Generate 10 realistic customer reviews for THIS EXACT PRODUCT to act as a representative sample. 
    Include a mix of positive (4-5 stars), neutral (3 stars), and negative (1-2 stars) reviews.
    For each review, provide: id, text, rating, date, and sentiment (Positive, Neutral, or Negative).
    Make the negative reviews focus on specific issues like Sizing, Quality, Packaging, Delivery, Misleading product listing, etc.
  `;

  const scraperResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: scraperPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productName: { type: Type.STRING },
          estimatedTotalReviews: { type: Type.NUMBER },
          sentimentBreakdown: {
            type: Type.OBJECT,
            properties: {
              positivePercentage: { type: Type.NUMBER },
              neutralPercentage: { type: Type.NUMBER },
              negativePercentage: { type: Type.NUMBER }
            },
            required: ["positivePercentage", "neutralPercentage", "negativePercentage"]
          },
          reviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                date: { type: Type.STRING },
                sentiment: { type: Type.STRING }
              },
              required: ["id", "text", "rating", "date", "sentiment"]
            }
          }
        },
        required: ["productName", "estimatedTotalReviews", "sentimentBreakdown", "reviews"]
      }
    }
  });

  const scrapedData = safeParse(scraperResponse.text || "{}") || {};
  const reviews = scrapedData.reviews || [];
  const productName = scrapedData.productName || "Unknown Product";
  const estimatedTotalReviews = scrapedData.estimatedTotalReviews || (Math.floor(Math.random() * 9000) + 1000);
  const sentimentPercentages = scrapedData.sentimentBreakdown || { positivePercentage: 60, neutralPercentage: 20, negativePercentage: 20 };

  if (reviews.length === 0) {
    throw new Error("Failed to generate reviews. Please try again.");
  }

  // Agent 2: Pattern & Insights
  const insightPrompt = `
    You are an Insight Generation and Recommendation Agent.
    Analyze these reviews: ${JSON.stringify(reviews)}
    
    1. Group the complaints from negative/neutral reviews into categories (e.g., Sizing, Quality, Packaging, Delivery, Misleading product listing, Other). Count them and calculate the percentage out of total complaints.
    2. Generate 3 key business insights based on the data.
    3. Generate 3 actionable recommendations for the seller to reduce returns.
    4. Extract the top 5 complaint keywords.
  `;

  const insightResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: insightPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          complaintCategories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                count: { type: Type.NUMBER },
                percentage: { type: Type.NUMBER },
              },
              required: ["category", "count", "percentage"]
            }
          },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          topKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["complaintCategories", "insights", "recommendations", "topKeywords"]
      }
    }
  });

  const insightsAndRecs = safeParse(insightResponse.text || "{}") || {};

  // Compile Final Report
  return {
    productName,
    productUrl: url,
    productImage,
    totalReviews: estimatedTotalReviews,
    sentimentBreakdown: {
      positive: Math.round((sentimentPercentages.positivePercentage / 100) * estimatedTotalReviews),
      neutral: Math.round((sentimentPercentages.neutralPercentage / 100) * estimatedTotalReviews),
      negative: Math.round((sentimentPercentages.negativePercentage / 100) * estimatedTotalReviews),
    },
    complaintCategories: insightsAndRecs.complaintCategories || [],
    insights: insightsAndRecs.insights || [],
    recommendations: insightsAndRecs.recommendations || [],
    topKeywords: insightsAndRecs.topKeywords || []
  };
}
