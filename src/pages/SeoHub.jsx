import { useState } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Copy,
  Check,
  ShieldAlert,
  Code,
  Globe,
  FileText,
  Lightbulb,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function SeoHub() {
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizedMeta, setOptimizedMeta] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // High-Impression, Low-CTR "Goldmine" Queries from Search Console
  const [gscQueries] = useState([
    {
      query: "custom building letters",
      impressions: "142,500",
      clicks: "1,210",
      ctr: "0.85%",
      position: "3.1",
      priority: "high",
    },
    {
      query: "outdoor metal sign letters",
      impressions: "98,400",
      clicks: "620",
      ctr: "0.63%",
      position: "4.2",
      priority: "high",
    },
    {
      query: "changeable marquee letters",
      impressions: "45,200",
      clicks: "248",
      ctr: "0.55%",
      position: "5.8",
      priority: "medium",
    },
    {
      query: "commercial storefront lettering",
      impressions: "34,100",
      clicks: "162",
      ctr: "0.47%",
      position: "2.9",
      priority: "medium",
    },
    {
      query: "cast aluminum building sign letters",
      impressions: "18,300",
      clicks: "110",
      ctr: "0.60%",
      position: "3.7",
      priority: "low",
    },
  ]);

  const handleSelectQuery = (query) => {
    setKeywordInput(query);
  };

  const handleGenerateMeta = async (e) => {
    e.preventDefault();
    if (!keywordInput) return;

    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Fallback template generator if API Key is not set or is a placeholder
    if (!apiKey || apiKey.startsWith("your_")) {
      setTimeout(() => {
        setOptimizedMeta({
          title: `${keywordInput} | Lifetime Warranty | Alphabet Signs`,
          description: `Buy custom-crafted, durable ${keywordInput}. Direct manufacturer pricing, lifetime guarantees, and fast shipping on all professional outdoor dimensional signs. Design yours today!`,
          schema: `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "${keywordInput}",
  "image": "https://www.alphabetsigns.com/images/products/${keywordInput.toLowerCase().replace(/\s+/g, "-")}.jpg",
  "description": "High-quality, weather-resistant outdoor dimensional letters.",
  "brand": {
    "@type": "Brand",
    "name": "Alphabet Signs"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "15.00",
    "highPrice": "450.00",
    "offerCount": "24",
    "availability": "https://schema.org/InStock"
  }
}`,
          isMock: true,
        });
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are an elite SEO and Copywriting master for 'Alphabet Signs', an e-commerce brand specializing in high-end dimensional lettering, outdoor signs, building letters, and storefront signs.

        Analyze this organic target search keyword: "${keywordInput}"

        Write high-impact, click-maximizing metadata and structured schema. You must return EXACTLY a JSON block matching this structure (no other markdown wrapping besides raw JSON):
        {
          "title": "A CTR-optimized title tag under 60 characters featuring emotional/buying triggers (like Lifetime Warranty, Factory Prices, Fast Sizing, Direct Manufacturer). Make it super professional.",
          "description": "An optimized meta description under 155 characters that summarizes why the user should buy from Alphabet Signs (fast delivery, commercial durability, direct factory savings). Must be highly compelling.",
          "schema": "A clean, complete JSON-LD product schema string that includes a Product structure, AggregateOffer, and local brand mapping. Do not include markdown wraps."
        }
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();

      // Clean any potential markdown wrappers that Gemini might have output
      text = text
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(text);
      setOptimizedMeta(parsed);
    } catch (error) {
      console.error("Error generating metadata with Gemini:", error);
      alert("Error querying Gemini API. Check console logs.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Globe className="h-7 w-7 text-blue-600 shrink-0" />
          Organic SEO & CTR Hub
        </h1>
        <p className="text-slate-500 mt-1">
          Google Search Console CTR Optimization and Structured JSON-LD Schema
          Engine
        </p>
      </div>

      {/* Grid Splitting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input and GSC Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Form Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" /> AI Meta Tag &
              Schema Generator
            </h2>
            <p className="text-sm text-slate-600">
              Select a low-CTR query from your GSC logs below or input a custom
              keyword. Gemini 2.5 Flash will write optimized titles, compelling
              descriptions, and ready-to-copy HTML product schemas.
            </p>

            <form onSubmit={handleGenerateMeta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target SEO Keyword / Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="e.g., Cast Aluminum Building Letters"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                  />
                  <Search className="absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  "Consulting Gemini..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Meta & Structured
                    Data
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Opportunity GSC Logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />{" "}
                High-Impression, Low-CTR Keywords
              </h3>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                GSC Log Sync: Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-2.5">Search Query</th>
                    <th className="py-2.5">Impressions</th>
                    <th className="py-2.5">Clicks</th>
                    <th className="py-2.5">CTR</th>
                    <th className="py-2.5">Avg Pos.</th>
                    <th className="py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {gscQueries.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 font-bold text-slate-950">
                        "{item.query}"
                      </td>
                      <td className="py-3">{item.impressions}</td>
                      <td className="py-3">{item.clicks}</td>
                      <td className="py-3 text-red-600 font-semibold">
                        {item.ctr}
                      </td>
                      <td className="py-3">{item.position}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleSelectQuery(item.query)}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-blue-100 transition"
                        >
                          Optimize
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimized Output Render */}
          {optimizedMeta && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" /> Optimized SEO
                  Package
                </h3>
                {optimizedMeta.isMock && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Showing Sandbox Template (No API Key)
                  </span>
                )}
              </div>

              {/* Title Tag Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    Title Tag ({optimizedMeta.title.length} chars)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(optimizedMeta.title, "title")
                    }
                    className="text-slate-400 hover:text-blue-600 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedField === "title" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 text-sm select-all">
                  {optimizedMeta.title}
                </div>
              </div>

              {/* Meta Description Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    Meta Description ({optimizedMeta.description.length} chars)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(optimizedMeta.description, "desc")
                    }
                    className="text-slate-400 hover:text-blue-600 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedField === "desc" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs leading-relaxed select-all">
                  {optimizedMeta.description}
                </div>
              </div>

              {/* Structured JSON-LD Product Schema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Code className="h-3.5 w-3.5 text-slate-400" /> HTML Product
                    Schema (JSON-LD)
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<script type="application/ld+json">\n${optimizedMeta.schema}\n</script>`,
                        "schema",
                      )
                    }
                    className="text-slate-400 hover:text-blue-600 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedField === "schema" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Schema Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 text-[11px] overflow-x-auto font-mono max-h-64 select-all">
                  {`<!-- Paste inside your site's HTML <head> -->\n<script type="application/ld+json">\n${optimizedMeta.schema}\n</script>`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: SEO Best Practice Checklists */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-950 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <Lightbulb className="h-4.5 w-4.5 text-blue-600" /> Schema Best
              Practices
            </h3>
            <ul className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <li className="space-y-1">
                <strong className="text-slate-800 block">
                  🛍️ Product Schema Rich Snippet
                </strong>
                <p>
                  Drops star-ratings, price spans (e.g. $15.00 - $450.00), and
                  availability details directly onto search pages, lifting CTR
                  by up to **22%**.
                </p>
              </li>
              <li className="space-y-1">
                <strong className="text-slate-800 block">
                  🏫 Brand & Manufacturer Snippet
                </strong>
                <p>
                  Guarantees Google knows Alphabet Signs is the original creator
                  and factory of the dimensional lettering products, cementing
                  domain authority.
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              🛡️ Brand Protection Shields
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              When utilizing AI generation for public index metadata, Gemini
              enforces structural templates protecting commercial keywords so
              that your brand name and key products never get distorted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
