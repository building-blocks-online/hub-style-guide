#!/usr/bin/env node
/**
 * The switchboard check a Claude Code SessionStart hook runs (spec 172, research R12,
 * contracts/session-start-hook.md). FR-007, SC-004. Orbit's own hook runs it as `orbit`; since spec 179
 * `rig create` writes this same file, byte for byte, to `.claude/switchboard-check.mjs` in every app
 * repository, where `ORBIT_SWITCHBOARD_AS_APP` makes it act for the app (rig's sync-launcher.ts keeps the copy
 * identical).
 *
 * It only FINDS and RUNS `rig switchboard check --hook`; the check itself lives in rig, so there is one
 * implementation of the summary. Dependency-free (plain node:* modules), so it works in a worktree that
 * was never installed — the common case for an orbit session.
 *
 * Candidates, the first that exists and whose `--help` lists `switchboard` (each probed at most once):
 *   1. <repo>/packages/rig-cli/dist/cli.js — this worktree's own build;
 *   2. `rig` on PATH;
 *   3. `npx --yes @orbit/rig-cli@^0.15.0`, spawned with the HOME directory as its working directory:
 *      inside the repository the workspace .npmrc sends @orbit to localhost:4873. That range always has
 *      the command, so npx is not probed (a probe would download the package twice).
 *
 * The environment is passed through unchanged (ORBIT_SWITCHBOARD_AS from .claude/settings.json chooses
 * the profile). The child's stdout is copied; its stderr never is.
 *
 * With `--prompt` (spec 183, a UserPromptSubmit hook) see PROMPT_INTERVAL_MS below: at most every 5 minutes, only what
 * is new, and silence instead of every skip line.
 *
 * ⚠️ It ALWAYS exits 0, prints nothing on stderr for an expected failure, and prints either the check's
 * own (bounded) output or ONE line: `Switchboard check skipped: <reason> — your inbox is unread.`
 * A hook that fails or floods would cost every orbit session its start; a skipped check costs one line.
 * The whole run is bounded at 15 s (the hook's own timeout is 20 s); the child is killed at the deadline.
 */

import { spawn, spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEADLINE_MS = 15_000;
// Spec 183: ^0.18.0 is the first range whose `check` takes `--prompt` (spec 173's ^0.15.0 added the summary file; on
// 0.x a caret fixes the minor, so an older range would never fetch it).
export const NPX_PACKAGE = '@orbit/rig-cli@^0.18.0';
export const CHECK_ARGS = Object.freeze(['switchboard', 'check', '--hook']);

/**
 * Spec 183 — prompt mode (`--prompt`, a UserPromptSubmit hook). The same search for rig, but:
 *   - nothing starts unless the identity's last check is at least PROMPT_INTERVAL_MS old, read from
 *     ~/.orbit/switchboard-prompt.json — the file `rig switchboard check` writes (rig's prompt-record.ts; keep
 *     promptKeyFromEnv in step with its promptKey);
 *   - rig runs with `--prompt`, which prints only what is new, or nothing;
 *   - every skip reason prints NOTHING (the session-start check already said why), and the run is bounded at 10 s.
 */
export const PROMPT_INTERVAL_MS = 5 * 60_000;
export const PROMPT_DEADLINE_MS = 10_000;

/** rig's promptKey from the environment alone: `app:<name>`, the participant name, else `default`. */
export function promptKeyFromEnv(env = process.env) {
  const asApp = env.ORBIT_SWITCHBOARD_AS_APP?.trim();
  if (asApp) return `app:${asApp}`;
  return env.ORBIT_SWITCHBOARD_AS?.trim() || 'default';
}

/** True unless this identity's last check is under PROMPT_INTERVAL_MS old. A missing or unreadable record is due. */
export function promptDue({ env = process.env, home = homedir(), now = Date.now(), read = readFileSync } = {}) {
  try {
    const file = JSON.parse(read(join(home, '.orbit', 'switchboard-prompt.json'), 'utf8'));
    const last = file?.[promptKeyFromEnv(env)]?.lastCheckAt;
    if (typeof last !== 'number') return true;
    return now - last >= PROMPT_INTERVAL_MS || now < last;
  } catch {
    return true;
  }
}

/**
 * Count a prompt-mode attempt that rig did not record itself (no rig, an old rig without `--prompt`, a run killed at the
 * deadline): set this identity's `lastCheckAt`, keeping what it had shown, so the window starts and the next prompts do
 * not each pay for a process. Rig's own record (written when it ran) is left alone. Never throws.
 */
export function stampPromptAttempt({ env = process.env, home = homedir(), now = Date.now() } = {}) {
  try {
    if (!promptDue({ env, home, now })) return; // rig recorded this attempt
    const dir = join(home, '.orbit');
    const path = join(dir, 'switchboard-prompt.json');
    let file = {};
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf8'));
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) file = parsed;
    } catch {
      /* missing or unreadable: start a new file */
    }
    const key = promptKeyFromEnv(env);
    const shown = file[key] && typeof file[key].shown === 'object' && file[key].shown !== null ? file[key].shown : {};
    file[key] = { lastCheckAt: now, shown };
    mkdirSync(dir, { recursive: true });
    const tmp = `${path}.${process.pid}.${now}.tmp`;
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { mode: 0o600 });
    renameSync(tmp, path);
  } catch {
    /* the window simply does not start; the next prompt tries again */
  }
}
/** Defensive cap on what is copied from the child; the check's own output is far smaller. */
export const MAX_OUTPUT_BYTES = 16 * 1024;

