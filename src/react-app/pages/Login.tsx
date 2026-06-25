import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Shield } from "lucide-react";
import { Logo } from "@/react-app/components/Logo";
import { useAuth } from "@/react-app/lib/AuthContext";

const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;
    vec2 distortion = centeredUV;

    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);
    float vignette = smoothstep(1.25, 0.18, length(centeredUV));

    fragColor = vec4(u_color * glow * vignette, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function SmokeyBackground({ color = "#624CAB" }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, hovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const startTime = Date.now();
    let frameId = 0;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, (Date.now() - startTime) / 1000);
      gl.uniform2f(
        iMouseLocation,
        mouseRef.current.hovering ? mouseRef.current.x : width / 2,
        mouseRef.current.hovering ? height - mouseRef.current.y : height / 2,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      mouseRef.current.hovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.hovering = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    render();

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [color]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 backdrop-blur-sm" />
    </div>
  );
}

function SecuritySignalPanel() {
  return (
    <section className="relative hidden min-h-[680px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#141218] p-10 text-white shadow-[0_30px_100px_-50px_rgba(98,76,171,0.9)] lg:block">
      <SmokeyBackground color="#624CAB" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(196,181,253,0.2),transparent_28%),linear-gradient(135deg,rgba(20,18,24,0.18),rgba(10,10,10,0.76))]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute left-10 right-10 top-1/2 h-px bg-gradient-to-r from-transparent via-purple-200/60 to-transparent" />
      <div className="absolute bottom-40 left-14 right-16 h-px rotate-[-16deg] bg-gradient-to-r from-[#624CAB] via-purple-200/40 to-transparent" />
      <div className="absolute bottom-60 left-20 right-24 h-px rotate-[19deg] bg-gradient-to-r from-transparent via-[#624CAB] to-purple-100/30" />

      {[
        ["18%", "24%"],
        ["72%", "18%"],
        ["82%", "56%"],
        ["38%", "70%"],
        ["18%", "78%"],
      ].map(([left, top], index) => (
        <span
          key={`${left}-${top}`}
          className="absolute flex h-4 w-4 items-center justify-center rounded-full border border-purple-100/70 bg-[#624CAB] shadow-[0_0_32px_rgba(98,76,171,0.9)]"
          style={{ left, top, animation: `nodePulse 3.8s ease-in-out ${index * 0.34}s infinite` }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      ))}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <Logo
            wordmarkClassName="text-2xl"
            markClassName="h-16 w-16 brightness-0 invert"
            aiClassName="text-white"
          />
          <div className="mt-14 max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-purple-100">Protected workspace</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.05em]">
              Secure access to your cyber operations dashboard.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Monitor endpoints, threats, compliance, and business security from one protected NexteraAI workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {["Endpoint shield", "Threat radar", "Compliance"].map((label) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md">
              <Shield className="h-5 w-5 text-purple-100" />
              <p className="mt-3 text-xs font-medium text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { admin, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin) {
      navigate("/dashboard");
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#624CAB]" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] px-4 py-6 text-white sm:px-6 lg:px-8">
      <SmokeyBackground color="#624CAB" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,76,171,0.34),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(196,181,253,0.12),transparent_30%),rgba(10,10,10,0.78)]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <SecuritySignalPanel />

        <section
          className="mx-auto w-full max-w-md rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-[0_30px_100px_-55px_rgba(98,76,171,0.95)] backdrop-blur-xl sm:p-8"
          aria-labelledby="login-heading"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo
              markClassName="h-14 w-14 brightness-0 invert"
              aiClassName="text-white"
            />
          </div>

          <div className="text-center">
            <h2 id="login-heading" className="text-3xl font-bold tracking-[-0.04em] text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-300">Sign in to your NexteraAI account</p>
          </div>

          {error && (
            <div
              className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-9 space-y-8">
            <div className="relative z-0">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer block w-full appearance-none border-0 border-b-2 border-slate-400/70 bg-transparent px-0 py-2.5 pl-8 text-sm text-white transition focus:border-[#624CAB] focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute top-3 -z-10 flex origin-[0] -translate-y-6 scale-75 items-center gap-2 text-sm text-slate-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-purple-200"
              >
                <Mail className="h-4 w-4" />
                Email
              </label>
            </div>

            <div className="relative z-0">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer block w-full appearance-none border-0 border-b-2 border-slate-400/70 bg-transparent px-0 py-2.5 pl-8 pr-11 text-sm text-white transition focus:border-[#624CAB] focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute top-3 -z-10 flex origin-[0] -translate-y-6 scale-75 items-center gap-2 text-sm text-slate-300 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-purple-200"
              >
                <Lock className="h-4 w-4" />
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute bottom-2 right-0 rounded-md p-2 text-slate-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#624CAB]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center rounded-xl bg-[#624CAB] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#755bc5] focus:outline-none focus:ring-2 focus:ring-[#624CAB] focus:ring-offset-2 focus:ring-offset-[#141218] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-xs leading-5 text-slate-400">
            Protected by enterprise-grade encryption. Access is monitored for suspicious security events.
          </p>
        </section>
      </div>

      <style>{`
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.82; }
          50% { transform: scale(1.28); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
