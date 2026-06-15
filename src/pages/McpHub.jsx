import { useState, useEffect } from "react";
import {
  Cpu,
  Terminal,
  Play,
  Search,
  Network,
  BookOpen,
  Globe,
  Database,
  Flame,
  Tag,
  PenTool,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingDown,
  DollarSign,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function McpHub() {
  const [mcpStatus, setMcpStatus] = useState("disconnected");

  // Tab Routing inside Unified Control Panel
  const [activeHubTab, setActiveHubTab] = useState("traffic_audit");

  // State for Traffic Audit
  const [minSpend, setMinSpend] = useState(1.0);
  const [minClicks, setMinClicks] = useState(1);
  const [auditResults, setAuditResults] = useState(null);
  const [approvedKeywords, setApprovedKeywords] = useState([]);
  const [auditing, setAuditing] = useState(false);

  // State for Price Audits
  const [priceCategory, setPriceCategory] = useState(
    "boat registration numbers",
  );
  const [maxCompetitors, setMaxCompetitors] = useState(2);
  const [priceResults, setPriceResults] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);

  // State for SEO Copywriter
  const [blogTopic, setBlogTopic] = useState(
    "how to install outdoor building letters",
  );
  const [primaryKeyword, setPrimaryKeyword] = useState(
    "outdoor building letters",
  );
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    "building sign letters, dimensional letters",
  );
  const [copywriterResults, setCopywriterResults] = useState(null);
  const [copywriterLoading, setCopywriterLoading] = useState(false);

  // General server diagnostics
  const [serverLogs, setServerLogs] = useState([
    "Initializing AlphabetSEM cockpit...",
    "Local bridge connected to Express HTTP transport.",
  ]);

  // Heartbeat polling to check if local Express server is online
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/status");
        if (response.ok) {
          const data = await response.json();
          if (data.status === "online") {
            setMcpStatus("connected");
            return true;
          }
        }
        throw new Error();
      } catch {
        setMcpStatus("disconnected");
        return false;
      }
    };

    checkStatus().then((isOnline) => {
      if (isOnline) {
        addLog(
          "🟢 Successfully linked to direct HTTP API. Server responds online.",
        );
      } else {
        addLog(
          "❌ Connection closed. Ensure 'npm start' is running in 'mcp-server/'.",
        );
      }
    });

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setServerLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // 1. Run live Google Ads BigQuery Leak Audit
  const handleRunLeakAudit = async () => {
    setAuditing(true);
    setAuditResults(null);
    addLog("Extracting live search query statistics from BigQuery...");

    try {
      const response = await fetch("http://localhost:3001/api/tools/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "audit_negative_keywords",
          arguments: {
            min_spend: parseFloat(minSpend),
            min_clicks: parseInt(minClicks),
          },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const parsed = JSON.parse(data?.content?.[0]?.text);
      setAuditResults(parsed);
      addLog(
        `🟢 Traffic leak audit completed. Found ${parsed.recommendations?.length || 0} exclusion groups.`,
      );
    } catch (err) {
      addLog(`❌ Audit failed: ${err.message}`);
      alert(`Audit error: ${err.message}`);
    } finally {
      setAuditing(false);
    }
  };

  // 2. Run Autonomous Price Audit
  const handleRunPriceAudit = async () => {
    setPriceLoading(true);
    setPriceResults(null);
    addLog(`Starting competitive pricing audit for: '${priceCategory}'...`);

    try {
      const response = await fetch("http://localhost:3001/api/tools/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "autonomous_pricing_audit",
          arguments: {
            product_category: priceCategory,
            max_competitors_to_scan: parseInt(maxCompetitors),
          },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const parsed = JSON.parse(data?.content?.[0]?.text);
      setPriceResults(parsed);
      addLog("🟢 Competitive pricing compliance scan completed successfully.");
    } catch (err) {
      addLog(`❌ Pricing audit failed: ${err.message}`);
      alert(`Pricing error: ${err.message}`);
    } finally {
      setPriceLoading(false);
    }
  };

  // 3. Run Autonomous SEO Copywriting Agent
  const handleRunCopywriter = async () => {
    setCopywriterLoading(true);
    setCopywriterResults(null);
    addLog(`Triggering Gemini SEO Copywriter for topic: '${blogTopic}'...`);

    try {
      const response = await fetch("http://localhost:3001/api/tools/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "generate_seo_blog_content",
          arguments: {
            blog_topic: blogTopic,
            primary_keyword: primaryKeyword,
            secondary_keywords: secondaryKeywords
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean),
          },
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const parsed = JSON.parse(data?.content?.[0]?.text);
      setCopywriterResults(parsed);
      addLog(
        "🟢 High-ranking blog draft successfully received from Gemini REST endpoints.",
      );
    } catch (err) {
      addLog(`❌ Copywriter failed: ${err.message}`);
      alert(`Copywriter error: ${err.message}`);
    } finally {
      setCopywriterLoading(false);
    }
  };

  const handleApproveExclusion = (recId) => {
    setApprovedKeywords([...approvedKeywords, recId]);
    addLog(`Approved keyword exclusion group: '${recId}'`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="h-7 w-7 text-blue-600 shrink-0" />
            AlphabetSEM Elite Command Center
          </h1>
          <p className="text-slate-500 mt-1">
            Autonomous ad audit alerts, competitor price crawlers, and Gemini
            copywriting engines
          </p>
        </div>

        {/* Live Status */}
        <div
          className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 self-start shadow-sm shrink-0 ${
            mcpStatus === "connected"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${mcpStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
          ></span>
          {mcpStatus === "connected"
            ? "Express/SSE Active Bridge"
            : "Local Server Offline"}
        </div>
      </div>

      {/* Unified Dashboard Tab Rules */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-bold text-slate-400 select-none">
        <button
          onClick={() => setActiveHubTab("traffic_audit")}
          className={`py-3.5 border-b-2 px-1 transition ${
            activeHubTab === "traffic_audit"
              ? "border-blue-600 text-blue-600 font-black"
              : "hover:text-slate-700"
          }`}
        >
          📊 Ads Leak Audit Alerts
        </button>
        <button
          onClick={() => setActiveHubTab("price_audit")}
          className={`py-3.5 border-b-2 px-1 transition ${
            activeHubTab === "price_audit"
              ? "border-blue-600 text-blue-600 font-black"
              : "hover:text-slate-700"
          }`}
        >
          🏷️ Competitor Price Matcher
        </button>
        <button
          onClick={() => setActiveHubTab("copywriter")}
          className={`py-3.5 border-b-2 px-1 transition ${
            activeHubTab === "copywriter"
              ? "border-blue-600 text-blue-600 font-black"
              : "hover:text-slate-700"
          }`}
        >
          ✍️ Content SEO Copywriter
        </button>
        <button
          onClick={() => setActiveHubTab("diagnostics")}
          className={`py-3.5 border-b-2 px-1 transition ${
            activeHubTab === "diagnostics"
              ? "border-blue-600 text-blue-600 font-black"
              : "hover:text-slate-700"
          }`}
        >
          ⚙️ Core Server Diagnostics
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* Tab 1: Google Ads Traffic Auditing */}
        {activeHubTab === "traffic_audit" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Live Traffic Leak Detector
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Queries search metrics in BigQuery, filters spammers, and
                    shields core terms.
                  </p>
                </div>
                <button
                  onClick={handleRunLeakAudit}
                  disabled={auditing || mcpStatus !== "connected"}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition"
                >
                  {auditing ? "Scanning BigQuery..." : "Run Live Traffic Audit"}
                </button>
              </div>

              {/* Slider Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-500 pt-2">
                <div className="space-y-1.5">
                  <span>Minimum Cost To Audit ($)</span>
                  <input
                    type="number"
                    step="0.50"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <span>Minimum Clicks to Check</span>
                  <input
                    type="number"
                    value={minClicks}
                    onChange={(e) => setMinClicks(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {auditResults && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Card: Summary */}
                <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-4 h-full">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Audit summary
                  </span>
                  <h3 className="text-3xl font-black text-blue-400">
                    {auditResults.totalEstimatedSavings}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {auditResults.executiveSummary}
                  </p>
                </div>

                {/* Middle: Exclusion Recommendations */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    Exclusion Recommendations
                  </h3>

                  {auditResults.recommendations?.length === 0 ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center text-xs font-bold text-emerald-800">
                      🟢 All safe! No low-intent leaks matched your spend
                      thresholds.
                    </div>
                  ) : (
                    auditResults.recommendations?.map((rec) => {
                      const isApproved = approvedKeywords.includes(rec.id);
                      return (
                        <div
                          key={rec.id}
                          className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 transition ${
                            isApproved
                              ? "border-emerald-300 opacity-60 bg-emerald-50/10"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900">
                                {rec.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                                {rec.desc}
                              </p>
                            </div>
                            <span className="bg-blue-50 text-blue-700 font-extrabold px-3 py-1 border border-blue-100 rounded-lg text-xs shrink-0">
                              {rec.costSavings}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {rec.negativeKeywordsToApply?.map((kw, i) => (
                              <span
                                key={i}
                                className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            {isApproved ? (
                              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 py-1">
                                <CheckCircle className="h-4 w-4" /> Queued for
                                Google Ads
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApproveExclusion(rec.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs transition"
                              >
                                Approve Exclusion
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Shielded Terms list */}
                  {auditResults.falsePositivesSafety?.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        🛡️ Protected from Exclusions (
                        {auditResults.falsePositivesSafety.length})
                      </h4>
                      <div className="divide-y divide-slate-100 text-xs">
                        {auditResults.falsePositivesSafety.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-2.5 flex justify-between gap-4"
                          >
                            <div>
                              <strong className="text-slate-800 font-bold">
                                "{item.term}"
                              </strong>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {item.reason}
                              </p>
                            </div>
                            <span className="font-mono text-slate-500 shrink-0">
                              {item.cost}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Competitive Pricing Auditor */}
        {activeHubTab === "price_audit" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-950">
                  Autonomous Competitor Price Scraper
                </h2>
                <p className="text-xs text-slate-500">
                  Searches Google, crawls active Page 1 prices, and
                  cross-references your product feed.
                </p>
              </div>
              <button
                onClick={handleRunPriceAudit}
                disabled={priceLoading || mcpStatus !== "connected"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition self-start md:self-center shrink-0"
              >
                {priceLoading ? "Crawling & Scaping..." : "Run Price Audit"}
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
              <div className="space-y-1.5">
                <span>Product Keyword Category</span>
                <input
                  type="text"
                  value={priceCategory}
                  onChange={(e) => setPriceCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <span>Competitors to Scan</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={maxCompetitors}
                  onChange={(e) => setMaxCompetitors(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {priceResults && (
              <div className="space-y-6 animate-fadeIn">
                <div
                  className={`p-4 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                    priceResults.activeUndercutsFound > 0
                      ? "bg-red-50 text-red-800 border-red-100"
                      : "bg-emerald-50 text-emerald-800 border-emerald-100"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{priceResults.statusSummary}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {priceResults.auditComparisons?.map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[9px] font-black uppercase text-slate-400">
                            Competitor audited
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-800 truncate max-w-xs">
                            {match.competitorPage?.title}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded ${
                            match.pricingComparison?.competitivePosition ===
                            "overpriced"
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {match.pricingComparison?.competitivePosition}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs divide-x divide-slate-100">
                        <div>
                          <span className="text-slate-400 font-semibold block">
                            Your Feed Price
                          </span>
                          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
                            {match.pricingComparison?.alphabetSignsPrice}
                          </strong>
                          <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                            {match.alphabetSignsProduct?.id}
                          </span>
                        </div>
                        <div className="pl-3">
                          <span className="text-slate-400 font-semibold block">
                            Competitor Price
                          </span>
                          <strong className="text-slate-900 text-sm font-bold block mt-0.5">
                            {match.pricingComparison?.competitorPrice}
                          </strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-normal">
                        {match.actionableRecommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Autonomous Content Writer */}
        {activeHubTab === "copywriter" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-950">
                  Gemini SEO Copywriter Agent
                </h2>
                <p className="text-xs text-slate-500">
                  Drafts complete, optimized long-form blog articles tailored to
                  search densities.
                </p>
              </div>
              <button
                onClick={handleRunCopywriter}
                disabled={copywriterLoading || mcpStatus !== "connected"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition shrink-0"
              >
                {copywriterLoading
                  ? "Writing Article..."
                  : "Generate SEO Article"}
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-500">
              <div className="space-y-1.5">
                <span>Article Target Topic</span>
                <input
                  type="text"
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <span>Primary Target Keyword</span>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <span>Secondary Keywords</span>
                <input
                  type="text"
                  value={secondaryKeywords}
                  onChange={(e) => setSecondaryKeywords(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {copywriterResults && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                {/* Meta details */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4 h-fit">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    SEO Recommendations
                  </h3>

                  <div className="space-y-3 text-xs text-slate-700 divide-y divide-slate-100">
                    <div className="py-2">
                      <span className="text-slate-400 font-semibold block mb-1">
                        Recommended Title Tag
                      </span>
                      <strong className="text-slate-900 font-bold block bg-slate-50 p-2 rounded border">
                        {copywriterResults.seoMetadata?.titleTag}
                      </strong>
                    </div>
                    <div className="py-2">
                      <span className="text-slate-400 font-semibold block mb-1">
                        Recommended Meta Description
                      </span>
                      <p className="text-slate-600 bg-slate-50 p-2 rounded border leading-relaxed">
                        {copywriterResults.seoMetadata?.metaDescription}
                      </p>
                    </div>
                    <div className="py-2">
                      <span className="text-slate-400 font-semibold block mb-1">
                        Keyword Density Guidance
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {
                          copywriterResults.seoMetadata
                            ?.primaryKeywordDensityRecommendation
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article body */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm prose prose-slate max-w-none prose-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <span className="text-xs text-slate-400 font-semibold">
                      Generated Markdown Draft
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          copywriterResults.blogArticleMarkdown,
                        );
                        alert("Markdown copied to clipboard!");
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      Copy Markdown Code
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed mb-4">
                    {copywriterResults.blogArticleMarkdown}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Diagnostics Node logs console */}
        {activeHubTab === "diagnostics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Connection Specs */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <Network className="h-4 w-4 text-slate-400" /> Connection
                  Specifications
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">
                      Server Target
                    </span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                      http://localhost:3001
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">
                      Transport Layer
                    </span>
                    <span className="font-semibold text-slate-800">
                      Express Direct HTTP API
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">
                      Status Check
                    </span>
                    <span className="font-mono text-slate-700">
                      /api/status
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">
                      Tool Endpoint
                    </span>
                    <span className="font-mono text-slate-700">
                      /api/tools/call
                    </span>
                  </div>
                </div>
              </div>

              {/* Declared Server Tools */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <BookOpen className="h-4 w-4 text-slate-400" /> Active Server
                  Tools
                </h3>

                <div className="space-y-4">
                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        ping_diagnostics
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Pings the local server over standard HTTP direct JSON
                      requests to verify status.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        google_search
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Hits live Google Search via SerpAPI to locate outranking
                      competitor sign sites.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        scrape_competitor
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Scrapes and parses titles, H1 tags, word counts, and
                      JSON-LD schema metadata.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        run_bigquery_query
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Executes custom SQL analysis against live Google Cloud
                      BigQuery warehouses or sandboxes.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        query_firestore
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Fetches active document settings, optimization lists, and
                      heatmaps from Cloud Firestore.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        audit_negative_keywords
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Audits live search query statistics to flag budget leaks
                      and shield core products.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        cross_reference_catalog_pricing
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Scrapes a competitor storefront, parses their price, and
                      maps it against your GMC catalog.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        autonomous_pricing_audit
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      End-to-End Pricing Agent: searches Google, scrapes
                      competitors, and flags direct undercuts.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <strong className="text-xs text-slate-800 font-bold">
                        generate_seo_blog_content
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Autonomous Copywriting: scans competitor densities,
                      prompts Gemini, and drafts long-form SEO copy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column logs */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Terminal className="h-4 w-4 text-slate-400" /> Client
                Diagnostic Logs
              </h3>

              <div className="p-4 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] space-y-1.5 h-96 overflow-y-auto leading-relaxed border border-slate-900 shadow-inner">
                {serverLogs.map((log, index) => (
                  <p key={index} className="truncate">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
