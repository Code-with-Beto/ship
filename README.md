# @codewithbeto/ship

CLI tool for scaffolding Code with Beto templates.

## Interactive (humans)

```bash
bunx @codewithbeto/ship
```

## Templates

- **Platano** — React Native starter

## Development

```bash
bun install
bun dev
```

## Non-interactive (AI agents)

Pass flags to skip the TUI entirely. Every input is a flag, output is structured text, and errors fail fast with actionable messages.

```bash
# Scaffold with defaults
ship --name my-app

# Full configuration
ship --name my-app --app-name "Cool App" --bundle-id com.me.coolapp --no-payments

# Preview without making changes
ship --name my-app --dry-run

# See all options
ship --help
```

**Key flags:**

| Flag                           | Description                   | Default              |
| ------------------------------ | ----------------------------- | -------------------- |
| `--name <dir>`                 | Project directory (required)  | —                    |
| `--template <name>`            | Template to use               | `platano`            |
| `--app-name <name>`            | Display name for app stores   | title-cased `--name` |
| `--bundle-id <id>`             | Bundle identifier             | `com.<user>.<slug>`  |
| `--payments` / `--no-payments` | Enable RevenueCat             | `--payments`         |
| `--rc-key-ios <key>`           | RevenueCat test key (iOS)     | —                    |
| `--rc-key-android <key>`       | RevenueCat test key (Android) | same as iOS          |
| `--dry-run`                    | Preview without side effects  | —                    |

Progress logs go to stderr, the final result goes to stdout.

## Code with Beto

These packages are part of the [Code with Beto](https://cwb.sh?r=gh) ecosystem. If you're into React Native, check us out:

- [Pro Membership](https://cwb.sh?r=gh) - Courses, private repos, Discord community, and direct access to the team
- [YouTube](https://youtube.com/@codewithbeto) - Free tutorials and content

---

Built with [OpenTUI](https://git.new/create-tui).
