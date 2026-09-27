import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Segmented, THEME_OPTIONS } from '../Segmented/Segmented';

/*
 * The pieces every hub app shares. Their CSS lives in layout.css next to the
 * shell, so an app that imports layout.css draws them identically. A local
 * variant of any of these is a fork, and forks are what make a family of
 * apps look unrelated.
 */

export interface AppMarkProps {
  /** A Boxicons name without the prefix. Without one, the mark shows the initial. */
  glyph?: string;
  /** The app's name; its initial stands in when there is no glyph. */
  name: string;
  size?: 'md' | 'lg';
}

/** An ink tile with the app's glyph: the same in the sidebar, the switcher, the catalog and on sign-in. */
export function AppMark({ glyph, name, size = 'md' }: AppMarkProps) {
  return (
    <span className={size === 'lg' ? 'hub-mark hub-mark--lg' : 'hub-mark'} aria-hidden="true">
      {glyph ? <Icon name={glyph} /> : name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export type AppStatus = 'ok' | 'warn' | 'fail' | 'unknown';

export interface HubApp {
  id: string;
  name: string;
  /** One line on what the app is for. */
  description: string;
  glyph?: string;
  href: string;
  status?: AppStatus;
}

const STATUS_WORDS: Record<AppStatus, string> = {
  ok: 'running normally',
  warn: 'degraded',
  fail: 'down',
  unknown: 'status unknown',
};

export interface AppSwitcherProps {
  apps: HubApp[];
  /** The id of the app you are in. It is drawn as the ink block. */
  current: string;
  /** Opens the sheet on first render — for documentation only. */
  defaultOpen?: boolean;
}

/**
 * A round grid-alt button in the bar that opens a sheet listing every app, in
 * the same order in every app. Built on the native popover attribute, so
 * Escape and a click outside close it with no script.
 */
export function AppSwitcher({ apps, current, defaultOpen = false }: AppSwitcherProps) {
  const id = useId().replace(/:/g, '');
  const sheetId = `hub-switcher-${id}`;
  return (
    <>
      <button type="button" className="hub-btn hub-btn--round" aria-label="Apps" popoverTarget={sheetId}>
        <Icon name="grid-alt" />
      </button>
      <div
        id={sheetId}
        className="hub-switcher"
        popover="auto"
        ref={(el) => { if (el && defaultOpen && !el.matches(':popover-open')) el.showPopover(); }}
      >
        <p className="hub-switcher__label">Apps</p>
        <ul className="hub-switcher__list">
          {apps.map((app) => (
            <li key={app.id}>
              <a className="hub-switcher__app" href={app.href} aria-current={app.id === current ? 'page' : undefined}>
                <AppMark glyph={app.glyph} name={app.name} />
                <span style={{ minWidth: 0 }}>
                  <span className="hub-switcher__name">{app.name}</span>
                  <span className="hub-switcher__desc">{app.description}</span>
                </span>
                {app.status ? (
                  <span className="hub-switcher__status" data-status={app.status} role="img" aria-label={STATUS_WORDS[app.status]} title={STATUS_WORDS[app.status]} />
                ) : <span />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export interface PersonProps {
  /** The display name. When it is missing, the email stands in — once. */
  name?: string;
  email?: string;
  role?: string;
  onSignOut?: () => void;
}

function initialsOf(name?: string, email?: string) {
  const source = (name || email || '?').replace(/@.*/, '');
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

/** The signed-in person, once, at the foot of the sidebar. A neutral disc, never a brand colour. */
export function Person({ name, email, role, onSignOut }: PersonProps) {
  return (
    <div className="hub-shell__me">
      <div className="hub-person">
        <span className="hub-avatar" aria-hidden="true">{initialsOf(name, email)}</span>
        <span className="hub-person__text">
          <span className="hub-person__name">{name || email}</span>
          {role ? <span className="hub-person__role">{role}</span> : null}
        </span>
      </div>
      {onSignOut ? (
        <Button variant="round" aria-label="Sign out" onClick={onSignOut}><Icon name="log-out" /></Button>
      ) : null}
    </div>
  );
}

export interface HelpButtonProps {
  label?: string;
  onClick?: () => void;
}

/**
 * One round ink button, bottom-right, in every app. On canvas pages both
 * bottom corners belong to React Flow, so there it hides itself and the bar
 * carries a round help button instead.
 */
export function HelpButton({ label = 'Feedback', onClick }: HelpButtonProps) {
  return (
    <button type="button" className="hub-help" aria-label={label} onClick={onClick}>
      <Icon name="message-rounded-dots" />
    </button>
  );
}

export interface SignInSheetProps {
  appName: string;
  glyph?: string;
  /** One line on what the app is for. */
  lede: string;
  /** The one action. "Sign in" unless the identity provider has a name people know. */
  actionLabel?: string;
  onSignIn?: () => void;
  /** Where "How it works" goes. Every app has that page. */
  howItWorksHref?: string;
  /** A caption under everything, e.g. that one account opens every app. */
  note?: ReactNode;
}

/**
 * The first screen when signed out, identical in every app: the large mark,
 * the name, one line, the one action at full width, a quiet "How it works",
 * and the theme control.
 */
export function SignInSheet({ appName, glyph, lede, actionLabel = 'Sign in', onSignIn, howItWorksHref = '#how-it-works', note }: SignInSheetProps) {
  const [theme, setTheme] = useState('system');
  return (
    <main className="hub-signin">
      <section className="hub-signin__sheet" aria-labelledby="hub-signin-title">
        <AppMark glyph={glyph} name={appName} size="lg" />
        <h1 className="hub-signin__title" id="hub-signin-title">{appName}</h1>
        <p className="hub-signin__lede">{lede}</p>
        <Button variant="primary" className="hub-signin__action" onClick={onSignIn}>{actionLabel}</Button>
        <a className="hub-btn hub-btn--quiet" href={howItWorksHref}>How it works</a>
        <Segmented label="Theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
        {note ? <p className="hub-signin__note">{note}</p> : null}
      </section>
    </main>
  );
}
