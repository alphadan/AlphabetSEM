// Alphabet Signs — Real-time Click Heatmap Tracker for Miva Merchant
(function () {
  // 1. Load Firebase App Compat SDK dynamically from Google's CDN
  const appScript = document.createElement("script");
  appScript.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
  document.head.appendChild(appScript);

  appScript.onload = () => {
    // 2. Load Firebase Firestore Compat SDK dynamically
    const dbScript = document.createElement("script");
    dbScript.src =
      "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";
    document.head.appendChild(dbScript);

    dbScript.onload = () => {
      // 3. Initialize Firebase cleanly using your project credentials
      const firebaseConfig = {
        apiKey: "AIzaSyDm6nJIwN9hqo-qoY-cjhVrE7c7aWQU8F8",
        authDomain: "alphabetsem.firebaseapp.com",
        projectId: "alphabetsem",
      };

      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();

      // 4. Capture storefront mouse clicks in responsive percentages
      document.addEventListener("click", function (e) {
        // Calculates coordinates as percentages to ensure compatibility across mobile, tablet, and desktop!
        const pctX = ((e.pageX / window.innerWidth) * 100).toFixed(2);
        const pctY = (
          (e.pageY / document.documentElement.scrollHeight) *
          100
        ).toFixed(2);

        db.collection("clicks")
          .add({
            x: parseFloat(pctX),
            y: parseFloat(pctY),
            element: e.target.tagName.toLowerCase(),
            id: e.target.id || "none",
            path: window.location.pathname,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .catch((err) => console.error("Tracking upload error:", err));
      });
    };
  };
})();
