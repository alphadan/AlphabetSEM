import { useState, useEffect } from "react";
import {
  Search,
  Tag,
  ExternalLink,
  Box,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
  Pencil,
  Archive,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Globe,
  FileText,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import rawProducts from "../../reports/merchant_center/products.json";

export default function ProductHub() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLabel0, setSelectedLabel0] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    if (rawProducts && Array.isArray(rawProducts)) {
      setProducts(rawProducts);
    }
  }, []);

  // Extract unique filter fields
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category.split(" > ")[0]).filter(Boolean)),
  ];
  const customLabels0 = [
    "All",
    ...new Set(
      products.map((p) => p.custom_label_0).filter((l) => l && l !== "N/A"),
    ),
  ].sort();

  // Unified Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.mpn?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.startsWith(selectedCategory);
    const matchesLabel0 =
      selectedLabel0 === "All" || product.custom_label_0 === selectedLabel0;

    return matchesSearch && matchesCategory && matchesLabel0;
  });

  // Paginated Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Centered Truncated Pagination Logic (Shows Current, Previous 2, Next 2 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 w-full px-1">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Box className="h-7 w-7 text-blue-600 shrink-0" />
            Product Catalog Hub
          </h1>
          <p className="text-slate-500 mt-1">
            Live Google Merchant Center Feed Inventory with Search & Metadata
            Insights
          </p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 self-start shadow-sm shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {products.length} Products Loaded
        </div>
      </div>

      {/* Row-Aligned Controls: Structured CSS Grid prevents overflow completely */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-4 items-center w-full max-w-full box-border">
        {/* Search - Span 2 columns on large screens */}
        <div className="relative lg:col-span-2 w-full max-w-full box-border">
          <input
            type="text"
            placeholder="Search catalog by keyword, SKU, or MPN..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm transition box-border"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full max-w-full lg:col-span-1 box-border">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 truncate box-border cursor-pointer"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Label 0 Filter */}
        <div className="flex items-center gap-2 w-full max-w-full lg:col-span-1 box-border">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
            Label 0:
          </span>
          <select
            value={selectedLabel0}
            onChange={(e) => {
              setSelectedLabel0(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 truncate box-border cursor-pointer"
          >
            {customLabels0.map((lbl, i) => (
              <option key={i} value={lbl}>
                {lbl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((prod) => (
          <div
            key={prod.id}
            onClick={() => {
              setSelectedProduct(prod);
              setDetailsExpanded(true);
            }}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-100 p-2">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="object-contain max-h-full max-w-full p-2 group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://www.alphabetsigns.com/mm5/graphics/00000039/130.jpg";
                  }}
                />
                <span className="absolute top-2 right-2 bg-slate-900/80 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  {prod.price}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Tag className="h-3 w-3" /> SKU: {prod.id}
                </span>
                <h3 className="font-extrabold text-slate-950 text-xs line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                  {prod.title}
                </h3>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>
                Label 0:{" "}
                <strong className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {prod.custom_label_0}
                </strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-extrabold ${
                  prod.availability === "in_stock"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-500 border-slate-150"
                }`}
              >
                {prod.availability.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-2">
          <X className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-950">
            No products matched your search filters
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting your keyword query or labels dropdown.
          </p>
        </div>
      )}

      {/* Compact centered Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 bg-white border border-slate-200 p-2 rounded-xl shadow-sm max-w-sm mx-auto">
          {/* First */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg transition"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          {/* Prev */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Visible Page Ranges */}
          <div className="flex items-center gap-1 px-1">
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  currentPage === num
                    ? "bg-blue-600 text-white font-black shadow-md"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {/* Last */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 disabled:opacity-30 rounded-lg transition"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Expanded Product Detail Modal — Styled like Google Merchant Center */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 z-50 animate-fadeIn overflow-hidden">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl max-w-7xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden">
            {/* GMC Top Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 text-sm font-semibold"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-400 hover:text-slate-700" />
                  Product details
                </button>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: Main Specifications (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Main Info Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                    {/* Title & Edit Button Row */}
                    <div className="flex items-start justify-between gap-6 pb-4 border-b border-slate-100">
                      <h2 className="text-lg font-bold text-slate-900 leading-snug">
                        {selectedProduct.title}
                      </h2>
                      <button
                        onClick={() =>
                          alert("Forwarding to Miva Storefront editing page...")
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-md text-xs transition flex items-center gap-1.5 shadow-sm shrink-0"
                      >
                        <Pencil className="h-3 w-3" /> Edit product
                      </button>
                    </div>

                    {/* Details Grid: Left Image, Right Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
                      {/* Image & Thumbnails (2 cols) */}
                      <div className="sm:col-span-2 space-y-4">
                        <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center p-6 hover:shadow-xs transition">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.title}
                            className="object-contain max-h-full max-w-full"
                            onError={(e) => {
                              e.target.src =
                                "https://www.alphabetsigns.com/mm5/graphics/00000039/130.jpg";
                            }}
                          />
                        </div>

                        {/* GMC Style Thumbnails Row */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="aspect-square bg-slate-50 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center p-1.5 cursor-pointer hover:border-blue-400">
                            <img
                              src={selectedProduct.image}
                              className="object-contain max-h-full opacity-60"
                              alt="Alt view 1"
                            />
                          </div>
                          <div className="aspect-square bg-slate-50 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center p-1.5 cursor-pointer hover:border-blue-400">
                            <ImageIcon className="h-4 w-4 text-slate-300" />
                          </div>
                          <div className="aspect-square bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center text-[10px] font-black text-slate-500 cursor-pointer hover:bg-slate-100">
                            <span>+3</span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            alert("Opening product asset manager...")
                          }
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 w-full justify-center"
                        >
                          <ImageIcon className="h-3.5 w-3.5" /> Manage images
                        </button>
                      </div>

                      {/* Specs Table (3 cols) */}
                      <div className="sm:col-span-3 text-xs divide-y divide-slate-100 border border-slate-150 rounded-lg overflow-hidden bg-slate-50/20">
                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Product page on your website
                          </span>
                          <a
                            href={selectedProduct.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all col-span-2 font-medium flex items-center gap-1"
                          >
                            {selectedProduct.link.length > 38
                              ? `${selectedProduct.link.substring(0, 38)}...`
                              : selectedProduct.link}
                            <ExternalLink className="h-3 w-3 inline shrink-0" />
                          </a>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Price
                          </span>
                          <span className="col-span-2 font-bold text-slate-900">
                            {selectedProduct.price}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Availability
                          </span>
                          <div className="col-span-2 flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${selectedProduct.availability === "in_stock" ? "bg-emerald-500" : "bg-red-500"}`}
                            ></span>
                            <span className="font-semibold text-slate-800">
                              {selectedProduct.availability === "in_stock"
                                ? "In stock"
                                : "Out of stock"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Brand
                          </span>
                          <span className="col-span-2 text-slate-800 font-medium">
                            {selectedProduct.brand || "N/A"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            MPN
                          </span>
                          <span className="col-span-2 font-mono text-slate-700 font-medium select-all">
                            {selectedProduct.mpn || "N/A"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            GTIN, UPC, EAN, JAN or ISBN
                          </span>
                          <span className="col-span-2 font-mono text-slate-700 font-medium select-all">
                            {selectedProduct.gtin || "N/A"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Product ID
                          </span>
                          <span className="col-span-2 font-mono text-slate-700 font-bold select-all">
                            {selectedProduct.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Condition
                          </span>
                          <span className="col-span-2 text-slate-800 capitalize font-medium">
                            {selectedProduct.condition || "new"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Color
                          </span>
                          <span className="col-span-2 text-slate-800 font-medium">
                            {selectedProduct.id.startsWith("VL")
                              ? "Black / White / 21 Custom Colors"
                              : "Standard Multi"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1">
                          <span className="text-slate-500 font-medium col-span-1">
                            Size
                          </span>
                          <span className="col-span-2 text-slate-800 font-medium">
                            {selectedProduct.id.startsWith("VL")
                              ? '3" Tall Letter'
                              : "Standard Model"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 p-3 gap-1 col-span-3">
                          <span className="text-slate-500 font-medium col-span-1">
                            Labels
                          </span>
                          <div className="col-span-2 flex flex-wrap gap-1.5 pt-0.5">
                            {selectedProduct.custom_label_0 &&
                              selectedProduct.custom_label_0 !== "N/A" && (
                                <span className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
                                  {selectedProduct.custom_label_0.toLowerCase()}
                                </span>
                              )}
                            {selectedProduct.custom_label_1 &&
                              selectedProduct.custom_label_1 !== "N/A" && (
                                <span className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-100 uppercase">
                                  {selectedProduct.custom_label_1.toLowerCase()}
                                </span>
                              )}
                            {selectedProduct.custom_label_2 &&
                              selectedProduct.custom_label_2 !== "N/A" && (
                                <span className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 capitalize">
                                  {selectedProduct.custom_label_2.toLowerCase()}
                                </span>
                              )}
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                              all
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description Sub-section */}
                    <div className="space-y-2 border-t border-slate-100 pt-5">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Description
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {selectedProduct.description ||
                          "No product description provided in Merchant Center XML."}
                      </p>
                    </div>
                  </div>

                  {/* Accordion Card: Additional Details */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setDetailsExpanded(!detailsExpanded)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition border-b border-slate-100"
                    >
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        Additional details
                      </span>
                      {detailsExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </button>

                    {detailsExpanded && (
                      <div className="text-xs overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <th className="px-6 py-3 w-1/3">Attribute</th>
                              <th className="px-6 py-3">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                custom_label_0
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                {selectedProduct.custom_label_0 || "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                custom_label_1
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                {selectedProduct.custom_label_1 || "N/A"}
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                custom_label_2
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                {selectedProduct.custom_label_2 || "N/A"}
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                custom_label_3
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                All
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                expiration_date
                              </td>
                              <td className="px-6 py-2.5 text-slate-800 font-mono text-xs">
                                Jul 13, 2026 5:00:00 PM PDT
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                google_product_category
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                2722
                              </td>
                            </tr>

                            {/* GMC Product Details (Technical Specifications specs) */}
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_detail
                              </td>
                              <td className="px-6 py-2.5 font-mono text-slate-600 text-[11px] leading-snug">
                                [product_detail_section_name: Technical Specs,
                                <br />
                                product_detail_attribute_name: Width,
                                <br />
                                product_detail_attribute_value: 18"]
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_detail
                              </td>
                              <td className="px-6 py-2.5 font-mono text-slate-600 text-[11px] leading-snug">
                                [product_detail_section_name: Technical Specs,
                                <br />
                                product_detail_attribute_name: Thickness,
                                <br />
                                product_detail_attribute_value: 0.002" (2 mil)
                                Ultra Thin]
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_detail
                              </td>
                              <td className="px-6 py-2.5 font-mono text-slate-600 text-[11px] leading-snug">
                                [product_detail_section_name: Technical Specs,
                                <br />
                                product_detail_attribute_name: Production
                                Method,
                                <br />
                                product_detail_attribute_value: Computer Plotter
                                Die-Cut]
                              </td>
                            </tr>

                            {/* GMC Product Highlights (AI Summary triggers) */}
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_highlight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                Custom 3" state-compliant letters
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_highlight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                Salt and fresh water proof
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_highlight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                Buy 2 get a 3rd free backup decal
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_highlight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                Over 100+ typography options
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_highlight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                920 verified customer reviews
                              </td>
                            </tr>

                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                product_type
                              </td>
                              <td className="px-6 py-2.5 text-slate-800 font-semibold">
                                {selectedProduct.category}
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                return_policy_label
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                POLR2
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                shipping_label
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                usps
                              </td>
                            </tr>
                            <tr className="bg-slate-50/20 hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                shipping_weight
                              </td>
                              <td className="px-6 py-2.5 text-slate-800">
                                {selectedProduct.shippingWeight || "1"} lbs
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/30">
                              <td className="px-6 py-2.5 font-mono text-slate-500 text-[11px]">
                                ships_from_country
                              </td>
                              <td className="px-6 py-2.5 text-slate-800 uppercase">
                                US
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Status & Preview Controls (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Status & Approvals Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
                    {/* GMC Status Row */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Status
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-extrabold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{" "}
                        Approved
                      </span>
                    </div>

                    {/* Diagnostic Alerts */}
                    <div className="flex items-start gap-2 text-xs">
                      <div className="h-4 w-4 bg-emerald-500 text-white rounded-full flex items-center justify-center p-0.5 shrink-0 mt-0.5 shadow-sm">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-slate-700 font-semibold mt-0.5">
                        This product is showing on Google
                      </span>
                    </div>

                    {/* Visibility Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Visibility preference
                      </span>

                      <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        Show on Google
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                        Show in ads
                      </label>
                    </div>

                    {/* Miniature Google Shopping Ad Preview */}
                    <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/40 text-center space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                        Shopping Ad Preview
                      </span>

                      {/* Miniature Card */}
                      <div className="bg-white border border-slate-200 rounded-lg p-3 w-full max-w-[170px] mx-auto text-left shadow-xs space-y-1">
                        <div className="aspect-square bg-slate-50 rounded flex items-center justify-center p-1 overflow-hidden h-28 border border-slate-100">
                          <img
                            src={selectedProduct.image}
                            className="object-contain max-h-full"
                            alt="Preview Thumbnail"
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block truncate">
                          {selectedProduct.brand || "Alphabet Signs"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-800 line-clamp-2 leading-tight h-7">
                          {selectedProduct.title}
                        </span>
                        <span className="text-xs font-black text-slate-900 block mt-1">
                          {selectedProduct.price}
                        </span>
                        <span className="text-[9px] font-extrabold text-emerald-600 uppercase block tracking-wide">
                          In stock
                        </span>
                      </div>
                    </div>

                    {/* Marketing Metadata */}
                    <div className="space-y-3 divide-y divide-slate-100 text-xs text-slate-700 pt-2 font-medium">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">
                          Marketing methods
                        </span>
                        <span className="text-slate-800 font-bold">
                          Free listings, Shopping ads, +1
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-slate-300" />{" "}
                          Countries
                        </span>
                        <span className="text-slate-800 font-bold">
                          United States
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold">
                          Last update
                        </span>
                        <span className="text-slate-800 font-bold">
                          11 hrs ago
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-slate-300" />{" "}
                          Source
                        </span>
                        <span className="text-slate-800 font-bold">
                          File (Merchant XML)
                        </span>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <button
                        onClick={() =>
                          alert(
                            "Product archiving feature will require writing a Firebase Firestore Cloud Function to store archived status.",
                          )
                        }
                        className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Archive className="h-3.5 w-3.5 text-slate-400" />{" "}
                        Archive product
                      </button>

                      <div className="flex items-start gap-1.5 text-[10px] text-slate-400 font-semibold leading-relaxed">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                        <span>
                          You can't delete this product from Merchant Center
                          since it's actively pulling from your XML storefront
                          feed.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition"
              >
                Close details
              </button>
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                View on Storefront <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
