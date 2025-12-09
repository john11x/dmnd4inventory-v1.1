"use client";
import { useEffect } from "react";

const ENABLE = process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";

export default function RealtimeProvider({ children }) {
  useEffect(() => {
    if (!ENABLE) return;
    const es = new EventSource("/api/stream"); // if backend SSE route exists
    es.onmessage = (e) => {
      try {
        const obj = JSON.parse(e.data);
        window.dispatchEvent(new CustomEvent(obj.type || "realtime", { detail: obj }));
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);
  return children;
}
