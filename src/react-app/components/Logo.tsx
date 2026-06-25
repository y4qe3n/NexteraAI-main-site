interface LogoProps {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  aiClassName?: string;
  onClick?: () => void;
}

export function Logo({ className = "", markClassName = "", wordmarkClassName = "", aiClassName = "", onClick }: LogoProps) {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={onClick}
    >
      <img src="/favlogo.svg" alt="NexteraAI" className={`w-12 h-12 ml-1 translate-x-1 ${markClassName}`} />
      <span className={`text-xl font-bold tracking-tight select-none ${wordmarkClassName}`}>
        <span className="text-white">Nextera</span>
        <span className={`text-primary ${aiClassName}`}>AI</span>
      </span>
    </div>
  );
}
