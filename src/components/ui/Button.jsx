import { cn } from "../../utils/cn";

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-[#050d1a] hover:bg-teal-400 shadow-[0_0_15px_rgba(0,212,170,0.3)] hover:shadow-[0_0_25px_rgba(0,212,170,0.5)]",
    secondary: "bg-surface-elevated text-text hover:bg-surface-elevated/80 border border-white/10",
    ghost: "bg-transparent text-text hover:bg-white/5",
    danger: "bg-danger text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "h-9 px-4 py-2 text-sm",
    md: "h-11 px-6 py-2 text-base",
    lg: "h-14 px-8 py-3 text-lg",
    icon: "h-11 w-11",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
}
