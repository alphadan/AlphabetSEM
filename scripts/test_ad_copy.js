const headlines = [
  "Custom Metal Sign Letters",
  "Metal Letters For Signs",
  "Cast Aluminum Sign Letters",
  "Outdoor Metal Building Letters",
  "Lifetime Guarantee Sign Letters",
  "Flat Cut Metal Sign Letters",
  "Solid Brass & Bronze Letters",
  "Stainless Steel Sign Letters",
  "Brushed Aluminum Letters",
  "Custom Metal Building Signs",
  "Official Gemini Letter Dealer",
  "Durable Exterior Metal Letters",
  "Easy-to-Install Sign Letters",
  "Premium Dimensional Lettering",
  "B2B Custom Metal Signage"
];

const descriptions = [
  "Lifetime Guarantee on All Metal Sign Letters. Proudly Custom Made in the USA.",
  "Custom manufactured exterior letters for business signage. Mounting templates included.",
  "Choose cast aluminum, flat cut metal, brass, bronze & steel. Free shipping over $100.",
  "Architectural grade metal letters for building signs. Durable, rust-free, easy to mount."
];

console.log("=== GOOGLE ADS HEADLINE VERIFICATION (Max 30 Chars) ===");
headlines.forEach((h, i) => {
  const len = h.length;
  console.log(`${i + 1}. [${len} Chars] "${h}" - ${len <= 30 ? "PASSED" : "FAILED! TOO LONG"}`);
});

console.log("\n=== GOOGLE ADS DESCRIPTION VERIFICATION (Max 90 Chars) ===");
descriptions.forEach((d, i) => {
  const len = d.length;
  console.log(`${i + 1}. [${len} Chars] "${d}" - ${len <= 90 ? "PASSED" : "FAILED! TOO LONG"}`);
});
