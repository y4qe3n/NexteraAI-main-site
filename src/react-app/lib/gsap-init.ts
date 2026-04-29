import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);
  if ("fonts" in document && document.fonts?.ready) {
    document.fonts.ready.then(refresh);
  }
  setTimeout(refresh, 600);
}

export { gsap, ScrollTrigger };
