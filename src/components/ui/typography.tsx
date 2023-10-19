export function TypographyH2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`}>
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>{children}</h3>;
}

export function TypographyH4({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>{children}</h4>;
}

export function TypographyP({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>{children}</p>;
}

export function TypographyLarge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
}

export function TypographySmall({ children, className }: { children: React.ReactNode; className?: string }) {
  return <small className={`text-sm font-medium leading-none ${className}`}>{children}</small>;
}

export function TypographyXSmall({ children, className }: { children: React.ReactNode; className?: string }) {
  return <small className={`text-xs md:text-sm font-medium leading-none ${className}`}>{children}</small>;
}

export function TypographyMuted({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}
