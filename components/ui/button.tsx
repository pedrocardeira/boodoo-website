import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#ff5865] text-white shadow-[0_18px_45px_rgba(255,88,101,0.28)] hover:bg-[#e24752] focus-visible:outline-[#ff5865]",
  secondary:
    "border border-[#f4d5d8] bg-white/85 text-[#30303d] shadow-[0_18px_45px_rgba(48,48,61,0.08)] hover:border-[#ffadb5] hover:text-[#ff5865] focus-visible:outline-[#ff5865]",
  ghost: "text-[#696875] hover:bg-[#ffe3e6] hover:text-[#30303d] focus-visible:outline-[#8e8d98]"
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ className, variant = "primary", children, ...props }: ButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}
