import { useEffect, useRef } from "react";

export const SideAd = ({ position = "left", adClient, adSlot }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`✅ Side ad (${position}) rendered`);
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
  }, [position]);

  return (
    <div
      className={`hidden xl:block fixed top-1/2 -translate-y-1/2 z-40 ${
        position === "left" ? "left-2" : "right-2"
      }`}
    >
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{
          display: "inline-block",
          width: "150px",
          height: "75vh",
          background: "#222", // fallback visual
        }}
        data-ad-client={adClient || "ca-pub-3940256099942544"} // ✅ test client
        data-ad-slot={adSlot || "1510445126"} // ✅ test ad slot
      ></ins>
    </div>
  );
};
