import { useState, useEffect } from "react";
import {
  Search,
  Tag,
  ExternalLink,
  Box,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
} from "lucide-react";
import rawProducts from "../../reports/merchant_center/products.json";

export default function ProductHub() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLabel0, setSelectedLabel0] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
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
            onClick={() => setSelectedProduct(prod)}
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

      {/* Expanded Product Detail Modal showing ALL Feed properties */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title / Main details */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>

              <div className="sm:col-span-3 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 tracking-wider">
                    AVAILABILITY: {selectedProduct.availability.toUpperCase()}
                  </span>
                  <h2 className="text-lg font-black text-slate-950 leading-tight pt-1">
                    {selectedProduct.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-blue-600 bg-blue-50 px-3.5 py-1 rounded-xl border border-blue-100">
                    {selectedProduct.price}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Condition:{" "}
                    <strong className="text-slate-700 font-bold">
                      {selectedProduct.condition.toUpperCase()}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Catalog Description
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed max-h-32 overflow-y-auto pr-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {selectedProduct.description || "No description provided."}
              </p>
            </div>

            {/* Comprehensive Grid of All Properties */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Info className="h-4 w-4 text-slate-400" /> Full Merchant Feed
                Specifications
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product ID (SKU)
                  </span>
                  <strong className="text-slate-800 break-all select-all">
                    {selectedProduct.id}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    MPN Code
                  </span>
                  <strong className="text-slate-800 select-all">
                    {selectedProduct.mpn}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    GTIN (Barcode)
                  </span>
                  <strong className="text-slate-800 select-all">
                    {selectedProduct.gtin}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Manufacturer Brand
                  </span>
                  <strong className="text-slate-800">
                    {selectedProduct.brand}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Shipping Weight
                  </span>
                  <strong className="text-slate-800">
                    {selectedProduct.shippingWeight}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Est. Shipping Cost
                  </span>
                  <strong className="text-slate-800">
                    {selectedProduct.shippingCost}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Custom Label 0
                  </span>
                  <strong className="text-slate-800 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                    {selectedProduct.custom_label_0}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Custom Label 1
                  </span>
                  <strong className="text-slate-800">
                    {selectedProduct.custom_label_1}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5 col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Custom Label 2
                  </span>
                  <strong className="text-slate-800">
                    {selectedProduct.custom_label_2}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5 col-span-2 md:col-span-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Google Product Category Path
                  </span>
                  <strong className="text-slate-800 block truncate">
                    {selectedProduct.category}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close details
              </button>
              <a
                href={selectedProduct.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
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
