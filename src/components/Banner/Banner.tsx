import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import './banner.css';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

const ICON: Record<BannerTone, string> = {
  info: 'info-circle',
  success: 'check-circle',
  warning: 'error',
  danger: 'error-circle',
};

export interface BannerProps {
  tone?: BannerTone;
  /** What is true, in one line: "Figures are from the 06:00 sweep". */
  title: string;
  /** Why, and what to do — with the fix as a link when there is one. */
  children?: ReactNode;
  /** Shows a round dismiss button. Warning and danger stay until the cause is gone. */
  onDismiss?: () => void;
}

/**
 * A notice about the page or the data on it. Paper, a hairline, the tone on
 * a 3px left edge and in the icon — the same grammar as a toast and an error
 * plate. Never a filled panel of warning colour.
 */
export function Banner({ tone = 'info', title, children, onDismiss }: BannerProps) {
  return (
    <div className="hub-banner" data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className="hub-banner__icon"><Icon name={ICON[tone]} /></span>
      <div className="hub-banner__body">
        <p className="hub-banner__title">{title}</p>
        {children ? <p className="hub-banner__text">{children}</p> : null}
      </div>
      {onDismiss ? (
        <Button variant="round" className="hub-banner__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="x" />
        </Button>
      ) : null}
    </div>
  );
}
