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
      <img src="/favlogo.svg" alt="NexteraAI" className="w-12 h-12 ml-1 translate-x-1" />
      <span className="text-xl font-bold tracking-tight select-none">
        <span className="text-white">Nextera</span>
        <span className="text-primary">AI</span>
      </span>
    </div>
  );
}
