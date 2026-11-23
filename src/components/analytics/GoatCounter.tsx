import React, { useEffect } from "react";

const GoatCounter: React.FC = () => {
  useEffect(() => {
    const goatCounterId = import.meta.env.VITE_GOAT_COUNTER_ID;
    if (!goatCounterId) {
      return;
    }

    let script: HTMLScriptElement | null = null;
    const inject = () => {
      if (script) return;
      script = document.createElement("script");
      script.src = "//gc.zgo.at/count.js";
      script.async = true;
      script.dataset.goatcounter = `https://${goatCounterId}.goatcounter.com/count`;
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      inject();
    } else {
      window.addEventListener("load", inject);
    }

    return () => {
      window.removeEventListener("load", inject);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default GoatCounter;
