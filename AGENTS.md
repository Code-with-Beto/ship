# Agent Guide — @codewithbeto/ship

> Ship a revenue-ready AI image app this weekend.
> Built by [Code with Beto](https://codewithbeto.dev) — [Platano landing page](https://cwb.sh/platano)

This CLI scaffolds production-ready React Native apps from Code with Beto templates.
Agents **must** use the non-interactive (flag-based) mode — the interactive TUI requires a terminal.

Full documentation: [README.md](./README.md)

## Quick start

```bash
bunx @codewithbeto/ship --name my-app
```

## Flags

| Flag                           | Required | Default              |
| ------------------------------ | -------- | -------------------- |
| `--name <dir>`                 | Yes      | —                    |
| `--template <name>`            | No       | `platano`            |
| `--app-name <name>`            | No       | title-cased `--name` |
| `--bundle-id <id>`             | No       | `com.<user>.<slug>`  |
| `--payments` / `--no-payments` | No       | `--payments`         |
| `--rc-key-ios <key>`           | No       | —                    |
| `--rc-key-android <key>`       | No       | same as iOS key      |
| `--dry-run`                    | No       | —                    |

## What it does

1. Clones the template repo (shallow, then removes `.git`)
2. Configures app name, bundle ID, slug, and payment keys
3. Runs `bun install`
4. Initializes a fresh git repo with baseline commit

## Output

- **stderr** — progress logs (checking access, cloning, configuring)
- **stdout** — structured result on success:

```
name: my-app
app_name: My App
bundle_id: com.beto.my-app
slug: my-app
payments: true
template: platano
directory: my-app
```

## Error handling

Errors go to stderr and exit with code 1. Common failures:

- **Access denied** — user needs Pro access at https://cwb.sh/platano
- **Directory exists** — pick a different `--name`
- **Install failed** — ensure `bun` is available

## After scaffolding

```bash
cd <project-name>
npx expo start
```

## Links

- Course & Pro access: https://cwb.sh/rn
- YouTube: https://cwb.sh/youtube
- Discord: https://cwb.sh/discord
- Newsletter: https://cwb.sh/newsletter
