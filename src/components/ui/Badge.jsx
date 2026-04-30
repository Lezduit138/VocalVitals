import { cn } from "../../utils/cn";

export function Badge({ className, variant = 'default', children, ...props }) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-surface-elevated text-text border border-white/10",
    primary: "bg-primary/20 text-primary border border-primary/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    danger: "bg-danger/20 text-danger border border-danger/30",
    success: "bg-success/20 text-success border border-success/30",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
