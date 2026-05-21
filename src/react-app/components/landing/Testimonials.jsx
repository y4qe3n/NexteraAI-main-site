import { useEffect, useRef } from "react";
import { gsap } from "@/react-app/lib/gsap-init";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    quote:
      "We replaced five tools with NexteraAI. Our ops got faster and, for the first time, I can sleep knowing we're POPIA compliant.",
  },
  {
    quote:
      "The silent agent caught a ransomware attempt on a sales laptop before I even knew it was happening. It paid for itself in one day.",
  },
  {
    quote:
      "It feels like we just hired a 24/7 security team and a compliance officer for less than a junior admin's salary.",
  },
];

export default function Testimonials() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".test-head > *", {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".test-card", {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".test-grid", start: "top 85%" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} data-testid="testimonials-section" className="relative nx-section">
      <div className="nx-container">
        <div className="test-head text-center max-w-2xl mx-auto">
          <span className="nx-badge mx-auto">Trusted by SMEs across SA</span>
          <h2 className="font-display mt-5 text-white text-4xl md:text-5xl font-semibold leading-[1.05]">
            Business owners who <span className="nx-gradient-text">sleep better</span> at night.
          </h2>
        </div>

        <div className="test-grid mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {REVIEWS.map((review, i) => (
            <figure
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="test-card nx-card p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-[#9F86E8]">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 mt-5 text-[#3a2866]" />
                <blockquote className="mt-3 text-[15px] text-[#D6CAF0] leading-relaxed">
                  "{review.quote}"
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
