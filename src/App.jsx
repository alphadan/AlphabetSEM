import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import GoogleAds from "./pages/GoogleAds";
import SeoHub from "./pages/SeoHub";
import EmailHub from "./pages/EmailHub";
import ProductHub from "./pages/ProductHub";
import HeatmapHub from "./pages/HeatmapHub";
import Help from "./pages/Help";
import McpHub from "./pages/McpHub"; // <-- Imported new page component

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-8 ml-64 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/google-ads" element={<GoogleAds />} />
            <Route path="/seo-hub" element={<SeoHub />} />
            <Route path="/email-hub" element={<EmailHub />} />
            <Route path="/products" element={<ProductHub />} />
            <Route path="/heatmap" element={<HeatmapHub />} />
            <Route path="/mcp-bridge" element={<McpHub />} />{" "}
            {/* <-- Added route here */}
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
