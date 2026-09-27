import type { HTMLAttributes, ReactNode } from 'react';
import './tag.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/** A category — a client, a segment, a type. Lined, never filled, never coloured. */
export function Tag({ className, children, ...rest }: TagProps) {
  return (
    <span className={['hub-tag', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </span>
  );
}

export interface TagListProps {
  tags: string[];
  /** How many to show before collapsing the rest into "+n". Three by default. */
  max?: number;
  /** Names the set for screen readers, e.g. "Goals". */
  label?: string;
}

/** At most `max` tags, then one "+n" tag. The full set belongs on the thing's own page. */
export function TagList({ tags, max = 3, label }: TagListProps) {
  const shown = tags.slice(0, max);
  const rest = tags.length - shown.length;
  return (
    <ul className="hub-tags" aria-label={label}>
      {shown.map((t) => <li key={t}><Tag>{t}</Tag></li>)}
      {rest > 0 ? <li><Tag title={tags.slice(max).join(', ')} aria-label={`${rest} more`}>+{rest}</Tag></li> : null}
    </ul>
  );
}
