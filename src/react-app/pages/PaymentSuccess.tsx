import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Button } from "@/react-app/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const Confetti = ({ onRef }: { onRef: (ref: { launch: () => void }) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const colors = [
    "#8b5cf6", // purple
    "#624CAB", // NexteraAI purple
    "#a855f7", // lighter purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // orange
  ];

  const createParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: ConfettiParticle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const velocity = 3 + Math.random() * 5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    particlesRef.current = particles;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2;
      particle.rotation += particle.rotationSpeed;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();

      return particle.y < canvas.height + 10;
    });

    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const launch = () => {
    createParticles();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animate();
  };

  useEffect(() => {
    if (onRef) {
      onRef({ launch });
    }
  }, [onRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [plan, setPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const confettiRef = useRef<{ launch: () => void }>(null);

  useEffect(() => {
    const savedPlan = sessionStorage.getItem("selectedPlan");
    const savedBilling = sessionStorage.getItem("billingPeriod");
    if (savedPlan) setPlan(savedPlan);
    if (savedBilling) setBillingPeriod(savedBilling);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      confettiRef.current?.launch();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (paymentId) {
      navigate("/register?payment_id=" + paymentId);
    } else {
      navigate("/dashboard");
    }
  };

  const getAmount = () => {
    if (plan === "starter") return billingPeriod === "monthly" ? "R499/mo" : "R4,999/yr";
    if (plan === "professional") return billingPeriod === "monthly" ? "R899/mo" : "R8,999/yr";
    if (plan === "enterprise") return billingPeriod === "monthly" ? "R1,499/mo" : "R14,999/yr";
    return "R0.00";
  };

  const transactionId = "TXN-" + Date.now().toString().slice(-8);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0A0A0A] via-[#141218] to-[#1E1B24] flex items-center justify-center p-4">
      <Confetti onRef={(ref) => (confettiRef.current = ref)} />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className={`w-full max-w-md transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-[#141218]">
          <div className="p-8 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className={`relative w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center transition-all duration-500 delay-200 ${
                isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}>
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground">
                Your transaction has been completed successfully
              </p>
            </div>

            {/* Amount */}
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-primary">
                {getAmount()}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3 bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Transaction ID
                </span>
                <span className="text-sm font-medium text-white">
                  {transactionId}
                </span>
              </div>
              <div className="h-px bg-primary/20" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <span className="text-sm font-medium text-white">
                  PayFast
                </span>
              </div>
              <div className="h-px bg-primary/20" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleContinue}
                className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
                  Create Admin Account
                </span>
                <div className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-white/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </Button>

              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10 text-white"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-center text-muted-foreground pt-2">
              A confirmation email has been sent to your registered email
              address
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
