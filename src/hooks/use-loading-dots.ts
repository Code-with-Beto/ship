import { useState, useEffect } from "react";

export function useLoadingDots(intervalMs = 400) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return dots;
}
