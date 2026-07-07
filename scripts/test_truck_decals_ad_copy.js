const headlines = [
  "Custom Truck Door Decals",
  "Commercial Truck Decals",
  "Truck Lettering & Decals",
  "Vinyl Lettering For Trucks",
  "Truck Business Name Decals",
  "Custom Truck Magnets",
  "Truck Door Lettering",
  "Durable Vinyl Truck Decals",
  "Professional Truck Signage",
  "Custom Vehicle Door Decals",
  "Heavy-Duty Truck Door Graphics",
  "Weatherproof Truck Stickers",
  "B2B Custom Truck Decals",
  "Ships Within 24 Hours",
  "Easy Peel-and-Stick Decals"
];

const descriptions = [
  "Custom Commercial Truck Decals & Door Lettering. Heavy-Duty Weatherproof Exterior Vinyl.",
  "Design your business name decals and truck door lettering online. Fast 24-hr shipping.",
  "Shop heavy-duty truck door graphics, vinyl lettering & vehicle magnets. Made in the USA.",
  "Professional-grade exterior truck decals for business fleets & commercial vehicles."
];

console.log("=== GOOGLE ADS TRUCK DECALS HEADLINE VERIFICATION (Max 30 Chars) ===");
headlines.forEach((h, i) => {
  const len = h.length;
  console.log(`${i + 1}. [${len} Chars] "${h}" - ${len <= 30 ? "PASSED" : "FAILED! TOO LONG"}`);
});

console.log("\n=== GOOGLE ADS TRUCK DECALS DESCRIPTION VERIFICATION (Max 90 Chars) ===");
descriptions.forEach((d, i) => {
  const len = d.length;
  console.log(`${i + 1}. [${len} Chars] "${d}" - ${len <= 90 ? "PASSED" : "FAILED! TOO LONG"}`);
});
