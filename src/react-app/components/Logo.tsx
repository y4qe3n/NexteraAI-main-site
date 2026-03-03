import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className = "", onClick }: LogoProps) {
  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full" />
        <Shield className="relative w-8 h-8 text-primary" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-white">Nextera</span><span className="text-primary">AI</span>
      </span>
    </div>
  );
}