export const skipLine = (reason) => `Switchboard check skipped: ${reason} — your inbox is unread.\n`;
export const NOT_INSTALLED = 'rig is not installed (npm i -g @orbit/rig-cli)';
export const TOO_OLD = 'rig has no switchboard command (npm i -g @orbit/rig-cli@latest)';
export const TIMED_OUT = 'timed out';
export const NO_REGISTRY = "@orbit is not mapped to Orbit's registry here (set ORBIT_VERDACCIO_URL or run rig login)";
/** How long reading npm's user config may take (counted before the check's own deadline). */
export const NPM_CONFIG_TIMEOUT_MS = 3_000;

/**
 * Orbit's package registry for the npx fallback, or null when this machine does not map `@orbit` to it.
 *
 * ⚠️ Gate 3 (spec 172): on public npm the `@orbit` scope belongs to someone else. An unattended
 * `npx --yes @orbit/rig-cli` on a machine whose npm config does not map `@orbit` would fetch and run
 * whatever that scope publishes, with the session's environment. So npx is used only when a registry is
 * known — `ORBIT_VERDACCIO_URL`, else the user-level `npm config get @orbit:registry` read from the home
 * directory — that is not the public registry, and it is passed explicitly so resolution cannot fall
 * through. No tenant coordinate is hard-coded.
 */
