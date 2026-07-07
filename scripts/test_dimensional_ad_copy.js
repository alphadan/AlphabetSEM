const headlines = [
  "Dimensional Sign Letters",
  "Raised Letters For Signs",
  "Raised Lettering Signage",
  "3D Letters For Signs",
  "3D Sign Lettering",
  "Custom Dimensional Letters",
  "Custom Raised Sign Letters",
  "3D Dimensional Letters",
  "3D Building Sign Letters",
  "Lifetime Warranty Sign Letters",
  "Premium Dimensional Signs",
  "Official Gemini Letter Dealer",
  "Easy-to-Mount 3D Letters",
  "Custom Raised Business Signs",
  "Architectural 3D Lettering"
];

const descriptions = [
  "Custom Dimensional & Raised Sign Letters for Business Exerior Signs. Made in the USA.",
  "Premium 3D letters custom-built to elevate your building's exterior. Lifetime Guarantee.",
  "Shop raised lettering in metal, plastic, & acrylic. Free shipping on orders over $100.",
  "Architectural grade dimensional letters for stunning commercial signs. Easy to install."
];

console.log("=== GOOGLE ADS DIMENSIONAL HEADLINE VERIFICATION (Max 30 Chars) ===");
headlines.forEach((h, i) => {
  const len = h.length;
  console.log(`${i + 1}. [${len} Chars] "${h}" - ${len <= 30 ? "PASSED" : "FAILED! TOO LONG"}`);
});

console.log("\n=== GOOGLE ADS DIMENSIONAL DESCRIPTION VERIFICATION (Max 90 Chars) ===");
descriptions.forEach((d, i) => {
  const len = d.length;
  console.log(`${i + 1}. [${len} Chars] "${d}" - ${len <= 90 ? "PASSED" : "FAILED! TOO LONG"}`);
});
