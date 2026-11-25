import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

export function ExternalReference({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      title="Opens in a new tab"
    >
      {children}
      <ExternalLink
        className="external-reference-icon"
        size="0.8em"
        aria-hidden="true"
      />
    </a>
  );
}