export function orbitRegistryFor({ env = process.env, home = homedir(), readNpmConfig } = {}) {
  const acceptable = (value) => {
    const v = String(value ?? '').trim();
    if (!v || v === 'undefined' || v === 'null') return null;
    let url;
    try {
      url = new URL(v);
    } catch {
      return null;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (/(^|\.)npmjs\.(org|com)$/i.test(url.hostname)) return null;
    // The parsed form, never the raw string: it is quoted into a cmd line when npx is `npx.cmd`.
    return url.href;
  };
  const fromEnv = acceptable(env.ORBIT_VERDACCIO_URL);
  if (fromEnv) return fromEnv;
  const read = readNpmConfig ?? (() => readUserNpmConfig({ env, home }));
  try {
    return acceptable(read());
  } catch {
    return null;
  }
}

/** `npm config get @orbit:registry` from the home directory (so no workspace .npmrc applies). */
function readUserNpmConfig({ env, home }) {
  const r = spawnSync('npm', ['config', 'get', '@orbit:registry'], {
    cwd: home,
    env,
    encoding: 'utf8',
    timeout: NPM_CONFIG_TIMEOUT_MS,
    windowsHide: true,
    shell: process.platform === 'win32',
  });
  return r.status === 0 ? r.stdout : '';
}

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** The PATH variable, whatever its case (Windows calls it `Path`). */
function pathOf(env) {
  const key = Object.keys(env).find((k) => k.toUpperCase() === 'PATH');
  return key ? env[key] ?? '' : '';
}

/**
 * Find an executable on PATH. On Windows only PATHEXT names count: npm's extension-less `rig` there is a
 * sh script that cmd cannot run.
 */
export function findOnPath(name, { env = process.env, platform = process.platform } = {}) {
  const dirs = pathOf(env).split(platform === 'win32' ? ';' : delimiter).filter(Boolean);
  const exts =
    platform === 'win32'
      ? (env.PATHEXT || env.Pathext || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
      : [''];
  for (const dir of dirs) {
    for (const ext of exts) {
      const full = join(dir, name + ext.toLowerCase());
      try {
        accessSync(full, platform === 'win32' ? constants.F_OK : constants.X_OK);
        return full;
      } catch {
        // not here
      }
    }
  }
  return null;
}

/** npm ships npx-cli.js beside the node binary (Windows) or under its prefix's lib (elsewhere). */
export function findNpxCli({ execPath = process.execPath, exists = existsSync } = {}) {
  const dir = dirname(execPath);
  for (const p of [
    join(dir, 'node_modules', 'npm', 'bin', 'npx-cli.js'),
    join(dir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npx-cli.js'),
  ]) {
    if (exists(p)) return p;
  }
  return null;
}

/**
 * How to run a found program with some arguments. `.cmd`/`.bat` files cannot be spawned without a shell
 * on Windows (Node refuses since the 2024 batch-file fix), so those go through cmd with every part
 * quoted — the arguments are this file's constants, never input, and quoting also keeps cmd from eating
 * the `^` in a version range.
 */
export function invocation(file, args, { platform = process.platform, execPath = process.execPath } = {}) {
  if (/\.(m?js|cjs)$/i.test(file)) return { command: execPath, args: [file, ...args], shell: false };
  if (platform === 'win32' && /\.(cmd|bat)$/i.test(file)) {
    const q = (s) => `"${s}"`;
    return { command: [q(file), ...args.map(q)].join(' '), args: [], shell: true };
  }
  return { command: file, args: [...args], shell: false };
}

/**
 * The candidates, in order, as `{ label, file, prefix, cwd, probe }` (`prefix`: arguments before the
 * check's own). `probe: true` means "only if its
 * `--help` lists switchboard".
 */
export function candidates({
  repoRoot = REPO_ROOT,
  env = process.env,
  platform = process.platform,
  home = homedir(),
  exists = existsSync,
  which = (name) => findOnPath(name, { env, platform }),
  npxCli = () => findNpxCli({ exists }),
  registry = () => orbitRegistryFor({ env, home }),
} = {}) {
  const list = [];
  const built = join(repoRoot, 'packages', 'rig-cli', 'dist', 'cli.js');
  if (exists(built)) list.push({ label: 'worktree rig', file: built, prefix: [], cwd: undefined, probe: true });
  const rig = which('rig');
  if (rig) list.push({ label: 'rig on PATH', file: rig, prefix: [], cwd: undefined, probe: true });
  const npx = npxCli() ?? which('npx');
  if (npx) {
    // `registry` is read only if this candidate is reached (inside the deadline): reading npm's config costs
    // a second of npm start-up that a session with a worktree build or `rig` on PATH should not pay.
    list.push({ label: 'npx', file: npx, prefix: ['--yes', NPX_PACKAGE], cwd: home, probe: false, registry });
  }
  return list;
}

/**
 * Run one program, collecting stdout (stderr is drained and dropped). Resolves
 * `{ code, stdout, timedOut }`; never rejects — a spawn error is `{ code: null, error }`.
 */
export function runChild(spawnImpl, inv, { cwd, env, timeoutMs, killTree }) {
  return new Promise((resolvePromise) => {
    let child;
    try {
      child = spawnImpl(inv.command, inv.args, {
        cwd,
        env,
        shell: inv.shell,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        // Own process group elsewhere, so a timeout can kill npx and what it started.
        detached: process.platform !== 'win32',
      });
    } catch (error) {
      resolvePromise({ code: null, stdout: '', timedOut: false, error });
      return;
    }
    const chunks = [];
    let size = 0;
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolvePromise(result);
    };
    child.stdout?.on('data', (c) => {
      if (size < MAX_OUTPUT_BYTES) chunks.push(c);
      size += c.length;
    });
    child.stderr?.on('data', () => {});
    const text = () => Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8').slice(0, MAX_OUTPUT_BYTES);
    const timer = setTimeout(() => {
      try {
        killTree(child);
      } catch {
        // best effort
      }
      finish({ code: null, stdout: text(), timedOut: true });
    }, Math.max(0, timeoutMs));
    child.on('error', (error) => finish({ code: null, stdout: text(), timedOut: false, error }));
    child.on('close', (code) => finish({ code, stdout: text(), timedOut: false }));
  });
}

/** Kill a child and everything it started. */
export function killTree(child, { platform = process.platform, spawnImpl = spawn } = {}) {
  if (!child || child.pid === undefined) return;
  if (platform === 'win32') {
    spawnImpl('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    return;
  }
  try {
    process.kill(-child.pid, 'SIGKILL');
  } catch {
    child.kill('SIGKILL');
  }
}

/**
 * Decide and run. Resolves the exact text to print — the check's output or one skip line. Never rejects.
 */
export async function runSessionCheck({
  env = process.env,
  platform = process.platform,
  spawnImpl = spawn,
  list = candidates({ env, platform }),
  prompt = false,
  deadlineMs = prompt ? PROMPT_DEADLINE_MS : DEADLINE_MS,
  now = Date.now,
  kill = (child) => killTree(child, { platform }),
  due = () => promptDue({ env, now: now() }),
  stamp = () => stampPromptAttempt({ env, now: now() }),
} = {}) {
  // Prompt mode: inside the window nothing starts; every skip reason is silent.
  if (prompt) {
    if (!due()) return '';
    const text = await runOnce({
      env,
      platform,
      spawnImpl,
      list,
      deadlineMs,
      now,
      kill,
      checkArgs: [...CHECK_ARGS, '--prompt'],
    });
    // An attempt rig did not record still counts (Gate 3, spec 183).
    stamp();
    // rig prints nothing when nothing is new; that, and every launcher skip line, is silence here.
    return text.startsWith('Switchboard check skipped:') ? '' : text;
  }
  return runOnce({ env, platform, spawnImpl, list, deadlineMs, now, kill, checkArgs: CHECK_ARGS });
}

async function runOnce({ env, platform, spawnImpl, list, deadlineMs, now, kill, checkArgs }) {
  try {
    const deadline = now() + deadlineMs;
    let foundAny = false;
    let npxSkipped = false;
    for (const original of list) {
      let c = original;
      if (c.registry) {
        // Never fall through to the public @orbit scope (see orbitRegistryFor).
        const reg = c.registry();
        if (!reg) {
          npxSkipped = true;
          continue;
        }
        c = { ...c, prefix: ['--yes', `--@orbit:registry=${reg}`, ...c.prefix.filter((a) => a !== '--yes')] };
      }
      foundAny = true;
      if (c.probe) {
        const probe = await runChild(spawnImpl, invocation(c.file, ['--help'], { platform }), {
          cwd: c.cwd,
          env,
          timeoutMs: deadline - now(),
          killTree: kill,
        });
        if (probe.timedOut) return skipLine(TIMED_OUT);
        if (!/\bswitchboard\b/.test(probe.stdout)) continue;
      }
      const result = await runChild(spawnImpl, invocation(c.file, [...c.prefix, ...checkArgs], { platform }), {
        cwd: c.cwd,
        env,
        timeoutMs: deadline - now(),
        killTree: kill,
      });
      if (result.timedOut) return skipLine(TIMED_OUT);
      const out = result.stdout.trim();
      if (out) return `${out}\n`;
      if (result.error) return skipLine(`${c.label} could not be started`);
      return skipLine(`${c.label} printed nothing (exit ${result.code})`);
    }
    return skipLine(foundAny ? TOO_OLD : npxSkipped ? NO_REGISTRY : NOT_INSTALLED);
  } catch {
    return skipLine('the launcher failed');
  }
}

async function main() {
  const prompt = process.argv.slice(2).includes('--prompt');
  let text;
  try {
    text = await runSessionCheck({ prompt });
  } catch {
    text = prompt ? '' : skipLine('the launcher failed');
  }
  // Exit explicitly: a child killed at the deadline may leave a grandchild holding a pipe open.
  process.stdout.write(text, () => process.exit(0));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => process.exit(0));
}
