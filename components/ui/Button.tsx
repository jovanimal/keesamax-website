import Link from "next/link";
import { cn } from "@/lib/utils";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "accent" | "outline" | "outline-light" | "ghost";
type ButtonSize = "default" | "sm";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AnchorProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonElProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export type ButtonProps = AnchorProps | ButtonElProps;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-navy-900)] text-white shadow-[0_2px_8px_rgba(15,35,65,0.2)] hover:bg-[var(--color-navy-800)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(15,35,65,0.3)]",
  accent:
    "bg-[var(--color-accent)] text-[var(--color-navy-950)] shadow-[0_2px_8px_rgba(212,165,116,0.3)] hover:bg-[var(--color-accent-dark)] hover:text-white hover:-translate-y-px",
  outline:
    "bg-transparent text-[var(--color-slate-900)] border-[1.5px] border-[var(--color-slate-300)] hover:border-[var(--color-navy-900)] hover:bg-[var(--color-navy-900)] hover:text-white",
  "outline-light":
    "bg-transparent text-white border-[1.5px] border-white/30 hover:bg-white hover:text-[var(--color-navy-900)]",
  ghost:
    "bg-transparent text-[var(--color-slate-900)] hover:text-[var(--color-blue-600)] !px-0",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-[26px] py-[14px] text-[0.9375rem]",
  sm: "px-[18px] py-[10px] text-sm",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] whitespace-nowrap leading-none transition-all duration-[250ms] ease-[var(--ease-brand)] disabled:opacity-70 disabled:cursor-not-allowed";

function buildClass(props: Pick<ButtonStyleProps, "variant" | "size" | "className">): string {
  return cn(
    baseClass,
    variantStyles[props.variant ?? "primary"],
    sizeStyles[props.size ?? "default"],
    props.className,
  );
}

export function Button(props: ButtonProps) {
  if ("href" in props && typeof props.href === "string") {
    const { variant, size, className, children, href, ...anchorRest } = props;
    const composed = buildClass({ variant, size, className });
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={composed} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={composed} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, ...buttonRest } =
    props as ButtonElProps;
  const composed = buildClass({ variant, size, className });
  return (
    <button className={composed} {...buttonRest}>
      {children}
    </button>
  );
}
