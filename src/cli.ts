import { userInfo } from "node:os";
import pkg from "../package.json";
import { TEMPLATES, URLS, toSlug, toTitleCase, sanitizeUsername } from "./types";
import type { Template, OnboardingResult } from "./types";
import { diagnoseGitSetup, cloneRepo } from "./utils";
import { configureProject } from "./configure";
import { track, trackAndWait } from "./tracking";

const HELP = `Usage: ship [options]

Scaffold a production-ready React Native app from Code with Beto templates.

Options:
  --name <dir>           Project directory name (required in non-interactive mode)
  --template <name>      Template to use (default: platano)
  --app-name <name>      Display name for app stores (default: title-cased --name)
  --bundle-id <id>       Bundle identifier (default: com.<os-user>.<slug>)
  --payments             Enable RevenueCat payments (default)
  --no-payments          Disable payments
  --rc-key-ios <key>     RevenueCat test store API key for iOS
  --rc-key-android <key> RevenueCat test store API key for Android (default: same as iOS)
  --non-interactive      Force non-interactive mode (implied by any other flag)
  --dry-run              Preview what would happen without making changes
  --help                 Show this help message
  --version              Show version

Examples:
  ship                                                    Launch interactive TUI
  ship --name my-app                                      Non-interactive with defaults
  ship --name my-app --app-name "Cool App" --bundle-id com.me.coolapp
  ship --name my-app --no-payments --dry-run
  ship --name my-app --payments --rc-key-ios appl_test123 --rc-key-android goog_test456
`;

interface CliFlags {
  name: string;
  template: string;
  appName: string;
  bundleId: string;
  payments: boolean;
  rcKeyIos: string;
  rcKeyAndroid: string;
  dryRun: boolean;
}

function log(msg: string) {
  process.stderr.write(msg + "\n");
}

function fail(msg: string, hint?: string): never {
  process.stderr.write(`error: ${msg}\n`);
  if (hint) process.stderr.write(`  ${hint}\n`);
  process.exit(1);
}

function parseFlags(argv: string[]): CliFlags {
  const args = argv.slice(2);

  let name = "";
  let template = "platano";
  let appName = "";
  let bundleId = "";
  let payments = true;
  let rcKeyIos = "";
  let rcKeyAndroid = "";
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    switch (arg) {
      case "--name":
        name = args[++i] ?? "";
        break;
      case "--template":
        template = args[++i] ?? "";
        break;
      case "--app-name":
        appName = args[++i] ?? "";
        break;
      case "--bundle-id":
        bundleId = args[++i] ?? "";
        break;
      case "--payments":
        payments = true;
        break;
      case "--no-payments":
        payments = false;
        break;
      case "--rc-key-ios":
        rcKeyIos = args[++i] ?? "";
        break;
      case "--rc-key-android":
        rcKeyAndroid = args[++i] ?? "";
        break;
      case "--dry-run":
        dryRun = true;
        break;
      case "--non-interactive":
        break;
      default:
        fail(`unknown flag: ${arg}`, `Run ship --help for usage.`);
    }
  }

  if (!name) {
    fail(
      "missing required flag: --name",
      "ship --name <project-dir> [--app-name <name>] [--bundle-id <id>]",
    );
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    fail(
      `invalid project name: "${name}"`,
      "Only letters, numbers, dashes, dots, and underscores are allowed.",
    );
  }

  const slug = toSlug(appName || name);
  const username = sanitizeUsername(userInfo().username);

  return {
    name,
    template,
    appName: appName || toTitleCase(name),
    bundleId: bundleId || `com.${username}.${slug}`,
    payments,
    rcKeyIos,
    rcKeyAndroid: rcKeyAndroid || rcKeyIos,
    dryRun,
  };
}

function resolveTemplate(name: string): Template {
  const match = TEMPLATES.find(
    (t) => t.name.toLowerCase().includes(name.toLowerCase()),
  );
  if (!match) {
    const available = TEMPLATES.map((t) => t.name).join(", ");
    fail(`unknown template: "${name}"`, `Available templates: ${available}`);
  }
  return match;
}

