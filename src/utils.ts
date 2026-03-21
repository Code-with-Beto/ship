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

export async function cloneRepo(
  repoUrl: string,
  name: string
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
