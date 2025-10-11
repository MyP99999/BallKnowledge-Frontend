import { useEffect, useRef } from "react";

export const BottomAd = ({ adClient, adSlot }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log("✅ Bottom ad rendered");
        }
      } catch (err) {
        console.error("❌ Ad render error:", err);
      }
    };

    if (typeof window !== "undefined") {
      if (!window.adsbygoogle) {
        const script = document.createElement("script");
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.onload = loadAd;
        document.head.appendChild(script);
      } else {
        loadAd();
      }
    }
  }, []);

  return (
    <div
      className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-green-900/90 border-t border-yellow-500/40 backdrop-blur-md flex justify-center items-center"
      style={{ minHeight: "60px" }}
    >
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{
          display: "inline-block",
          width: "95vw",
          height: "50px",
          background: "#222", // visible fallback for testing
        }}
        data-ad-client={adClient || "ca-pub-3940256099942544"} // ✅ test client
        data-ad-slot={adSlot || "1510445126"} // ✅ test slot
      ></ins>
    </div>
  );
};