async function dryRun(flags: CliFlags, template: Template) {
  log(`would check git access to ${template.repo}`);
  log(`would clone into ${flags.name}`);
  log(`would configure:`);
  log(`  app_name: ${flags.appName}`);
  log(`  bundle_id: ${flags.bundleId}`);
  log(`  slug: ${toSlug(flags.appName)}`);
  log(`  payments: ${flags.payments}`);
  if (flags.payments && flags.rcKeyIos) {
    log(`  rc_key_ios: ${flags.rcKeyIos}`);
  }
  if (flags.payments && flags.rcKeyAndroid) {
    log(`  rc_key_android: ${flags.rcKeyAndroid}`);
  }
  log(`would install dependencies`);
  log(`would initialize git repo with baseline commit`);
  log(`no changes made.`);
}

async function run(flags: CliFlags, template: Template) {
  track("cli_started");

  log(`checking access to ${flags.template}...`);
  const diagnosis = await diagnoseGitSetup(template.repo);
  if (diagnosis !== "ready") {
    track("access_check_failed", { template: template.name, reason: diagnosis });
    switch (diagnosis) {
      case "no-git":
        fail(
          "git is not installed",
          "Install git: https://git-scm.com/downloads\n  On macOS: xcode-select --install",
        );
        break;
      case "no-gh":
        fail(
          "GitHub CLI (gh) is not installed",
          "Install it: https://cli.github.com\n  On macOS: brew install gh",
        );
        break;
      case "gh-not-authenticated":
        fail(
          "GitHub CLI is not authenticated",
          `Run: gh auth login\n  Then retry: ship --name ${flags.name}`,
        );
        break;
      case "git-credential-issue":
        fail(
          "git can't access GitHub — credential helper not configured",
          `Run: gh auth setup-git\n  Then retry: ship --name ${flags.name}`,
        );
        break;
      case "no-access":
        fail(
          `access denied for ${flags.template} template`,
          `Ensure you have access: ${URLS.platano}\n  Then retry: ship --name ${flags.name}`,
        );
        break;
    }
  }
  track("access_check_passed", { template: template.name });

  log(`cloning ${flags.template} into ${flags.name}...`);
  const cloneResult = await cloneRepo(template.repo, flags.name);
  if (!cloneResult.ok) {
    fail(
      cloneResult.error!,
      `ship --name ${flags.name}`,
    );
  }
  track("clone_success", { template: template.name });

  const config: OnboardingResult = {
    appName: flags.appName,
    slug: toSlug(flags.appName),
    bundleId: flags.bundleId,
    payments: flags.payments,
    rcTestKeyIos: flags.rcKeyIos,
    rcTestKeyAndroid: flags.rcKeyAndroid,
  };

  log(`configuring project...`);
  track("onboarding_complete", { template: template.name });
  const configResult = await configureProject(flags.name, config);
  if (!configResult.ok) {
    fail(
      configResult.error!,
      `Failed during project configuration. Directory "${flags.name}" may be partially set up.`,
    );
  }
  track("configure_success", { template: template.name });

  const output = [
    `name: ${flags.name}`,
    `app_name: ${config.appName}`,
    `bundle_id: ${config.bundleId}`,
    `slug: ${config.slug}`,
    `payments: ${config.payments}`,
    `template: ${flags.template}`,
    `directory: ${flags.name}`,
  ].join("\n");

  log(`done`);
  process.stdout.write(output + "\n");

  await trackAndWait("cli_complete", { template: template.name });
}

export const NON_INTERACTIVE_FLAGS = [
  "--name",
  "--help",
  "--version",
  "--dry-run",
  "--non-interactive",
  "--template",
  "--app-name",
  "--bundle-id",
  "--payments",
  "--no-payments",
  "--rc-key-ios",
  "--rc-key-android",
];

export function isNonInteractive(argv: string[]): boolean {
  return argv.slice(2).some((arg) => NON_INTERACTIVE_FLAGS.includes(arg));
}

export async function runCli(argv: string[]): Promise<void> {
  const args = argv.slice(2);

  if (args.includes("--help")) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  if (args.includes("--version")) {
    process.stdout.write(`ship ${pkg.version}\n`);
    process.exit(0);
  }

  const flags = parseFlags(argv);
  const template = resolveTemplate(flags.template);

  if (flags.dryRun) {
    await dryRun(flags, template);
  } else {
    await run(flags, template);
  }
}
