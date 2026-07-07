const headlines = [
  "CA Number Decals For Trucks",
  "GVW Weight Stickers",
  "MC Number Decals",
  "Not For Hire Stickers",
  "CA DOT Number Decals",
  "Commercial GVW Stickers",
  "Not For Hire Decals",
  "Truck Regulation Decals",
  "100% DOT Compliant Decals",
  "Official CA Number Stickers",
  "Durable GVW Weight Decals",
  "Custom Commercial Markings",
  "Heavy-Duty Compliance Decals",
  "Ships Within 24 Hours",
  "Easy-to-Apply Vinyl Decals"
];

const descriptions = [
  "Custom CA Numbers, MC Decals, GVW Weight Stickers & Not For Hire Signs. Made in the USA.",
  "Durable weatherproof regulation markings for commercial trucks. 100% DOT compliant.",
  "Buy heavy-duty CA number decals, GVW stickers & compliance graphics. Ships in 24 hours.",
  "Professional-grade exterior vinyl decals for truck regulations and highway compliance."
];

console.log("=== GOOGLE ADS REGULATION HEADLINE VERIFICATION (Max 30 Chars) ===");
headlines.forEach((h, i) => {
  const len = h.length;
  console.log(`${i + 1}. [${len} Chars] "${h}" - ${len <= 30 ? "PASSED" : "FAILED! TOO LONG"}`);
});

console.log("\n=== GOOGLE ADS REGULATION DESCRIPTION VERIFICATION (Max 90 Chars) ===");
descriptions.forEach((d, i) => {
  const len = d.length;
  console.log(`${i + 1}. [${len} Chars] "${d}" - ${len <= 90 ? "PASSED" : "FAILED! TOO LONG"}`);
});
