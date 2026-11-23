import React, { useEffect } from "react";

const GoatCounter: React.FC = () => {
  useEffect(() => {
    const goatCounterId = import.meta.env.VITE_GOAT_COUNTER_ID;
    if (!goatCounterId) {
      return;
    }

    let script: HTMLScriptElement | null = null;
    const handleLoad = () => {
      script = document.createElement("script");
      script.src = "//gc.zgo.at/count.js";
      script.async = true;
      script.dataset.goatcounter = `https://${goatCounterId}.goatcounter.com/count`;
      document.body.appendChild(script);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default GoatCounter;
