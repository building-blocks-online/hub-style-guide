import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Icon } from '../Icon/Icon';
import './segmented.css';

export interface SegmentedOption {
  value: string;
  label: string;
  /** A Boxicons name without the prefix. Decoration: the label is the name. */
  icon?: string;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  /** Names the choice for screen readers: "Time range", "Theme". */
  label: string;
  defaultValue?: string;
  /** Pass with onChange to control the choice from outside. */
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * A choice of parameter — a time range, a unit, the theme. It changes how the
 * same content is shown. If the choice switches to different content, use Tabs.
 * The ARIA radio group pattern: one tab stop, arrow keys move the choice.
 */
export function Segmented({ options, label, defaultValue, value, onChange }: SegmentedProps) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? '');
  const selected = value ?? internal;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const choose = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = options.findIndex((o) => o.value === selected);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (at + 1) % options.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (at - 1 + options.length) % options.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = options.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const v = options[next].value;
    choose(v);
    refs.current[v]?.focus();
  };

  return (
    <div className="hub-segmented" role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
      {options.map((o) => {
        const on = o.value === selected;
        return (
          <button
            key={o.value}
            ref={(el) => { refs.current[o.value] = el; }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            className="hub-segmented__option"
            onClick={() => choose(o.value)}
          >
            {o.icon ? <Icon name={o.icon} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** The theme control, the same in every app: System, Light, Dark, in that order. */
export const THEME_OPTIONS: SegmentedOption[] = [
  { value: 'system', label: 'System', icon: 'desktop' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
];
