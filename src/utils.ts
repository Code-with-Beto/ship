export function openBrowser(url: string) {
  Bun.spawn(["open", url]);
}

export async function checkGitAccess(repoUrl: string): Promise<boolean> {
  const proc = Bun.spawn(["git", "ls-remote", repoUrl, "HEAD"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  const code = await proc.exited;
  return code === 0;
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

export async function diagnoseGitSetup(
  repoUrl: string,
): Promise<GitDiagnosisStatus> {
  const gitCheck = Bun.spawn(["git", "--version"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  if ((await gitCheck.exited) !== 0) return "no-git";

  const ghCheck = Bun.spawn(["gh", "--version"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  if ((await ghCheck.exited) !== 0) return "no-gh";

  const authCheck = Bun.spawn(["gh", "auth", "status"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  if ((await authCheck.exited) !== 0) return "gh-not-authenticated";

  const accessCheck = Bun.spawn(["git", "ls-remote", repoUrl, "HEAD"], {
    stdout: "ignore",
    stderr: "ignore",
  });
  if ((await accessCheck.exited) === 0) return "ready";

  const ownerRepo = parseGitHubRepo(repoUrl);
  if (ownerRepo) {
    const repoCheck = Bun.spawn(
      ["gh", "repo", "view", ownerRepo, "--json", "name"],
      { stdout: "ignore", stderr: "ignore" },
    );
    if ((await repoCheck.exited) === 0) return "git-credential-issue";
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
