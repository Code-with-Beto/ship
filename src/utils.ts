export function openBrowser(url: string) {
  Bun.spawn(["open", url]);
}

export async function checkGitAccess(repoUrl: string): Promise<boolean> {
  return (await spawnAndWait(["git", "ls-remote", repoUrl, "HEAD"])) === 0;
}

export type GitDiagnosisStatus =
  | "ready"
  | "no-git"
  | "no-gh"
  | "gh-not-authenticated"
  | "git-credential-issue"
  | "no-access";

function parseGitHubRepo(url: string): string | null {
  const match = url.match(/github\.com[/:]([^/]+\/[^/.]+)/);
  return match?.[1] ?? null;
}

const SILENT = { stdout: "ignore", stderr: "ignore", stdin: "ignore" } as const;
const SUBPROCESS_TIMEOUT_MS = 15_000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("subprocess timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}

async function spawnAndWait(
  cmd: string[],
  timeoutMs = SUBPROCESS_TIMEOUT_MS,
): Promise<number> {
  const proc = Bun.spawn(cmd, SILENT);
  try {
    return await withTimeout(proc.exited, timeoutMs);
  } catch {
    proc.kill();
    return 1;
  }
}

export async function diagnoseGitSetup(
  repoUrl: string,
): Promise<GitDiagnosisStatus> {
  if ((await spawnAndWait(["git", "--version"])) !== 0) return "no-git";
  if ((await spawnAndWait(["gh", "--version"])) !== 0) return "no-gh";
  if ((await spawnAndWait(["gh", "auth", "status"])) !== 0)
    return "gh-not-authenticated";
  if ((await spawnAndWait(["git", "ls-remote", repoUrl, "HEAD"])) === 0)
    return "ready";

  const ownerRepo = parseGitHubRepo(repoUrl);
  if (ownerRepo) {
    if (
      (await spawnAndWait([
        "gh",
        "repo",
        "view",
        ownerRepo,
        "--json",
        "name",
      ])) === 0
    )
      return "git-credential-issue";
  }

  return "no-access";
}

export async function cloneRepo(
  repoUrl: string,
  name: string,
): Promise<{ ok: boolean; error?: string }> {
  const exists = await Bun.$`test -d ${name}`.nothrow().quiet();
  if (exists.exitCode === 0) {
    return { ok: false, error: `Directory "${name}" already exists` };
  }

  const clone = await Bun.$`git clone ${repoUrl} ${name} --depth 1`
    .nothrow()
    .quiet();
  if (clone.exitCode !== 0) {
    return { ok: false, error: "Failed to clone repository" };
  }

  await Bun.$`rm -rf ${name}/.git`.nothrow().quiet();
  return { ok: true };
}

export async function gitInit(
  projectDir: string,
): Promise<{ ok: boolean; error?: string }> {
  const init = await Bun.$`cd ${projectDir} && git init && git add -A && git commit -m "ship init — powered by Code with Beto"`
    .nothrow()
    .quiet();
  if (init.exitCode !== 0) {
    return { ok: false, error: "Failed to initialize git repository" };
  }
  return { ok: true };
}
