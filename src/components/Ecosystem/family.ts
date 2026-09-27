import type { HubApp } from './Ecosystem';

/** An example family of apps for the stories. Every app lists the same apps, in the same order. */
export const FAMILY: HubApp[] = [
  { id: 'home', name: 'Home', description: 'Every app, its health and who owns it', glyph: 'planet', href: '#home', status: 'ok' },
  { id: 'sources', name: 'Sources', description: 'Where the numbers come from', glyph: 'data', href: '#sources', status: 'ok' },
  { id: 'graphs', name: 'Graphs', description: 'Clean and join the numbers', glyph: 'git-branch', href: '#graphs', status: 'warn' },
  { id: 'dashboards', name: 'Dashboards', description: 'Where people read them', glyph: 'bar-chart-alt-2', href: '#dashboards', status: 'ok' },
  { id: 'archive', name: 'Archive', description: 'Every run, kept and verifiable', glyph: 'archive', href: '#archive', status: 'unknown' },
];
