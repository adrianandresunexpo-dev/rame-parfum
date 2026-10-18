import Link from "next/link";

type Props = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "dark" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const styles = {
  gold: "bg-champagne text-white hover:bg-champagne-light shadow-sm",
  dark: "bg-charcoal text-ivory hover:bg-charcoal-soft shadow-sm",
  ghost: "border border-beige bg-white/80 text-charcoal hover:border-champagne hover:text-champagne transition-colors",
};

export function Button({
  href,
  children,
  className = "",
  variant = "dark",
  type = "button",
  disabled,
  onClick,
}: Props) {
  const cls = `inline-flex items-center justify-center px-6 py-3 text-xs tracking-[0.18em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
