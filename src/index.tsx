#!/usr/bin/env bun
import { isNonInteractive, runCli } from "./cli";

if (isNonInteractive(process.argv)) {
  await runCli(process.argv);
} else {
  const { createCliRenderer } = await import("@opentui/core");
  const { createRoot } = await import("@opentui/react");
  const { App } = await import("./app");

  const renderer = await createCliRenderer({ exitOnCtrlC: false });
  createRoot(renderer).render(<App />);
}
