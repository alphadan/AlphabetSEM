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
  AlertTriangle,
} from "lucide-react";

export default function McpHub() {
  const [mcpStatus, setMcpStatus] = useState("disconnected");
  const [selectedTool, setSelectedTool] = useState("google_search");
  const [searchQuery, setSearchQuery] = useState("outdoor cast metal letters");
  const [scrapeUrl, setScrapeUrl] = useState("https://www.alphabetsigns.com");
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT campaign_name, cost, conversions, roas FROM campaign_performance WHERE cost > 100 ORDER BY roas ASC;",
  );
  const [firestoreCollection, setFirestoreCollection] =
    useState("optimizations");
  const [minSpend, setMinSpend] = useState(1.0);
  const [minClicks, setMinClicks] = useState(1);
  const [numResults, setNumResults] = useState(3);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverLogs, setServerLogs] = useState([
    "Initializing local client...",
    "Ready to bridge to Express Direct HTTP transport.",
  ]);

  // Heartbeat polling to check if local Express server is online
  useEffect(() => {
    addLog("Polling connection status to local MCP Bridge (port 3001)...");

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
        throw new Error("Invalid response status");
      } catch {
        setMcpStatus("disconnected");
        return false;
      }
    };

    // Run first check immediately
    checkStatus().then((isOnline) => {
      if (isOnline) {
        addLog(
          "🟢 Successfully linked to direct HTTP API. Server responds online.",
        );
      } else {
        addLog(
          "❌ Connection failed. Ensure 'npm start' is running in 'mcp-server/'.",
        );
      }
    });

    // Run status poll every 5 seconds
    const interval = setInterval(() => {
      checkStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setServerLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleRunTool = async () => {
    setLoading(true);
    setOutput(null);

    if (mcpStatus !== "connected") {
      alert("Error: Please launch and connect your local MCP Server first.");
      setLoading(false);
      return;
    }

    addLog(`Invoking tool: '${selectedTool}' over direct API...`);

    try {
      let params = {};
      if (selectedTool === "google_search") {
        params = { query: searchQuery, num_results: parseInt(numResults) };
      } else if (selectedTool === "scrape_competitor") {
        params = { url: scrapeUrl };
      } else if (selectedTool === "run_bigquery_query") {
        params = { query: sqlQuery };
      } else if (selectedTool === "query_firestore") {
        params = { collection: firestoreCollection };
      } else if (selectedTool === "audit_negative_keywords") {
        params = {
          min_spend: parseFloat(minSpend),
          min_clicks: parseInt(minClicks),
        };
      }

      // Hit our direct stable execution endpoint
      const response = await fetch("http://localhost:3001/api/tools/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedTool,
          arguments: params,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Server Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const toolOutput = data?.content?.[0]?.text;

      // Try formatting JSON output cleanly
      try {
        const parsed = JSON.parse(toolOutput);
        setOutput(parsed);
      } catch {
        setOutput(
          toolOutput || "Success: Tool executed but returned empty response.",
        );
      }

      addLog(`🟢 Tool '${selectedTool}' executed successfully.`);
    } catch (err) {
      setOutput({ error: err.message });
      addLog(`❌ Tool '${selectedTool}' failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="h-7 w-7 text-blue-600 shrink-0 animate-pulse" />
            Model Context Protocol Command Center
          </h1>
          <p className="text-slate-500 mt-1">
            Secure, real-time tool orchestration and competitor intelligence
            logs
          </p>
        </div>

        {/* Live status badge */}
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
          {mcpStatus === "connected" ? "Local Bridge Active" : "Server Offline"}
        </div>
      </div>

      {/* Grid Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Diagnostics & Available Tools */}
        <div className="lg:col-span-1 space-y-6">
          {/* Server Connection Information */}
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
                <span className="font-medium text-slate-400">Status Check</span>
                <span className="font-mono text-slate-750">/api/status</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-400">
                  Tool Endpoint
                </span>
                <span className="font-mono text-slate-750">
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
                  Pings the local server over standard HTTP direct JSON requests
                  to verify status.
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
                  Scrapes and parses titles, H1 tags, word counts, and JSON-LD
                  schema metadata.
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
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <strong className="text-xs text-slate-800 font-bold">
                    audit_negative_keywords
                  </strong>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Audits live search query statistics to flag budget leaks and
                  shield core products.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Playground Console Controller (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tool Executor Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  MCP Tool Execution Playground
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manually test the AI's background APIs and database schemas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold">
              {/* Selector */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wide">
                  Select MCP Tool
                </span>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="google_search">
                    google_search (Week 2 Live)
                  </option>
                  <option value="scrape_competitor">
                    scrape_competitor (Week 3 Live)
                  </option>
                  <option value="run_bigquery_query">
                    run_bigquery_query (Week 4 Live)
                  </option>
                  <option value="query_firestore">
                    query_firestore (Week 4 Live)
                  </option>
                  <option value="audit_negative_keywords">
                    audit_negative_keywords (Week 5 Live)
                  </option>
                  <option value="ping_diagnostics">
                    ping_diagnostics (Week 1 Live)
                  </option>
                </select>
              </div>

              {/* Arguments Slider/Conditionals */}
              {selectedTool === "google_search" && (
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase tracking-wide block">
                    Organic Results count
                  </span>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={numResults}
                      onChange={(e) => setNumResults(e.target.value)}
                      className="flex-1 h-1 bg-slate-250 rounded-lg appearance-none cursor-pointer text-blue-600"
                    />
                    <span className="bg-slate-100 border px-2 py-0.5 rounded font-bold text-slate-700 shrink-0">
                      {numResults} results
                    </span>
                  </div>
                </div>
              )}

              {/* Arguments for Negative Keyword Audit */}
              {selectedTool === "audit_negative_keywords" && (
                <>
                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wide block">
                      Minimum Wasted Spend
                    </span>
                    <input
                      type="number"
                      step="0.50"
                      min="0.10"
                      value={minSpend}
                      onChange={(e) => setMinSpend(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-bold uppercase tracking-wide block">
                      Minimum Clicks
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={minClicks}
                      onChange={(e) => setMinClicks(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Keyword search bar if Google Search */}
            {selectedTool === "google_search" && (
              <div className="space-y-1.5 text-xs font-semibold">
                <span className="text-slate-400 font-bold uppercase tracking-wide">
                  Keyword Search Query
                </span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter commercial query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Scraper input if Scrape Competitor */}
            {selectedTool === "scrape_competitor" && (
              <div className="space-y-1.5 text-xs font-semibold">
                <span className="text-slate-400 font-bold uppercase tracking-wide">
                  Competitor URL to Scrape
                </span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://example-competitor.com/product-page"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* BigQuery Input */}
            {selectedTool === "run_bigquery_query" && (
              <div className="space-y-1.5 text-xs font-semibold">
                <span className="text-slate-400 font-bold uppercase tracking-wide">
                  SQL Query (BigQuery Warehouse)
                </span>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="SELECT * FROM dataset.table..."
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <Database className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Firestore Input */}
            {selectedTool === "query_firestore" && (
              <div className="space-y-1.5 text-xs font-semibold">
                <span className="text-slate-400 font-bold uppercase tracking-wide">
                  Select Firestore Collection
                </span>
                <div className="relative">
                  <select
                    value={firestoreCollection}
                    onChange={(e) => setFirestoreCollection(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer font-bold text-slate-700"
                  >
                    <option value="optimizations">
                      optimizations (Optimization Log Queue)
                    </option>
                    <option value="heatmaps">
                      heatmaps (Responsive coordinate logs)
                    </option>
                    <option value="settings">
                      settings (Global configurations)
                    </option>
                  </select>
                  <Flame className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleRunTool}
              disabled={loading || mcpStatus !== "connected"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />{" "}
              {loading ? "Executing Run..." : "Execute Tool Run"}
            </button>

            {/* Live Interactive response screen */}
            <div className="space-y-2 border-t border-slate-100 pt-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Terminal className="h-4 w-4 text-slate-400" /> Interactive
                Execution Output
              </span>

              {output ? (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                  {typeof output === "object" ? (
                    <pre>{JSON.stringify(output, null, 2)}</pre>
                  ) : (
                    <p>{output}</p>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400">
                  Select parameters above and click 'Execute Tool Run' to
                  retrieve live JSON packages
                </div>
              )}
            </div>
          </div>

          {/* Running Terminal log audits */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Terminal className="h-4 w-4 text-slate-400" /> Local Client Audit
              Logs
            </h3>

            <div className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[10px] space-y-1.5 max-h-40 overflow-y-auto leading-relaxed border border-slate-900 shadow-inner">
              {serverLogs.map((log, index) => (
                <p key={index} className="truncate">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
