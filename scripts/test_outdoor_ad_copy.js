const headlines = [
  "Outdoor Letters For Buildings",
  "Exterior Building Sign Letters",
  "Commercial Building Letters",
  "Exterior Letters For Buildings",
  "Custom Building Name Letters",
  "Architectural Sign Letters",
  "Durable Building Sign Letters",
  "Lifetime Warranty Sign Letters",
  "Metal & Plastic Building Letters",
  "Commercial Exterior Signage",
  "B2B Custom Building Letters",
  "Weatherproof Outdoor Letters",
  "Official Gemini Letter Dealer",
  "Custom Exterior Sign Letters",
  "Easy-to-Mount Building Signs"
];

const descriptions = [
  "Architectural Grade Outdoor Letters for Commercial Buildings. Lifetime Warranty Included.",
  "Durable, weatherproof sign letters custom-built for business exteriors. Made in the USA.",
  "Shop cast metal, acrylic & molded plastic building letters. Easy installation templates.",
  "Professional-grade exterior letters for commercial building facades. Shipping over $100."
];

console.log("=== GOOGLE ADS OUTDOOR HEADLINE VERIFICATION (Max 30 Chars) ===");
headlines.forEach((h, i) => {
  const len = h.length;
  console.log(`${i + 1}. [${len} Chars] "${h}" - ${len <= 30 ? "PASSED" : "FAILED! TOO LONG"}`);
});

console.log("\n=== GOOGLE ADS OUTDOOR DESCRIPTION VERIFICATION (Max 90 Chars) ===");
descriptions.forEach((d, i) => {
  const len = d.length;
  console.log(`${i + 1}. [${len} Chars] "${d}" - ${len <= 90 ? "PASSED" : "FAILED! TOO LONG"}`);
});
