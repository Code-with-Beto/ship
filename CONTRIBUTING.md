# Contributing to Ship

## Tech Stack

- **Runtime:** [Bun](https://bun.sh)
- **UI:** [OpenTUI](https://github.com/anomalyco/opentui) (React reconciler for terminal UIs)
- **Language:** TypeScript with JSX

## Project Structure

```
src/
  index.tsx              Entry point — creates renderer, mounts <App />
  app.tsx                Screen router — manages state machine + navigation
  types.ts               Shared types (Screen, Template) and constants (TEMPLATES, URLS)
  utils.ts               Non-UI helpers (openBrowser, checkGitAccess, cloneRepo)
  hooks/
    use-loading-dots.ts  Animated "..." loading indicator hook
  components/
    header.tsx           Brand header (emoji + ASCII font)
    screen-layout.tsx    Common screen wrapper (column layout + header)
    select-menu.tsx      Reusable branded select menu
  screens/
    welcome.tsx          Template picker
    access-check.tsx     Verifies GitHub repo access
    no-access.tsx        Asks if user is a member
    troubleshoot.tsx     Access troubleshooting steps
    upsell.tsx           Purchase/upgrade CTA
    project-setup.tsx    Project name input + validation
    cloning.tsx          Clone progress
    done.tsx             Success screen with next steps
    error.tsx            Error display with retry option
```

## Screen Flow

```
welcome → access-check → project-setup → cloning → done
                ↓
            no-access
            ↙      ↘
     troubleshoot   upsell
         ↓
    access-check (retry)
```

## Access Check & Clone Logic

Templates live in private repos under the `Code-with-Beto` GitHub org. Access is gated — users must either be org members (Pro tier) or have been granted direct repo access (individual purchase).

**`checkGitAccess(repoUrl)`** — Runs `git ls-remote <repo> HEAD` as a subprocess. Exit code `0` means the user's local git credentials can reach the repo; non-zero means no access. This works because `git ls-remote` authenticates against GitHub using whatever credentials the user has configured (SSH keys, `gh auth`, credential helper, etc.) without cloning anything.

**`cloneRepo(repoUrl, name)`** — Shallow-clones (`--depth 1`) the repo into the given directory, then strips `.git/` so the user starts with a clean, unlinked project. Checks for directory conflicts before cloning.

The flow after a failed access check branches based on user self-identification:
- **"I'm a member"** → troubleshoot screen (check `gh auth login`, org membership, repo permissions) → retry
- **"Not a member"** → upsell screen with links to purchase Platano individually or get Pro access

## Development

```bash
bun install
bun run dev        # runs with --watch
```

## Key Conventions

- **Never call `process.exit()` directly.** Use `renderer.destroy()` via the `useRenderer()` hook. Direct exit leaves the terminal in a broken state.
- **Wrap every screen** in `<ScreenLayout>` for consistent header + layout.
- **Use `<SelectMenu>`** for all option lists — keeps styling consistent.
- **Extract shared logic** into `hooks/` (e.g., `useLoadingDots`).
- **Keep screens simple** — each screen is a single component that receives callbacks as props. All navigation logic lives in `app.tsx`.

## Adding a New Template

Add an entry to `TEMPLATES` in `src/types.ts`:

```ts
{
  name: "My Template",
  description: "Short description",
  repo: "https://github.com/Code-with-Beto/my-template.git",
}
```

The welcome screen and clone flow pick it up automatically.

## Adding a New Screen

1. Create `src/screens/my-screen.tsx` using `<ScreenLayout>`.
2. Add the screen name to the `Screen` type in `src/types.ts`.
3. Add the case to the switch in `src/app.tsx`.
